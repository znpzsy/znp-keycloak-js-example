document.addEventListener("DOMContentLoaded", function() {
    /*// Initialize Keycloak
    const keycloak = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'master',
        clientId: 'js-client'
    });*/
    // Initialize Keycloak
    const keycloak = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'znp-realm',
        clientId: 'js-client'
    });

    const outputTextarea = document.getElementById('output');

    function logToTextarea(message) {
        const now = new Date();
        const timestamp = now.toLocaleString();
        outputTextarea.value += `[${timestamp}] ${message}\n`;
    }

    function showModal(title, message) {
        document.getElementById('feedbackModalLabel').textContent = title;
        document.getElementById('feedbackModalBody').textContent = message;

        const modal = new bootstrap.Modal(document.getElementById('feedbackModal'));
        modal.show();
    }


    keycloak.init({ 
        onLoad: 'check-sso' 
    }).then(function(authenticated) {
        logToTextarea(authenticated ? 'User is authenticated' : 'User is not authenticated');

        document.getElementById('loginBtn').addEventListener('click', function() {
            logToTextarea('Login button clicked');
            keycloak.login();
        });

        document.getElementById('logoutBtn').addEventListener('click', function() {
            logToTextarea('Logout button clicked');
            keycloak.logout();
        });

        document.getElementById('isLoggedInBtn').addEventListener('click', function() {
            const isLoggedInMessage = keycloak.authenticated ? 'User is logged in' : 'User is not logged in';
            logToTextarea('Is Logged In button clicked: ' + isLoggedInMessage);
            //alert(isLoggedInMessage);
            showModal('Login Status', isLoggedInMessage);
        });

        document.getElementById('accessTokenBtn').addEventListener('click', function() {
            if (keycloak.authenticated) {
                logToTextarea('Access Token button clicked: ' + keycloak.token);
                //alert('Access Token: ' + keycloak.token);
                showModal('Access Token', keycloak.token);
            } else {
                const notLoggedInMessage = 'User is not logged in';
                logToTextarea('Access Token button clicked: ' + notLoggedInMessage);
                alert(notLoggedInMessage);
            }
        });

        document.getElementById('showParsedTokenBtn').addEventListener('click', function() {
            if (keycloak.authenticated) {
                const parsedToken = keycloak.tokenParsed;
                logToTextarea('Show Parsed Access Token button clicked: ' + JSON.stringify(parsedToken, null, 2));
                //'Parsed Access Token: ' + JSON.stringify(parsedToken, null, 2));
                showModal('Parsed Access Token', JSON.stringify(parsedToken, null, 2));
            } else {
                const notLoggedInMessage = 'User is not logged in';
                logToTextarea('Show Parsed Access Token button clicked: ' + notLoggedInMessage);
                //alert(notLoggedInMessage);
                showModal('Login Status', notLoggedInMessage);
            }
        });

        document.getElementById('queryUserInfoBtn').addEventListener('click', function() {
            if (keycloak.authenticated) {
                const parsedToken = keycloak.tokenParsed;
                logToTextarea('Query User Info button clicked: ' + JSON.stringify(parsedToken, null, 2));


                fetch('http://localhost:8080/realms/znp-realm/protocol/openid-connect/userinfo', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + keycloak.token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('User Info:', data);
                        logToTextarea('API call successful: ' + JSON.stringify(data));
                        //alert('User Info: ' + JSON.stringify(data, null, 2));
                        showModal('User Info', JSON.stringify(data, null, 2));
                });
            } else {
                const notLoggedInMessage = 'User is not logged in';
                logToTextarea('Query User Info button clicked: ' + notLoggedInMessage);
                //alert(notLoggedInMessage);
                showModal('Login Status', notLoggedInMessage);
            }
        });

        document.getElementById('callApiBtn').addEventListener('click', function() {
            logToTextarea('Call API button clicked');
            if (keycloak.authenticated) {
                fetch('https://4b215443be964e33bc1ef0373940400c.api.mockbin.io/', {
                    headers: {
                        'Authorization': 'Bearer ' + keycloak.token
                    }
                })
                .then(response => response.json())
                .then(data => {
                    logToTextarea('API call successful: ' + JSON.stringify(data));
                    console.log(data);
                })
                .catch(error => {
                    logToTextarea('API call failed: ' + error);
                    console.error('Error:', error);
                });
            } else {
                const notLoggedInMessage = 'User is not logged in';
                logToTextarea('API call failed: ' + notLoggedInMessage);
                //alert(notLoggedInMessage);
                showModal('Login Status', notLoggedInMessage);
            }
        });


    }).catch(function() {
        console.log('Failed to initialize');
    });
});
