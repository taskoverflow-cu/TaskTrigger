
$(function () {
    // Materialize Initialization
    // datetime picker
    (function (window) {
        $('.datepicker').datepicker();
        $('.timepicker').timepicker();
        $('.chips').chips();

        $('.chips-placeholder').chips({
            placeholder: 'Enter a tag',
            secondaryPlaceholder: '+Tag',
            limit: 20,
        });
        $('select').formSelect();

    }(window));

    // Common ui
    (function (window) {
        window.switchtab = function (tabname) {
            $(".container ." + tabname + "-tab").show().siblings().hide();
        };
    }(window));

    // Page Initialization
    (function (window) {
        let loggedUser = getCurrentUser();
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
        var SuccessSignInUrl = "index.html";
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
            signOut();
            switchtab("signin");
        });

        $("#btn-signin").click(function (event) {
            // validate
            let unameInput = $(".signin-tab #uname-signin");
            let pwdInput = $(".signin-tab #pwd-signin");
            if (unameInput.hasClass("invalid") || pwdInput.hasClass("invalid")) {
                return false;
            }
            // signup
            let uname = unameInput.val();
            let pwd = pwdInput.val();
            event.preventDefault();
            signIn(uname, pwd,
                (result) => {
                    var accessToken = result.getAccessToken().getJwtToken();
                    // result.user
                    /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
                    var idToken = result.idToken.jwtToken;
                    console.log(idToken);
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
                // TODO more validate
                return false;
            }

            $("#btn-signup").attr("disabled", true);
            let email = emailInput.val();
            let uname = unameInput.val();
            let pwd = pwdInput.val();

            signUp(uname, pwd, email,
                (result) => {
                    // to-continue-tab
                    switchtab('continue');
                    $(".confirm-email-placeholder").text(email);
                    $("#btn-signup").attr("disabled", false);
                    // savestate
                    localStorage.setItem("uname", uname);
                    localStorage.setItem("pwd", pwd);
                },
                (err) => {
                    // TODO, better prompt
                    alert(err);
                });

            return false;
        })

        $("#btn-continue").click(function () {
            // switchtab("confirm");
            let uname = localStorage.getItem("uname");
            let pwd = localStorage.getItem("pwd");
            signIn(uname, pwd,
                (result) => {
                    localStorage.removeItem("uname");
                    localStorage.removeItem("pwd");
                    window.location.href = SuccessSignInUrl;
                }, (err) => {
                    //TODO better prompt
                    alert('Not Confirmed');
                });
        });

        $("#btn-resend").click(function () {
            let uname = localStorage.getItem("uname");
            resend_confirm(uname, function (err, result) {
                if (!err) {
                    //TODO better prompt
                    alert('email has been resent.');
                }
            });
        });
    }(window));
});