getQuestions();

function getQuestions() {
    let numberOfQuestions = 2;
    let categoryId = 16;
    let difficulty = "easy";

    const BASEURL = 'https://opentdb.com/api.php';

    let queryString = '?amount=' + numberOfQuestions;
    if (categoryId != null) {
        queryString += '&category=' + categoryId;
    }

    if (difficulty != null) {
        queryString += '&difficulty=' + difficulty;
    }

    let requestURL = BASEURL + queryString;

    console.log(requestURL);

    let obj = getJson(requestURL);


}

function getJson(url) {

    let obj = fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(responseJson) {
            console.log(responseJson.results);
            localStorage.setItem('question#', 0);
            localStorage.setItem('questions', JSON.stringify(responseJson.results));
            createOutput();
        })
        .catch(error => console.error(error));
}

function createOutput() {
    let index = localStorage.getItem('question#');
    let questions = JSON.parse(localStorage.getItem('questions'));
    console.log(questions[index]);
    if (index < questions.length) { //make sure questions are still available
        //build question

        let question = questions[index].question;
        let correctAnswer = questions[index].correct_answer;
        let incorrectAnswers = questions[index].incorrect_answers;

        //insert the correct answer and shiffle questions
        incorrectAnswers.push(correctAnswer);
        shuffleQuestions(incorrectAnswers);

        //build multiple choice question
        let form = '<form class="q-form">';
        form += '<p class="question">' + question + '</p>';

        for (let i = 0; i < incorrectAnswers.length; i++) {
            form += '<p>' + incorrectAnswers[i] + '</p>';
        }

        form += '<form class="q-form">';

        //output question hide trivia-set-up
        document.getElementById('set-up').setAttribute('class', 'hide');
        document.getElementById('question').innerHTML = form;


    } else {
        //display trivia creator
    }

    index = (index * 1) + 1;
    console.log(index);
    localStorage.setItem('question#', index);
}

function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}