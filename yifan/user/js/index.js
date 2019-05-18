

$(function () {
    // Global
    (function (window) {
        window.$messages = $('.messages-content');
        window.loginUrl = "portal.html";
        window.currentUUID = create_UUID();
        window.authToken = null;

        function create_UUID() {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (d) {
                var r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (d == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        }

        window.updateScrollbar = function () {
            $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
                scrollInertia: 10,
                timeout: 0
            });
        }

        window.setDate = function () {
            let d = new Date();
            let m;
            if (m != d.getMinutes()) {
                m = d.getMinutes();
                $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
            }
        }


        window.postResponseMessage = function (message) {
            if ($('.message-input').val() != '') {
                return false;
            }
            $('<div class="message loading new"><figure class="avatar"><img src="img/bat.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
            updateScrollbar();
            setTimeout(function () {
                $('.message.loading').remove();
                $('<div class="message new"><figure class="avatar"><img src="img/bat.png" /></figure>' +
                    message + '</div>').appendTo($('.mCSB_container')).addClass('new');
                setDate();
                updateScrollbar();
            }, 500 + (Math.random() * 5) * 100);
        }

    }(window));

    // Initialization
    (function () {
        let welcomeMessage = "Hi, what can I do for you?";
        $messages.mCustomScrollbar();

        M.AutoInit();

        // check authenticated user
        getCredentialJWTTokensAsync().then((token) => {
            if (token) {
                // Set current token!!
                authToken = token;
            }
        }).catch((err) => {
            // jump to login
            window.location.href = loginUrl;
            // console.log(err);
        });



        (function showWelcomeMessage() {
            setTimeout(function () {
                postResponseMessage(welcomeMessage);
            }, 100);
        }());

        (function showCurrentUserName() {
            $("#currentUserName").text(getCurrentUser().username);
        }());
    }());

    // Trigger
    (function () {
        let globalUserPoolId = window.appconfig.cognito.userPoolId;
        let globalUserPoolClientAppId = window.appconfig.cognito.userPoolClientId;
        let globalIdentityPoolId = window.appconfig.cognito.identityPool;
        let globalRegion = window.appconfig.cognito.region;
        let globalLF0ApiUrl = window.appconfig.api.LF0URL;
        let globalLF0Method = appconfig.api.LF0Method1;

        if (!(globalUserPoolId &&
            globalUserPoolClientAppId &&
            globalRegion && globalIdentityPoolId && globalLF0ApiUrl && globalLF0Method)) {
            console.log("not enough global config!");
            return;
        }


        $(window).on('keydown', function (e) {
            if (e.which == 13) {
                return commucatateWithChatBot();
            }
        })

        $(".user-profile .avatar").click(function (e) {
            e.stopPropagation();
            $("#signout-dropdown").stop().slideToggle(100);
        });

        $("#signout-dropdown").click(function () {
            signOut();
            window.location.href = loginUrl;
        });
        $(document).click(function (e) {

            $("#signout-dropdown").stop().slideUp(100);

        });

        // send message to chatbot
        $('.message-submit').click(function () {

            return commucatateWithChatBot();
        });

        function commucatateWithChatBot() {
            let message = $('.message-input').val();
            if ($.trim(message) == '') {
                return false;
            }
            postUserMessage(message);

            getCredentialKeys(authToken, function () {
                //
                let secretAccessKey = AWS.config.credentials.secretAccessKey;
                let accessKeyId = AWS.config.credentials.accessKeyId;
                let sessionToken = AWS.config.credentials.sessionToken;
                // console.log(accessKeyId);
                // console.log(secretAccessKey);
                // console.log(sessionToken);
                var apigClient = apigClientFactory.newClient();

                var apigClient = apigClientFactory.newClient({
                    accessKey: accessKeyId,
                    secretKey: secretAccessKey,
                    sessionToken: sessionToken,
                    region: globalRegion
                });
                let postBody ={
                    message: message,
                    uuid: currentUUID
                };
                // sendIAMRequestToLF0Async(secretAccessKey, accessKeyId, sessionToken, message, currentUUID)
                apigClient.chatbotPost(null, postBody)
                    .then((response) => {
                        // console.log(typeof response);
                        // let chatbotMsg = parseResultToMessage(response);
                        let chatbotMsg = response.data.body.message;
                        postResponseMessage(chatbotMsg);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
            return false;
        }
      
        /* pust User message on screen*/
        function postUserMessage(message) {
            if ($.trim(message) == '') {
                return false;
            }
            $('<div class="message message-personal">' + message + '</div>').appendTo($('.mCSB_container')).addClass('new');
            setDate();
            $('.message-input').val(null);
            updateScrollbar();
        }

        /* Deprecated, previous API, used for User pool Authentication */
        function getChatbotResponse(userMessage) {
            $.ajax({
                method: 'POST',
                // url: appconfig.api.invokeUrl + '/cb',
                url: appconfig.api.invokeUrl + '/chatbot',
                headers: {
                    Authorization: authToken
                },
                data: JSON.stringify({
                    uuid: currentUUID,
                    message: userMessage
                }),
                contentType: 'application/json',
                success: completeRequest,
                error: function ajaxError(jqXHR, textStatus, errorThrown) {
                    // console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                    // console.error('Response: ', jqXHR.responseText);
                    // alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
                }
            });
        }
        function completeRequest(result) {
            postResponseMessage(parseResultToMessage(result));
        }


    }());
})
