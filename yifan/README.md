1. 访问UserPool的JavaScriptSDK使用说明： https: //docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html
2. mysql数据库的地址： tasktrigger-test1.cf9tmf4lzflz.us-east-1.rds.amazonaws.com
3. JS调用了signUp之后，浏览器内还不是登录状态，getCurrentUser()返回null
4. User Pool中的 post authentication的lambda hooker，接收到的数据格式为：

   ```js
   {"version": "1",
   "region": "us-east-1",
   "userPoolId": "us-east-1_4pgPaolIC",
   "userName": "yyfyifan",
   "callerContext":
        {
            "awsSdkVersion": "aws-sdk-js-2.6.4",
            "clientId": "2j7b8ui0m88c453ich2vd8hckc"
        },
    "triggerSource": "PostAuthentication_Authentication",
    "request":
        {
            "userAttributes":
                {
                    "sub": "e7c1e474-4c45-4ac5-ba63-9e091a7e0315", "email_verified": "true",
                    "cognito:user_status": "CONFIRMED",
                    "cognito:email_alias": "125140762@qq.com",
                    "email": "125140762@qq.com"
                },
            "newDeviceUsed": False
        },
    "response": {}
    }
   ```
5. 该post authentication lambda的返回值和上面格式一样，所以可以直接`return event`

jerry login: http: //235239962467.signin.aws.amazon.com/console 
