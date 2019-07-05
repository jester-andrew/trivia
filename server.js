//libraries
const express = require('express');
const path = require('path');
const request = require('request');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
let bodyParser = require("body-parser");
require('dotenv').config();

//server set up
const PORT = process.env.PORT || 5000
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString: connectionString });

let app = express();

app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.listen(PORT, function() {
    console.log('The server is up and running on port ' + PORT);
});

//********************************Endpoints*****************************************

//get
app.get("/", (req, res) => res.render('pages/home'));

app.get("/create-review", (req, res) => res.render('pages/create-review'));

app.get("/play-trivia", (req, res) => res.render('pages/trivia-set-up'));

app.get("/questions", function(req, res) {
    console.log("getting questions");
});

app.get("/login", (req, res) => res.render('pages/login'));


//post
app.post("/create-quiz", function(req, res) {
    console.log("creating quiz");
    let userID = 1;


    //create quiz
    //create questions
});

app.post("/create-user", function(req, res) {
    let user = {
        email: req.body.email,
        name: req.body.name,
        pass: req.body.password
    }

    //hash password
    emailExists(user.email, function(exists) {
        if (!exists) {
            bcrypt.hash(user.pass, 10, function(err, hash) {

                if (!err) {
                    user.pass = hash;
                    result = insertUser(user);
                    res.json({ result: true, message: user.name + ', We have successfully created your account.' });
                } else {
                    console.log(err);
                    res.json({ result: false, message: user.name + ', there was an error creating your account. Try again later.' });
                }

            });
        } else {
            res.json({ result: false, message: user.name + ', that email is already in use.' });
        }

    });

});

app.post('/sign-in', function(req, res) {

    let email = req.body.email;
    let password = req.body.password;
    console.log(req.body);
    console.log('here');
    getUserByEmail(email, function(result) {
        //console.log(result);
        let user = result[0];
        bcrypt.compare(password, user.Password, function(err, response) {
            if (response) {
                console.log('password correct!');
                user.Password = '';
                res.json(user);
                res.end();
            } else {
                res.json({ result: null });
                res.end();
            }
        });
    });
});

//put

//delete

/*****************************************Model******************************** */

function insertUser(user) {

    let sql = 'INSERT INTO "Users" ("Email", "Name", "Password") VALUES ($1, $2, $3);';
    let values = [user.email, user.name, user.pass];

    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log("Inserted User Successfully!");
    });

}

function getUserByEmail(email, callback) {

    let sql = 'SELECT * FROM "Users" WHERE "Email" = $1;';
    let values = [email];

    pool.query(sql, values, function(err, result) {

        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log("Back from DB with result:");
        callback(result.rows);
    });
}

function emailExists(email, callback) {

    let sql = 'SELECT * FROM "Users" WHERE "Email" = $1';
    let values = [email];

    pool.query(sql, values, function(err, result) {

        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log("Back from DB with result:");
        if (result.rows.length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });

}