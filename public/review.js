let quizBtn = document.getElementById('create-quiz');
let nextBtn = document.getElementById('next');
let finishBtn = document.getElementById('finish');

let quiz = {
    quizName: "",
    id: "",
    private: "",
    questions: []
}

let iteration = 0;

quizBtn.addEventListener('click', addQuiz);
nextBtn.addEventListener('click', next);
finish.addEventListener('click', finishQuiz);

function addQuiz() {
    quiz.quizName = document.getElementById('quiz-name').value;
    quiz.private = document.getElementById('private').value;
    console.log(quiz);

    document.getElementById('step1').setAttribute('class', 'hidden');
    document.getElementById('step2').setAttribute('class', '');
}

function next() {
    let question = document.getElementById('question1').value;
    let answer = document.getElementById('answer').value;

    let qset = {
        ques: question,
        answer: answer
    }

    quiz.questions.push(qset);

    document.getElementById('question1').value = '';
    document.getElementById('answer').value = '';

    console.log(quiz);

    let output = document.getElementById('quiz-questions');
    if (iteration == 0) {
        iteration++;
        output.innerHTML = '';
    }
    let node = document.createElement('div');
    let questionNode = document.createElement('div');
    let answerNode = document.createElement('div');

    node.setAttribute('class', 'question-set')
    questionNode.setAttribute('class', 'question-node');
    answerNode.setAttribute('class', 'answer-node');

    let qTextNode = document.createTextNode(qset.ques);
    let atextNode = document.createTextNode(qset.answer);

    questionNode.appendChild(qTextNode);
    answerNode.appendChild(atextNode);

    node.appendChild(questionNode);
    node.appendChild(answerNode);

    output.appendChild(node);

}

function finishQuiz() {
    console.log('finish');

    let question = document.getElementById('question1').value;
    let answer = document.getElementById('answer').value;

    let user = JSON.parse(sessionStorage.getItem('user'));
    let id = user.ID;

    if (question != '' || answer != '') {
        document.getElementById('question1').value = '';
        document.getElementById('answer').value = '';

        let qset = {
            ques: question,
            answer: answer
        }

        quiz.questions.push(qset);
    }

    quiz.id = id;
    //question import
    fetch('/create-quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz)
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        if (data.success) {
            location.replace("/");
        } else {
            document.getElementById('message').innerHTML = data.message;
        }
    }).catch(function(err) {
        console.log(err);
    });

    resetQuiz();
}

function resetQuiz() {
    quiz.quizName = '';
    quiz.questions = [];
}