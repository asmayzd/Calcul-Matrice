// ---------------------------------------------------------------------
// welcome.html : Boutton Commencer le Quiz
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("quiz-form");
    startButton.addEventListener("submit", function (event) {
    
    event.preventDefault(); // Prevent form submission
    window.location.href = "quiz.html";
    });
});

// ---------------------------------------------------------------------
// home.html : Boutton C'est parti !
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-form");
    startButton.addEventListener("submit", function (event) {
    
    event.preventDefault(); // Prevent form submission
    window.location.href = "captcha.html";
    });
});

