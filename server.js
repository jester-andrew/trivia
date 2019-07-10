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
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false })


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

app.get('/sign-up', (req, res) => res.render('pages/sign-up'))

app.get("/login", (req, res) => res.render('pages/login'));

app.get('/quizzes', function(req, res) {

    let quizzes = {
        user: [],
        public: []
    }

    let userId = req.query.id

    getPublicQuizzes(function(response) {
        if (response != null) {
            quizzes.public = response;
        }

        getUserQuizzes(userId, function(response2) {
            if (response2 != null) {
                quizzes.user = response2;
            }

            res.json(quizzes);
            res.end();
        });
    });


});

app.get("/questions", function(req, res) {
    console.log("getting questions");

    let quizId = req.query.id

    getQuizQuestions(quizId, function(response) {
        res.json(response);
        res.end();
    });
});




//post
app.post("/create-quiz", function(req, res) {
    console.log("creating quiz");

    //create quiz
    let quiz = {
        name: req.body.quizName,
        private: (req.body.private == "true" ? true : false),
        userid: req.body.id
    };

    // insert quiz
    insertQuiz(quiz, function(response) {

        if (response.success) {
            //insert questions
            let questions = req.body.questions;
            console.log(questions);
            for (let i = 0; i < questions.length; i++) {
                console.log(i);
                let question = {
                    quizId: response.id,
                    userId: req.body.id,
                    ques: questions[i].ques,
                    answer: questions[i].answer
                };

                insertQuestion(question);
            }
            res.json({ success: true, message: "<p>Your Quiz has been added successfully!</p>" });
            res.end();

        } else {
            res.json({ success: false, message: "<p>There was an issue adding your Quiz. Try again later.</p>" });
            res.end();
        }
    });
});

app.post("/create-user", urlencodedParser, function(req, res) {
    console.log(req.body)
    let user = {
        email: req.body.email,
        name: req.body.name,
        pass: req.body.password
    }
    console.log("email: " + user.email);
    //hash password
    emailExists(user.email, function(exists) {
        if (!exists) {
            bcrypt.hash(user.pass, 10, function(err, hash) {

                if (!err) {
                    user.pass = hash;
                    insertUser(user);
                    let message = { res: '<p class="success-message">' + user.name + ', We have successfully created your account.' + '</p>' };
                    res.render('pages/login', message);
                    res.end();
                } else {
                    console.log(err);
                    let message = {
                        res: '<p class="err-message">' + user.name + ', there was an error creating your account. Try again later.' + '</p>',
                        email: user.email
                    };
                    res.render('pages/sign-up', message);
                    res.end();
                }

            });
        } else {
            let message = { res: '<p class="err-message">' + user.name + ', that email is already in use.' + '</p>' };
            res.render('pages/sign-up', message);
            res.end();
        }

    });

});

app.post('/sign-in', function(req, res) {

    let email = req.body.email;
    let password = req.body.password;
    getUserByEmail(email, function(result) {
        //console.log(result);
        let user = result[0];
        bcrypt.compare(password, user.Password, function(err, response) {
            if (response) {
                console.log('password correct!');
                user.Password = '';
                res.json({ result: user });
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

function insertQuiz(quiz, callback) {
    let sql = 'INSERT INTO "Quizzes" ("Name", "public", "userid") VALUES ($1, $2 $3)  RETURNING "ID";';
    let values = [quiz.name, quiz.private, quiz.userid];
    pool.query(sql, values, function(err, result) {

        if (err) {
            console.log("Error in query insertQuiz: ")
            console.log(err);
            callback({ success: false });
        }
        console.log("Back from DB with result: ");
        console.log(result.rows[0].ID);

        callback({ success: true, id: result.rows[0].ID });
    });

}

function insertQuestion(questions) {
    let sql = 'INSERT INTO "Questions" ("QuizID", "UserID", "Question", "Answer") VALUES ($1, $2, $3, $4);';
    let success = false;

    let values = [questions.quizId, questions.userId, questions.ques, questions.answer];

    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log("Inserted Question Successfully!");
    });
}

function getPublicQuizzes(callback) {
    let sql = 'SELECT * FROM "Quizzes" WHERE "public" = $1';
    let values = [true];

    pool.query(sql, values, function(err, result) {

        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log("Back from DB with result:");
        callback(result.rows);
    });
}

function getUserQuizzes(id, callback) {
    let sql = 'SELECT * FROM "Quizzes" WHERE "userid" = $1';
    let values = [id];

    pool.query(sql, values, function(err, result) {

        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log("Back from DB with result:");
        callback(result.rows);
    });
}

function getQuizQuestions(quizId, callback) {
    let sql = 'SELECT * FROM "Questions" WHERE "QuizID" = $1';
    let values = [quizId];

    pool.query(sql, values, function(err, result) {

        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        console.log("Back from DB with result:");
        callback(result.rows);
    });
}