let user = JSON.parse(sessionStorage.getItem('user'));
let loggedin2 = sessionStorage.getItem('loggedin');
let redirect = sessionStorage.getItem('redirect');

if (redirect !== null && loggedin2 === "true") {
    sessionStorage.removeItem('redirect');
    location.replace(redirect);
}
let name = document.getElementById('name');
let login = document.getElementById('login');
let loggout = document.getElementById('logout');

if (user != null && loggedin2) {
    login.setAttribute('class', 'hidden');
    loggout.setAttribute('class', '');
    name.setAttribute('class', '');
    name.innerHTML = 'Welcome, ' + user.Name;

    let apiToken = sessionStorage.getItem('apiToken');

    if (apiToken == null) {
        fetch('https://opentdb.com/api_token.php?command=request')
            .then(function(response) {
                return response.json();
            }).then(function(data) {
                if (data.response_message == "Token Generated Successfully!") {
                    sessionStorage.setItem('apiToken', data.token)
                }
            }).catch(function(err) {
                console.log(err);
            });
    }
}

function clearSession(event) {
    event.preventDefault();
    sessionStorage.clear();
    login.setAttribute('class', '');
    loggout.setAttribute('class', 'hidden');
    name.setAttribute('class', 'hidden');
}

function logout(event) {
    event.preventDefault();
    sessionStorage.clear();
    location.replace('/');
}

function checkLoggedIn(event) {
    event.preventDefault();
    if (loggedin2 != null && loggedin2 === 'true') {
        location.replace('/create-review');
    } else {
        sessionStorage.setItem('redirect', '/create-review');
        location.replace('/login');
    }
}