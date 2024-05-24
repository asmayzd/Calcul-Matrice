// Déclaration des variables
let matrix; // Matrice actuelle

const resultElement = document.getElementById('result');
const descriptionElement = document.getElementById('math-descriptions');
const eigenvalueElements = document.getElementsByClassName('eigenvalues');
const eigenvectorElements = document.getElementsByClassName('eigenvectors');
const determinantElements = document.getElementsByClassName('determinant');
const diagonalizeElements = document.getElementsByClassName('diagonalize');
const mainElement = document.getElementsByClassName('main-element');


// Affiche la question actuelle
function showQuestion() {

    // Affiche les champs de saisie en fonction du type de question
    operation = document.getElementById('operation').value;
    mainElement[0].style.display = 'flex';
    if (operation === 'determinant') {
        determinantElements[0].style.display = 'block';
        eigenvectorElements[0].style.display = 'none';
        eigenvalueElements[0].style.display = 'none';
        diagonalizeElements[0].style.display = 'none';
    } else if (operation === 'eigenvalues') {
        eigenvalueElements[0].style.display = 'block';
        eigenvectorElements[0].style.display = 'none';
        determinantElements[0].style.display = 'none';
        diagonalizeElements[0].style.display = 'none';
    } else if (operation === 'eigenvectors') {
        eigenvectorElements[0].style.display = 'block';
        eigenvalueElements[0].style.display = 'none';
        determinantElements[0].style.display = 'none';
        diagonalizeElements[0].style.display = 'none';
    } else if (operation === 'diagonalize') {
        diagonalizeElements[0].style.display = 'block';
        eigenvectorElements[0].style.display = 'none';
        eigenvalueElements[0].style.display = 'none';
        determinantElements[0].style.display = 'none';
    }

}

// Fonctions de calcul et de formatage des résultats
function calculateDeterminant(matrix) {
    // Code pour calculer le déterminant
    return math.det(matrix);
}

function calculateEigenvalues(matrix) {
    // Code pour calculer les valeurs propres
    const { eigs, multiply, column, transpose, matrixFromColumns } = math
    const ans = eigs(matrix) // renvoie les valeurs et vecteurs propres
    const E = ans.values.map(value => parseFloat(value.toFixed(2))); // Convertir en valeurs fixes

    E.sort((a, b) => b - a);
    return E
}

function calculateEigenvectors(matrix) {
    // Calcule les vecteurs propres d'une matrice
    const { eigs, multiply, column, transpose, matrixFromColumns } = math
    const ans = eigs(matrix) // renvoie les valeurs et vecteurs propres
    const V = ans.eigenvectors

    // Trier les vecteurs propres en fonction des valeurs propres
    V.sort((a, b) => b.value - a.value);

    const unnormalizedEigenvectors = V.map((eigenvector) => {
        const { vector } = eigenvector;
        // Redimensionne the vector to a size of 2
        const resizedVector = vector.slice(0, 2);
        return { value: eigenvector.value, vector: resizedVector };
    })
    //console.log(V);
    //console.log(unnormalizedEigenvectors);
    return unnormalizedEigenvectors
}
// Envoie les informations d'identification pour l'enregistrement
function sendCredentials(username, password) {
    // Replace 'yourWebServiceURL' with the actual URL of your web service
    const url = '/scripts/register.php';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            let content = document.getElementsByClassName('gestion-utilisateur-content');
            let table = '<table id="users"><tr><th>Username</th><th>Role</th><th>Action</th></tr>';
            for (const user in data) {
                if (Object.hasOwnProperty.call(data, user)) {
                    const userInfo = data[user];
                    if (user != 'admin')
                        table += `<tr><td>${user}</td><td>${userInfo.role}</td><td><button type='button' onclick='deleteUser("${user}")'>supprimer</button></td></tr>`;
                    else
                        table += `<tr><td>${user}</td><td>${userInfo.role}</td><td></td></tr>`;
                }
            }
            table += '</table>';
            content[0].innerHTML = table;
        })
        .catch(error => {
            alert('Erreur lors de l\'enregistrement');
        });
}
// Supprime un utilisateur
function deleteUser(username) {

    const url = '/scripts/delete.php';
    //message de confirmation
    let confirmation = confirm("Voulez-vous vraiment supprimer cet utilisateur?");
    if (!confirmation) {
        return;
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            let content = document.getElementsByClassName('gestion-utilisateur-content');
            let table = '<table id="users"><tr><th>Username</th><th>Role</th><th>Action</th></tr>';
            for (const user in data) {
                if (Object.hasOwnProperty.call(data, user)) {
                    const userInfo = data[user];
                    if (user != 'admin')
                        table += `<tr><td>${user}</td><td>${userInfo.role}</td><td><button type='button' onclick='deleteUser("${user}")'>supprimer</button></td></tr>`;
                    else
                        table += `<tr><td>${user}</td><td>${userInfo.role}</td><td></td></tr>`;
                }
            }
            table += '</table>';
            content[0].innerHTML = table;
        })
        .catch(error => {
            alert('Erreur lors de la suppression');
        });

}

// Demande les informations d'identification à l'utilisateur
function promptForCredentials() {
    const username = prompt('Merci de saisir le nom d\'utilisateur:');
    const password = prompt('Merci de saisir le mot de passe:');

    if (username && password) {
        sendCredentials(username, password);
    } else {
        alert('Username or password not provided');
    }
}
// Fonction pour déconnecter l'utilisateur
function logout() {
    Cookies.remove('user');
    window.location.href = 'index.html';
}
// Fonction pour naviguer en affichant le contenu correspondant
function navigateByDisplay(object, className) {
    let elements = document.getElementsByClassName(className);
    let menu = document.getElementsByClassName('menu-button');
    let menuContent = document.getElementsByClassName('menu-content');
    for (let i = 0; i < menuContent.length; i++) {
        menuContent[i].style.display = 'none';
    }
    for (let i = 0; i < menu.length; i++) {
        menu[i].classList.remove('active');
    }
    const user = Cookies.get("user");
    if (className == 'gestion-utilisateur' && user && JSON.parse(user).role == 'admin') {
        let content = document.getElementsByClassName('gestion-utilisateur-content');
        fetch('/scripts/users.php',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json())
            .then(data => {
                let table = '<table id="users"><tr><th>Username</th><th>Role</th><th>Action</th></tr>';
                for (const user in data) {
                    if (Object.hasOwnProperty.call(data, user)) {
                        const userInfo = data[user];
                        if (user != 'admin')
                            table += `<tr><td>${user}</td><td>${userInfo.role}</td><td><button type='button' onclick='deleteUser("${user}")'>supprimer</button></td></tr>`;
                        else
                            table += `<tr><td>${user}</td><td>${userInfo.role}</td><td></td></tr>`;
                    }
                }
                table += '</table>';
                content[0].innerHTML = table;
            });
    } else {
        if (className == 'gestion-utilisateur' && (!user || JSON.parse(user).role == 'admin')) {
            alert('Vous n\'avez pas les droits nécessaires pour accéder à cette page');
            return;
        }
    }
    elements[0].style.display = 'block';
    if (object && object.classList)
        object.classList.add('active');
}
// Affiche ou masque les descriptions en fonction de la classe
function showDesc(className) {
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].style.display === 'block')
            elements[i].style.display = 'none';
        else
            elements[i].style.display = 'block';
    }
}
// Diagonalise une matrice
function diagonalize(matrix) {
    const { eigs, diag } = math
    const { values } = eigs(matrix);
    const formattedValues = values.map(value => value.toFixed(3));
    const D = diag(formattedValues.reverse());

    // Format D for display
    //const formattedD = D.map(row => row.map(value => value.toFixed(4)));
    //console.log(formattedValues);
    return D;
}

function formatMatrix(matrix) {
    // Code pour formater la matrice
    let formattedMatrix = '<div class="matrix-container"><p>M = </p><table class="matrix">';
    for (let i = 0; i < matrix.length; i++) {
        formattedMatrix += '<tr>';
        for (let j = 0; j < matrix[i].length; j++) {
            const element = matrix[i][j];
            formattedMatrix += `<td>${element}</td>`;
        }
        formattedMatrix += '</tr>';
    }
    formattedMatrix += '</table></div>';
    return formattedMatrix;
}

function formatEigenVectors(matrix) {
    let formattedMatrix = '<table class="eigenvectors">';
    for (let i = 0; i < matrix.length; i++) {
        formattedMatrix += '<tr>';
        formattedMatrix += `<td>Valeur propre : ${matrix[i].value.toFixed(2)}</td>`;
        formattedMatrix += `<td>Vecteur propre : [${matrix[i].vector.map((val) => val.toFixed(3)).join(', ')}]</td>`;
        formattedMatrix += '</tr>';
    }
    formattedMatrix += '</table>';
    return formattedMatrix;
}

function formatEigenValues(values) {
    let formattedMatrix = '<table class="eigenvectors">';
    for (let i = 0; i < matrix.length; i++) {
        formattedMatrix += '<tr>';
        formattedMatrix += `<td>Valeur propre : ${values[i].toFixed(2)}</td>`;
        formattedMatrix += '</tr>';
    }
    formattedMatrix += '</table>';
    return formattedMatrix;
}

function setupMatrix() {
    matrixSize = parseInt(document.getElementById('matrix-size').value);
    matrixInput = document.getElementById('matrix-input');
    matrixInput.innerHTML = '';

    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `element-${i}-${j}`;
            input.placeholder = `Element [${i + 1},${j + 1}]`;
            matrixInput.appendChild(input);
        }
        matrixInput.appendChild(document.createElement('br'));
    }

    if (matrixSize == 0) {
        document.getElementById('operation-section').style.display = 'none';
    } else
        document.getElementById('operation-section').style.display = 'flex';
}

function getMatrix() {
    matrix = [];
    let hasError = false;
    for (let i = 0; i < matrixSize; i++) {
        const row = [];
        for (let j = 0; j < matrixSize; j++) {
            if (document.getElementById(`element-${i}-${j}`).value == '' || isNaN(document.getElementById(`element-${i}-${j}`).value)) {
                document.getElementById(`element-${i}-${j}`).classList.add('error');
                hasError = true;
            } else {
                document.getElementById(`element-${i}-${j}`).classList.remove('error');
            }
            const element = parseFloat(document.getElementById(`element-${i}-${j}`).value);
            row.push(element);
        }
        matrix.push(row);
    }
    if (hasError) {
        return false;
    }
    return matrix;
}


function performOperation() {
    showQuestion();
    const matrix = getMatrix();
    if (!matrix) {
        return;
    }
    operation = document.getElementById('operation').value;
    let correctAnswer;
    let abscorrectAnswer;

    switch (operation) {
        case 'determinant':
            correctAnswer = calculateDeterminant(matrix);
            break;
        case 'eigenvalues':
            correctAnswer = calculateEigenvalues(matrix);
            correctAnswer = correctAnswer.map(value => parseFloat(value)).sort().join(',');
            break;
        case 'eigenvectors':
            correctAnswer = calculateEigenvectors(matrix);
            abscorrectAnswer = correctAnswer.map(eigenvector => eigenvector.vector.map(value => parseFloat(Math.abs(value)).toFixed(3)).sort().join(',')).join(';');
            correctAnswer = correctAnswer.map(eigenvector => eigenvector.vector.map(value => parseFloat(value).toFixed(3)).sort().join(',')).join(';');
            break;
        case 'diagonalize':
            correctAnswer = diagonalize(matrix);
            break;
        case 'name':
            break;
    }

    if (operation === 'eigenvalues') {
        resultElement.innerHTML = `<h3>La réponse correcte est : </h3> ${formatEigenValues(calculateEigenvalues(matrix))}`;

    } else if (operation === 'eigenvectors') {
        resultElement.innerHTML = `<h3>La réponse correcte est : </h3> ${formatEigenVectors(calculateEigenvectors(matrix))}`;


    } else if (operation === 'diagonalize') {

        resultElement.innerHTML = `<h3>La réponse correcte est : </h3> ${formatMatrix(correctAnswer)}`;

    } else if (operation === 'determinant') {
        resultElement.innerHTML = `<h3>La réponse correcte est : </h3> ${correctAnswer} <br>`;

    }
}
(function () {
    const user = Cookies.get("user");
    const urlParams = new URLSearchParams(window.location.search);
    const func = urlParams.get('func');
    if (func) {
        navigateByDisplay(this, func);
        if (func == 'calcul-matriciel') {
            document.getElementById('exercices').classList.add('active');
        } else {
            document.getElementById('users-management').classList.add('active');
        }
    }
    if (user) {
        let span = document.getElementById("user-name");
        span.innerHTML = JSON.parse(user).username;
        if (JSON.parse(user).role == 'admin') {
            document.querySelectorAll('.admin-role').forEach(function (el) {
                el.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.admin-role').forEach(function (el) {
                el.style.display = 'none';
            });
        }
        if (window.location.href.includes('index.html')) {
            document.getElementById('quiz-link').href = 'quiz.html';
        }
        //afficher le bloc #connected
        document.getElementById('connected').style.display = 'flex';
    } else {
        //afficher le bloc #not-connected
        if (window.location.href.includes('quiz.html')) {
            window.location.href = 'login.html?returnUrl=quiz.html';
        }
        document.getElementById('not-connected').style.display = 'flex';
    }

})();
