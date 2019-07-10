document.getElementById('submit').addEventListener('click', loginUser);

function loginUser() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let opts = {
        email: email,
        password: password
    }


    let user;

    fetch('/sign-in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(opts)
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        if (data.result != null) {
            sessionStorage.setItem('user', JSON.stringify(data.result));
            sessionStorage.setItem('loggedin', true);
            location.replace("/");
        } else {
            //display message
        }
    }).catch(function(err) {
        console.log(err);
    });

}