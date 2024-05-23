document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate');
    const matrixAContainer = document.getElementById('matrix-a-container');
    const matrixBContainer = document.getElementById('matrix-b-container');
    const resultContainer = document.getElementById('result-matrix-container');
    const resultMatrix = document.getElementById('result-matrix');
    const resultsSection = document.getElementById('results');
    const scoreDisplay = document.getElementById('score');
    const questionNumberDisplay = document.getElementById('question-number');
    const currentOperationDisplay = document.getElementById('current-operation');

    let currentQuestion = 0;
    let score = 0;
    const operations = ['addition', 'soustraction', 'multiplication', 'transposition'];

    calculateButton.addEventListener('click', checkUserResult);

    function getNextOperation() {
        return operations[currentQuestion % operations.length];
    }

    function displayCurrentOperation(operation) {
        switch (operation) {
            case 'addition':
                currentOperationDisplay.textContent = 'Addition des matrices A et B';
                break;
            case 'soustraction':
                currentOperationDisplay.textContent = 'Soustraction de la matrice B de la matrice A';
                break;
            case 'multiplication':
                currentOperationDisplay.textContent = 'Multiplication des matrices A et B';
                break;
            case 'transposition':
                currentOperationDisplay.textContent = 'Transposition de la matrice A';
                break;
            default:
                currentOperationDisplay.textContent = 'Opération inconnue';
        }
    }

    function generateMatrixTables() {
        const operation = getNextOperation();
        displayCurrentOperation(operation);
        const rows = 3;
        const cols = 3;

        createMatrixTable('matrix-a', rows, cols);
        if (operation !== 'transposition') {
            matrixBContainer.style.display = 'block';
            createMatrixTable('matrix-b', rows, cols);
        } else {
            matrixBContainer.style.display = 'none';
        }
        createResultInputTable(rows, cols);
        updateQuestionNumber();
    }

    function createMatrixTable(matrixId, rows, cols) {
        const table = document.getElementById(matrixId);
        table.innerHTML = '';
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                const randomValue = Math.floor(Math.random() * 10);
                td.textContent = randomValue;
                td.dataset.value = randomValue;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }

    function createResultInputTable(rows, cols) {
        resultMatrix.innerHTML = '';
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-input';
                input.dataset.row = i;
                input.dataset.col = j;
                td.appendChild(input);
                tr.appendChild(td);
            }
            resultMatrix.appendChild(tr);
        }
    }

    function getMatrixValues(matrixId) {
        const table = document.getElementById(matrixId);
        const cells = table.getElementsByTagName('td');
        const matrix = [];
        for (let cell of cells) {
            const row = parseInt(cell.parentElement.rowIndex);
            const col = parseInt(cell.cellIndex);
            if (!matrix[row]) matrix[row] = [];
            matrix[row][col] = parseFloat(cell.dataset.value);
        }
        return matrix;
    }

    function getUserMatrixValues() {
        const inputs = resultMatrix.getElementsByClassName('matrix-input');
        const matrix = [];
        for (let input of inputs) {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            if (!matrix[row]) matrix[row] = [];
            matrix[row][col] = parseFloat(input.value);
        }
        return matrix;
    }

    function checkUserResult() {
        const operation = getNextOperation();
        const matrixA = getMatrixValues('matrix-a');
        let correctResult;

        if (operation === 'transposition') {
            correctResult = transposeMatrix(matrixA);
        } else {
            const matrixB = getMatrixValues('matrix-b');
            switch (operation) {
                case 'addition':
                    correctResult = addMatrices(matrixA, matrixB);
                    break;
                case 'soustraction':
                    correctResult = subtractMatrices(matrixA, matrixB);
                    break;
                case 'multiplication':
                    correctResult = multiplyMatrices(matrixA, matrixB);
                    break;
                default:
                    alert('Opération non supportée');
            }
        }

        const userResult = getUserMatrixValues();
        const isCorrect = compareMatrices(correctResult, userResult);

        if (isCorrect) {
            score++;
        }

        currentQuestion++;
        if (currentQuestion < 5) {
            generateMatrixTables();
        } else {
            displayFinalScore();
        }

        // Ne pas afficher le feedback pour chaque question
    }

    function compareMatrices(matrixA, matrixB) {
        for (let i = 0; i < matrixA.length; i++) {
            for (let j = 0; j < matrixA[i].length; j++) {
                if (matrixA[i][j] !== matrixB[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    function transposeMatrix(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    function addMatrices(matrixA, matrixB) {
        return matrixA.map((row, i) =>
            row.map((value, j) => value + matrixB[i][j])
        );
    }

    function subtractMatrices(matrixA, matrixB) {
        return matrixA.map((row, i) =>
            row.map((value, j) => value - matrixB[i][j])
        );
    }

    function multiplyMatrices(matrixA, matrixB) {
        const result = Array(matrixA.length).fill().map(() => Array(matrixB[0].length).fill(0));
        for (let i = 0; i < matrixA.length; i++) {
            for (let j = 0; j < matrixB[0].length; j++) {
                for (let k = 0; k < matrixA[0].length; k++) {
                    result[i][j] += matrixA[i][k] * matrixB[k][j];
                }
            }
        }
        return result;
    }

    function displayFinalScore() {
        // Retirer l'affichage des matrices dans le résultat final
        matrixAContainer.style.display = 'none';
        matrixBContainer.style.display = 'none';
        resultContainer.style.display = 'none';
        currentOperationDisplay.style.display = 'none';


        // Affichage de la section de résultats finaux
        resultsSection.style.display = 'block';
        scoreDisplay.textContent = `Votre score est: ${score} / 5`;
        
        calculateButton.classList.add('hide');
    }

    function updateQuestionNumber() {
        questionNumberDisplay.textContent = `Question ${currentQuestion + 1} sur 5`;
    }

    // Initialisation des tables de matrices lors du chargement de la page
    generateMatrixTables();
});
