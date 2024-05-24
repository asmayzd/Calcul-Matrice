// Sélectionne l'élément canvas pour le captcha
let captchaText = document.getElementById('captcha');
// Obtient le contexte de rendu 2D du canvas
var ctx = captchaText.getContext("2d");
// Définit la police et la taille du texte pour le captcha
ctx.font = "25px Roboto";
// Définit la couleur de remplissage pour le texte
ctx.fillStyle = "#000";

let userText = document.getElementById('textBox');
let submitButton = document.getElementById('submitButton');
let output = document.getElementById('output');
let refreshButton = document.getElementById('refreshButton');


var captchaStr = "";

let alphaNums = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
                 'H', 'I', 'J', 'K', 'L', 'M', 'N', 
                 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 
                 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 
                 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
                 'j', 'k', 'l', 'm', 'n', 'o', 'p', 
                 'q', 'r', 's', 't', 'u', 'v', 'w', 
                 'x', 'y', 'z', '0', '1', '2', '3', 
                 '4', '5', '6', '7', '8', '9', '!', '.', '?', 'é', 'è', 'î'];


function generate_captcha() {
    let emptyArr = [];

    for (let i = 1; i <= 7; i++) {
        emptyArr.push(alphaNums[Math.floor(Math.random() * alphaNums.length)]);
    }

    captchaStr = emptyArr.join('');

    ctx.clearRect(0, 0, captchaText.width, captchaText.height);
    ctx.fillText(captchaStr, captchaText.width/4, captchaText.height/2);

    /*output.innerHTML = "";*/
}

generate_captcha();

function check_captcha() {
    if (userText.value === captchaStr) {
        output.className = "correctCaptcha";
        output.innerHTML = "Correct!";
        window.location.href = "login.html?returnUrl=quiz.html";
    } else {
        output.className = "incorrectCaptcha";
        output.innerHTML = "Incorret, essayer encore s'il vous plaît!";
        generate_captcha();
    }
}

userText.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
       check_captcha();
    }
});

submitButton.addEventListener('click', check_captcha);
refreshButton.addEventListener('click', generate_captcha);

