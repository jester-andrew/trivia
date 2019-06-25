//libraries
const express = require('express');
const path = require('path');
const request = require('request');

//server set up
const PORT = process.env.PORT || 5000

let app = express();

app.use(express.static(path.join(__dirname, 'public')));
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

app.get("/trivia", function(req, res) {
    let baseUrl = 'https://opentdb.com/api.php?';
    let requestUrl = baseUrl;
})

//post

//put

//delete