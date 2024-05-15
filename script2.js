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
    const ans = eigs(matrix) // returns {values: [E1,E2...sorted], eigenvectors: [{value: E1, vector: v2}, {value: e, vector: v2}, ...]
    const E = ans.values.map(value => parseFloat(value.toFixed(2))); // Convert to fixed values
    E.sort((a, b) => b - a);
    //console.log(E)
    return E
}

function calculateEigenvectors(matrix) {
    const { eigs, multiply, column, transpose, matrixFromColumns } = math
    const ans = eigs(matrix) // returns {values: [E1,E2...sorted], eigenvectors: [{value: E1, vector: v2}, {value: e, vector: v2}, ...]
    const V = ans.eigenvectors

    // Sort eigenvectors based on eigenvalues
    V.sort((a, b) => b.value - a.value);

    const unnormalizedEigenvectors = V.map((eigenvector) => {
        const { vector } = eigenvector;
        const magnitude = math.norm(vector); // Calculate the magnitude of the vector
        const unnormalizedVector = math.multiply(1 / magnitude, vector); // Scale the vector back to its original magnitude
        return { value: eigenvector.value, vector: unnormalizedVector };
    })
    //console.log(V);
    //console.log(unnormalizedEigenvectors);
    return unnormalizedEigenvectors
}

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

    document.getElementById('operation-section').style.display = 'flex';
}

document.getElementById('setupmat').addEventListener('click', setupMatrix);

function getMatrix() {
    matrix = [];
    for (let i = 0; i < matrixSize; i++) {
        const row = [];
        for (let j = 0; j < matrixSize; j++) {
            const element = parseFloat(document.getElementById(`element-${i}-${j}`).value);
            row.push(element);
        }
        matrix.push(row);
    }
    return matrix;
}


function performOperation() {
    showQuestion();
    const matrix = getMatrix();
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
            console.log("correctAnswer", correctAnswer);
            break;
        case 'eigenvectors':
            correctAnswer = calculateEigenvectors(matrix);
            abscorrectAnswer = correctAnswer.map(eigenvector => eigenvector.vector.map(value => parseFloat(Math.abs(value)).toFixed(3)).sort().join(',')).join(';');
            correctAnswer = correctAnswer.map(eigenvector => eigenvector.vector.map(value => parseFloat(value).toFixed(3)).sort().join(',')).join(';');
            console.log("correctAnswer.toString()", correctAnswer.toString());
            console.log("abscorrectAnswer.toString()", abscorrectAnswer.toString());
            break;
        case 'diagonalize':
            correctAnswer = diagonalize(matrix);
            console.log("diagonalize", correctAnswer)
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