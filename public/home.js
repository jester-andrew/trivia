console.log('connected');
let user = JSON.parse(sessionStorage.getItem('user'));
let loggedin = sessionStorage.getItem('loggedin');

let name = document.getElementById('name');
let login = document.getElementById('login');
let loggout = document.getElementById('logout');

if (user != null && loggedin) {
    login.setAttribute('class', 'hidden');
    loggout.setAttribute('class', '');
    name.setAttribute('class', '');
    name.innerHTML = 'Welcome, ' + user.Name;
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