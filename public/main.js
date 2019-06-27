let answered = false;
localStorage.setItem('correct', 0);

function getQuestions(event) {
    document.getElementById('results').setAttribute('class', 'hide');
    let valid = validateTriviaForm();
    if (valid) {
        let mes = document.getElementById('message');
        mes.setAttribute("class", "hide");
        let numberOfQuestions = document.getElementById('num').value;
        localStorage.setItem('total', numberOfQuestions);
        let categoryId = document.getElementById('cat').value;
        let difficulty = document.getElementById('dif').value;

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

        //insert the correct answer and shuffle questions
        incorrectAnswers.push(correctAnswer);
        shuffleQuestions(incorrectAnswers);

        //build multiple choice question
        let form = '<form class="q-form">';
        form += '<p class="question"><strong>Question ' + ((index * 1) + 1) + ':</strong><br> ' + question + '</p>';

        for (let i = 0; i < incorrectAnswers.length; i++) {
            form += "<p class='clickable' onclick='checkAnswer(event)'>" + incorrectAnswers[i] + "</p>";
        }
        form += '<input type="button" value="Next Question" onclick="nextQuestion();">'
        form += '<form class="q-form">';

        //output question hide trivia-set-up
        document.getElementById('set-up').setAttribute('class', 'hide');
        document.getElementById('question').setAttribute('class', '');
        document.getElementById('question').innerHTML = form;


    } else {
        //display trivia creator
        document.getElementById('set-up').setAttribute('class', '');
        document.getElementById('question').setAttribute('class', 'hide');
        document.getElementById('results').setAttribute('class', '');

        let correct = localStorage.getItem('correct');
        let total = localStorage.getItem('total');

        let classVal;

        let grade = ((correct * 1) / (total * 1)) * 100;
        let result;

        if (grade > 50) {
            result = '<p>Great job! Your Score is: <strong>' + correct + '/' + total + '<strong></p>';
            classVal = "success-message"
        } else {
            result = '<p>Better luck next time! Your Score is: <strong>' + correct + '/' + total + '<strong></p>';
            classVal = "err-message"
        }
        let results = document.getElementById('results');
        results.innerHTML = result;
        results.setAttribute('class', classVal);
        localStorage.setItem('correct', 0);
    }

    index = (index * 1) + 1;
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

function checkAnswer(event) {
    if (!answered) {
        let classVal;
        let elem = event.target;
        elem.style.backgroundColor = "rgb(232,104,10)";
        let answer = event.target.textContent;
        console.log(answer);
        console.log('being called');
        let index = localStorage.getItem('question#');
        let questions = JSON.parse(localStorage.getItem('questions'));
        let message = '';
        if (questions[(index * 1) - 1].correct_answer == answer) {
            message = "Nice, That is correct!";
            classVal = "success-message";
            let curval = localStorage.getItem('correct');
            localStorage.setItem('correct', (curval * 1) + 1);
        } else {
            message = "Sorry, that is incorrect. The correct answer is: " + questions[(index * 1) - 1].correct_answer;
            classVal = "err-message";
        }
        let mes = document.getElementById('message');

        mes.setAttribute('class', classVal);
        mes.innerHTML = message;
        answered = true;
    }

}

function nextQuestion() {
    if (answered) {
        answered = false;
        let mes = document.getElementById('message');
        let message = '';
        mes.innerHTML = message;
        mes.setAttribute('class', 'hide');

        createOutput();
    } else {
        let message = "please answer the question before continuing.";
        document.getElementById('message').innerHTML = message;
        document.getElementById('message').setAttribute('class', 'err-message');
    }
}

function validateTriviaForm() {
    let numberOfQuestions = document.getElementById('num').value;
    let categoryId = document.getElementById('cat').value;
    let difficulty = document.getElementById('dif').value;

    let mes = document.getElementById('message');
    let message = '';

    let valid = true;

    if (difficulty == 'easy' || difficulty == 'medium' || difficulty == 'hard') {
        valid = true;
    } else {
        valid = false;
        message = 'Please Select a difficulty level.';
    }

    if (numberOfQuestions < 0 || numberOfQuestions > 50 || numberOfQuestions == null || numberOfQuestions == '') {
        message = 'The number of questions needs to be between 1 and 50.';
        valid = false;

    }

    if (categoryId == null || categoryId == '') {
        message = 'Please Select a category.';
        valid = false;
    }

    if (valid) {
        return true;
    } else {
        mes.setAttribute('class', 'err-message');
        mes.innerHTML = message;

        return false;
    }


}