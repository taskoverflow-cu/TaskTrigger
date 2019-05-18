var SuccessSignInUrl = "calendar.html";

$(function () {
    // Common ui
    (function (window) {
        window.switchtab = function (tabname) {
            $(".container ." + tabname + "-tab").show().siblings().hide();
        };
    }(window));

    // Page Initialization
    (function (window) {
        let loggedUser = userGetCurrentUser();

        if (loggedUser) {
            switchtab('keepuser');
            // change prompt
            $(".keepuser-tab .loggedin-user").text(loggedUser.username);
        }
        else {
            switchtab('signin');
        }
    }(window));

    //validate
    (function (window) {
        //TODO more valid function
        // window.signInOK = false;
        
    }(window));


    // triggers
    (function (window) {
        
        // switch tab
        $(".signup-tab #to-signin").click(function () {
            $(".signin-tab").show().siblings(".signup-tab").hide();
        });

        $(".signin-tab #to-signup").click(function () {
            $(".signup-tab").show().siblings(".signin-tab").hide();
        });

        $(".keepuser-tab #btn-keepsignin").click(function () {
            window.location.href = SuccessSignInUrl;
        });

        $(".keepuser-tab  #resignin").click(function () {
            userSignOut();
            switchtab("signin");
        });

        $("#btn-signin").click(function (event) {
            // validate
            let loginEmail = $(".signin-tab #uname-signin");
            let loginPwd = $(".signin-tab #pwd-signin");
            if (loginEmail.hasClass("invalid") || loginPwd.hasClass("invalid")) {
                return false;
            }
            // signin
            let email = loginEmail.val();
            let pwd = loginPwd.val();
            event.preventDefault();
            userSignIn(email, pwd,
                (result) => {
                    // var accessToken = result.getAccessToken().getJwtToken();
                    /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
                    // var idToken = result.idToken.jwtToken;
                    window.location.href = SuccessSignInUrl;
                },
                (err) => {
                    alert(err);
                })
        });

        $("#btn-signup").click(function () {
            // validate
            let unameInput = $(".signup-tab #uname-signup");
            let pwdInput = $(".signup-tab #pwd-signup");
            let emailInput = $(".signup-tab #email-signup");
            if (unameInput.hasClass("invalid") || pwdInput.hasClass("invalid")
                || emailInput.hasClass("invalid")) {
                return false;
            }
            let email = emailInput.val();
            let uname = unameInput.val();
            let pwd = pwdInput.val();
            signUp(uname, pwd, email,
                (result) => {
                    console.log('Please finish signing up by confirming your email.');
                    switchtab('signin');
                },
                (err) => {
                    alert(err);
                });

            return false;
        })


    }(window));
});