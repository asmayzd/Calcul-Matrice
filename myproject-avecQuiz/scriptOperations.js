document.addEventListener('DOMContentLoaded', () => {
    // Sélectionne l'élément du bouton de calcul
    const calculateButton = document.getElementById('calculate');
    // Sélectionne les conteneurs pour les matrices A et B, ainsi que le conteneur du résultat
    const matrixAContainer = document.getElementById('matrix-a-container');
    const matrixBContainer = document.getElementById('matrix-b-container');
    const resultContainer = document.getElementById('result-matrix-container');
    // Sélectionne les éléments pour afficher les matrices et les résultats
    const resultMatrix = document.getElementById('result-matrix');
    const resultsSection = document.getElementById('results');
    const scoreDisplay = document.getElementById('score');
    const questionNumberDisplay = document.getElementById('question-number');
    const currentOperationDisplay = document.getElementById('current-operation');

    // Initialise le numéro de la question actuelle et le score
    let currentQuestion = 0;
    let score = 0;
    // Définit les opérations disponibles
    const operations = ['addition', 'soustraction', 'multiplication', 'transposition'];

    // Ajoute un écouteur d'événement pour le bouton de calcul
    calculateButton.addEventListener('click', checkUserResult);

    // Fonction pour obtenir l'opération suivante à effectuer
    function getNextOperation() {
        // Retourne l'opération en fonction de l'index de la question actuelle
        return operations[currentQuestion % operations.length];
    }

    // Fonction pour afficher l'opération actuelle à l'utilisateur
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

    // Fonction pour générer les tableaux de matrices pour la question actuelle
    function generateMatrixTables() {
        const operation = getNextOperation();
        displayCurrentOperation(operation);
        const rows = 3; // Nombre de lignes
        const cols = 3; // Nombre de colonnes

        // Crée la table de la matrice A
        createMatrixTable('matrix-a', rows, cols);
        if (operation !== 'transposition') {
            // Affiche et crée la table de la matrice B si l'opération n'est pas une transposition
            matrixBContainer.style.display = 'block';
            createMatrixTable('matrix-b', rows, cols);
        } else {
            // Cache la matrice B si l'opération est une transposition
            matrixBContainer.style.display = 'none';
        }
        // Crée la table de saisie des résultats
        createResultInputTable(rows, cols);
        // Met à jour le numéro de la question
        updateQuestionNumber();
    }

    // Fonction pour créer un tableau de matrice avec des valeurs aléatoires
    function createMatrixTable(matrixId, rows, cols) {
        const table = document.getElementById(matrixId);
        table.innerHTML = ''; // Vide le contenu précédent de la table
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                const randomValue = Math.floor(Math.random() * 10); // Génère une valeur aléatoire entre 0 et 9
                td.textContent = randomValue;
                td.dataset.value = randomValue; // Stocke la valeur dans un dataset
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }

    // Fonction pour créer le tableau de saisie des résultats
    function createResultInputTable(rows, cols) {
        resultMatrix.innerHTML = ''; // Vide le contenu précédent de la table des résultats
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-input';
                input.dataset.row = i; // Stocke la position de la ligne
                input.dataset.col = j; // Stocke la position de la colonne
                td.appendChild(input);
                tr.appendChild(td);
            }
            resultMatrix.appendChild(tr);
        }
    }

    // Fonction pour obtenir les valeurs de la matrice depuis le tableau HTML
    function getMatrixValues(matrixId) {
        const table = document.getElementById(matrixId);
        const cells = table.getElementsByTagName('td');
        const matrix = [];
        for (let cell of cells) {
            const row = parseInt(cell.parentElement.rowIndex);
            const col = parseInt(cell.cellIndex);
            if (!matrix[row]) matrix[row] = [];
            matrix[row][col] = parseFloat(cell.dataset.value); // Récupère la valeur stockée dans le dataset
        }
        return matrix;
    }

    // Fonction pour obtenir les valeurs saisies par l'utilisateur
    function getUserMatrixValues() {
        const inputs = resultMatrix.getElementsByClassName('matrix-input');
        const matrix = [];
        for (let input of inputs) {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            if (!matrix[row]) matrix[row] = [];
            matrix[row][col] = parseFloat(input.value); // Récupère la valeur saisie par l'utilisateur
        }
        return matrix;
    }

    // Fonction pour vérifier la réponse de l'utilisateur
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

    // Fonction pour comparer deux matrices
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

    // Fonction pour transposer une matrice
    function transposeMatrix(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    // Fonction pour additionner deux matrices
    function addMatrices(matrixA, matrixB) {
        return matrixA.map((row, i) =>
            row.map((value, j) => value + matrixB[i][j])
        );
    }

    // Fonction pour soustraire une matrice d'une autre
    function subtractMatrices(matrixA, matrixB) {
        return matrixA.map((row, i) =>
            row.map((value, j) => value - matrixB[i][j])
        );
    }

    // Fonction pour multiplier deux matrices
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

    // Fonction pour afficher le score final
    function displayFinalScore() {
        // Retirer l'affichage des matrices dans le résultat final
        matrixAContainer.style.display = 'none';
        matrixBContainer.style.display = 'none';
        resultContainer.style.display = 'none';
        currentOperationDisplay.style.display = 'none';


        // Affichage de la section de résultats finaux
        resultsSection.style.display = 'block';
        scoreDisplay.textContent = `Votre score est: ${score} / 5`;
        
        calculateButton.classList.add('hide'); // Cache le bouton de calcul
    }

    // Fonction pour mettre à jour le numéro de la question actuelle
    function updateQuestionNumber() {
        questionNumberDisplay.textContent = `Question ${currentQuestion + 1} sur 5`;
    }

    // Initialisation des tables de matrices lors du chargement de la page
    generateMatrixTables();
});
