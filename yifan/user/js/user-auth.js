$(function(){
    /* Some wrapper function, used to operate with RDS */
    
    /**
     * Wrapper function, besides signIn for cognito userpool, it also retrieve currentUser information
     */
    window.userSignIn = function(email, password, onSuccess, onFailure){
        signIn(email, password, (result)=>{
            // TODO get user info
            $.ajax( {
                url:'https://nc2630k8b3.execute-api.us-east-1.amazonaws.com/Test_041519/user/get-by-email/' + email,
                method:'GET',
                crossDomain: true,
                success: (data)=>{
                    localStorage['currentUser'] = JSON.stringify(data) ;
                    onSuccess(result);
                },
                error:(err)=>{
                    signOut();
                    onFailure(err);
                }});
        }, onFailure);
    }

    /**
     * wrapper function, remove both cognito info and customized user info
     */
    window.userSignOut = function(){
        signOut();
        localStorage.removeItem('currentUser');
    }

    /**
     * return RDS user info
     */
    window.userGetCurrentUser = function(){
        if( 'currentUser' in localStorage){
            return JSON.parse(localStorage.getItem('currentUser'));
        }
        return null;
    }
});