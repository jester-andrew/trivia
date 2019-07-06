let quizBtn = document.getElementById('create-quiz');
let nextBtn = document.getElementById('next');
let finishBtn = document.getElementById('finish');

let quiz = {
    quizName: "",
    private: "",
    questions: []
}

quizBtn.addEventListener('click', addQuiz);
nextBtn.addEventListener('click', next);
finish.addEventListener('click', finish);

function addQuiz() {
    quiz.quizName = document.getElementById('quiz-name').value;
    quiz.private = document.getElementById('private').value;
    console.log(quiz);

    document.getElementById('step1').setAttribute('class', 'hidden');
    document.getElementById('step2').setAttribute('class', '');
}

function next() {
    let question = document.getElementById('question').value;
    let answer = document.getElementById('answer').value;

    let qset = {
        ques: question,
        answer: answer
    }

    quiz.questions.push(qset);

    document.getElementById('question').innerHTML = '';
    document.getElementById('answer').innerHTML = '';

    console.log(quiz);
}

function finish() {
    let question = document.getElementById('question').value;
    let answer = document.getElementById('answer').value;

    let qset = {
        ques: question,
        answer: answer
    }

    quiz.questions.push(qset);

    //question import
    fetch('/create-quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(opts)
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
    }).catch(function(err) {
        console.log(err);
    });

    resetQuiz();
}

function resetQuiz() {
    quiz.quizName = '';
    quiz.questions = [];
}