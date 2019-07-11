let questions = JSON.parse(localStorage.getItem('review-questions'));
console.log(questions);

let question = document.getElementById('question');
let answer = document.getElementById('answer');
let next = document.getElementById('next');

console.log(question);
console.log(answer);

question.addEventListener('click', showAnswer);
answer.addEventListener('click', showQuestion);
next.addEventListener('click', nextQuestion);

let index = 0;

question.innerHTML = questions[index].Question;
answer.innerHTML = questions[index].Answer;

function showAnswer() {
    answer.setAttribute('class', '');
    question.setAttribute('class', 'hidden');
}

function showQuestion() {
    answer.setAttribute('class', 'hidden');
    question.setAttribute('class', '');
}

function nextQuestion() {
    console.log(index);
    if (index < questions.length - 1) {
        index++;
        question.innerHTML = questions[index].Question;
        answer.innerHTML = questions[index].Answer;
        showQuestion();
    } else {
        index = 0;
        question.innerHTML = questions[index].Question;
        answer.innerHTML = questions[index].Answer;
        showQuestion();
    }
}