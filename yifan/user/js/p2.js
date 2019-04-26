
(function scopeWrapper($, wnidow) {

    let globalUserPoolId = window.appconfig.cognito.userPoolId;
    let globalUserPoolClientAppId = window.appconfig.cognito.userPoolClientId;
    let globalIdentityPoolId = window.appconfig.cognito.identityPool;
    let globalRegion = window.appconfig.cognito.region;
    if (!(globalUserPoolId &&
        globalUserPoolClientAppId &&
        globalRegion && globalIdentityPoolId)) {
        console.log("not enough global config!");
        return;
    }
    // userpool instance
    var poolData = {
        UserPoolId: globalUserPoolId,
        ClientId: globalUserPoolClientAppId
    };
    
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = globalRegion;
    }

    // OK
    window.signUp = function (username, password, email, onSuccess, onFailure) {
        // userpool,
        var attributeList = [];
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        attributeList.push(attributeEmail);

        userPool.signUp(username, password, attributeList, null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    };

    //OK
    window.signIn = function (username, password, onSuccess, onFailure) {

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password
        });
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });;
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    };

    // OK
    window.signOut = function () {
        getCurrentUser().signOut();
    };

    // OK
    window.resend_confirm = function (username, func) {
        createCognitoUser(username).resendConfirmationCode(func);
    }

    // OK
    window.getCurrentUser = function () {
        return userPool.getCurrentUser();
    };
    // OK
    window.createCognitoUser = function (username) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });
    }

    // OK
    window.getCredentialJWTTokensAsync = async function () {

        var authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
            var cognitoUser = getCurrentUser();
            // console.log(cognitoUser);
            if (cognitoUser) {
                cognitoUser.getSession(function sessionCallback(err, session) {
                    if (err) {
                        reject(err);
                    } else if (!session.isValid()) {
                        resolve(null);
                    } else {
                        resolve(session.getIdToken().getJwtToken());
                    }
                });
            } else {
                resolve(null);
            }
        });
        try {
            let resToken = await authToken;
            if (resToken) {
                return Promise.resolve(resToken);
            }
            else {
                return Promise.reject("Session is Invalid");
            }
        }
        catch{
            return Promise.reject("Error occurs when send request");
        }

    }

    /* using user Login token to get credential key */
    window.getCredentialKeys = function (authToken, getCredentialCallback) {
        // init credential instance
        AWS.config.region = globalRegion;
        let loginParams = {};
        loginParams[`cognito-idp.${globalRegion}.amazonaws.com/${globalUserPoolId}`] = authToken;
        // console.log(loginParams);
        // console.log(globalIdentityPoolId);
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: globalIdentityPoolId,
            Logins: loginParams  // 'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result.getIdToken().getJwtToken()
        });
        AWS.config.credentials.get(getCredentialCallback); // !!In the call back, we can get those keys
        // accessKeyId = AWS.config.credentials.accessKeyId;
        // secretAccessKey = AWS.config.credentials.secretAccessKey;
        // sessionToken = AWS.config.credentials.sessionToken;
        // console.log(accessKeyId);
        // console.log(secretAccessKey);
        // console.log(sessionToken);
    }

}(jQuery, window));

