// get config
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

    var poolData = {
        UserPoolId: globalUserPoolId,
        ClientId: globalUserPoolClientAppId
    };
    // Create user pool
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = globalRegion;
    }
    /**
     * Function to create a AWS cognitoUser object, not used for user.
     * @param {} username 
     */
    function createCognitoUser(username){
        return new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });
    }

    /**
     * User signup function, access two callbacks, only one of them will be called
     * onSuccess: called when signup success. Result will be passed as the sole parameter
     * onFailure: called when signup fail. Error will be passed as the sole parameter
     */
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

    /**
     * User signin function
     */
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

    /**
     * Signout function. It clears 
     */
    window.signOut = function () {
        getCurrentUser().signOut();
    };

    /**
     * Resend confrimation email to this username.
     */
    window.resend_confirm = function (username, onSuccess, onFailure) {
        createCognitoUser(username).resendConfirmationCode(function(err, result){
            if(err){
                onFailure(err);
            }
            else{
                onSuccess(result);
            }
        });
    }

    /**
     * Get current loggedin user
     * Return the information from localstorage
     */
    window.getCurrentUser = function () {
        return userPool.getCurrentUser();
    };
    
   

    // // OK
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


}(jQuery, window));

