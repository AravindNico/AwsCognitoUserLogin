$(function() {
    console.log("hi")
    function validateForm(){
        return false;
    }
    AWSCognito.config.region = 'us-east-1';
    var identityPoolId = 'us-east-1:44180da0-f498-46cb-b8d9-015fc9940ce0';
    var poolData = { 
            UserPoolId : 'us-east-1_Gvm48neUv',
            ClientId : '12avgas528p4hjqlh817odrnug'
        };
    var userPool =  new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    
    
    function authenticateUser(username,password){

        var authenticationData = {
            Username : username,
            Password : password,
        };
        console.log(authenticationData)
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        var userData = {
            Username : username,
            Pool : userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                console.log('idToken + ' + result.idToken.jwtToken);
                alert("Successfully Loggedin")
            },

            onFailure: function(err) {
                console.log("auth error:",err)
                alert(err);
            },

        });
    }
    function verifyUser(cognitoUser,verifycode){
        console.log(cognitoUser)
        cognitoUser.confirmRegistration(verifycode, true, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
            $('#myModal').modal('hide');
            window.location.href = '/verify.html';
            
        });
    } 
    function resendVerifyCode(cognitoUser){
        console.log("resendVerifyCode")
        cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) {
                alert(err);
                return;
               }
            alert(result);
        });
    }
    function deleteUser(cognitoUser){
        console.log("deleteUser")
        cognitoUser.deleteUser(function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
            $('#myModal').modal('hide');
        });
    }
    function addUser(username,email,phone,password,confirmpassword){    
        var cognitoUser;
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

        var attributeList = [];
        
        var dataEmail = {
            Name : 'email',
            Value : email
        };
        
        var dataPhoneNumber = {
            Name : 'phone_number',
            Value : phone
        };
        console.log(dataPhoneNumber)

        var dataGivenName = {
            Name : 'given_name',
            Value : username
        };
    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);
    var attributeGivenName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataGivenName);

        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);
        attributeList.push(attributeGivenName);

        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
                alert(err);
                return;
            }
            cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            $('#myModal').modal({backdrop: 'static', keyboard: false})
            $('#myModal').modal('show');
            $('#verify-submit').click(function(e) {
                e.preventDefault();
                var verifycode = $('#verifycode').val()
                verifyUser(cognitoUser,verifycode)
                console.log(verifycode)
            });
            
        });
        $('resend-verify-code').click(function(){
            console.log("resend")
            resendVerifyCode(cognitoUser)
        })
        $('delete-user').click(function(){
            console.log("delete")
            deleteUser(cognitoUser)
        })
    }

    $('#login-submit').click(function(e) {
        e.preventDefault();
        var username = $('#username').val()
        var password = $('#password').val()
        authenticateUser(username,password)
        console.log(username,password)
    });

    $('#register-submit').click(function(e) {
        e.preventDefault();
        var username = $('#regusername').val()
        var email = $('#regemail').val()
        var phone = $('#phnum').val()
        var password = $('#regpassword').val()
        var confirmpassword = $('#confirm-password').val()

        addUser(username,email,phone,password,confirmpassword)
        console.log(username,email,password,confirmpassword,phone)
    });

    $('#login-form-link').click(function(e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

});