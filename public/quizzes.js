if (user != null) {
    fetch("/quizzes?id=" + user.ID)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            let userQuizList = document.getElementById('user-quizzes');
            let publicQuizList = document.getElementById('public-quizzes');

            let li = '';
            for (let i = 0; i < data.user.length; i++) {
                li += '<li><a onclick="startQuiz(' + data.user[i].ID + ')">' + data.user[i].Name + "</a></li>";
            }
            userQuizList.innerHTML = li;
            li = '';
            for (let i = 0; i < data.public.length; i++) {
                li += '<li><a onclick="startQuiz(' + data.public[i].ID + ')">' + data.public[i].Name + "</a></li>";
            }
            publicQuizList.innerHTML = li;
        }).catch(function(err) {
            console.log(err);
        });
}

function startQuiz(quizId) {
    fetch('/questions?id=' + quizId)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            localStorage.setItem("review-questions", JSON.stringify(data));
            location.replace('test-review.html');
        }).catch(function(err) {
            console.log(err);
        });
}