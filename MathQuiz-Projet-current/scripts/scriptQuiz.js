// Partie relati au quiz
// ----------------------------------------------------------------
// version 3 avec score
let currentQuestion = 0; // Compte la question actuelle
let score = 0; // Compte la note finale
const totalQuestions = 3; // Nombre total de questions

let matrices = [];
let correctPolynomials = [];

// Génère une matrice 3x3 avec des valeurs aléatoires comprises entre 0 et 9
function generateMatrix() {
    let matrix = [];
    for (let i = 0; i < 3; i++) {
        matrix[i] = [];
        for (let j = 0; j < 3; j++) {
            matrix[i][j] = Math.floor(Math.random() * 10);
        }
    }
    return matrix;
}

// Affiche la matrice dans la table HTML
function displayMatrix(matrix) {
    let matrixTable = document.getElementById("matrix");
    matrixTable.innerHTML = "";

    matrix.forEach(row => {
        let tr = document.createElement("tr");
        row.forEach(value => {
            let td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });
        matrixTable.appendChild(tr);
    });
}

// Calcule le polynôme caractéristique de la matrice 3x3
function calculateCharacteristicPolynomial(matrix) {
    // Calcul du déterminant de la matrice 3x3
    let detA = (
        matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
        matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
        matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
    );

    // Calcul de tr(A) (trace de la matrice)
    let trA = matrix[0][0] + matrix[1][1] + matrix[2][2];

    // Calcul de tr(A^2)
    let trA2 = (
        matrix[0][0] ** 2 + matrix[0][1] * matrix[1][0] + matrix[0][2] * matrix[2][0] +
        matrix[1][0] * matrix[0][1] + matrix[1][1] ** 2 + matrix[1][2] * matrix[2][1] +
        matrix[2][0] * matrix[0][2] + matrix[2][1] * matrix[1][2] + matrix[2][2] ** 2
    );

    // Calcul des coefficients du polynôme caractéristique
    let a = 1;
    let b = -trA;
    let c = (trA ** 2 - trA2) / 2;
    let d = -detA;

    return [a, b, c, d];
}

// Génère les questions (matrices et polynômes caractéristique) pour les questions
function generateQuestions() {
    for (let i = 0; i < totalQuestions; i++) {
        let matrix = generateMatrix();
        let polynomial = calculateCharacteristicPolynomial(matrix);

        matrices.push(matrix);
        correctPolynomials.push(polynomial);
    }
}

// Vérifie si les coefficients saisis par l'utilisateur sont corrects
function verifyAnswer() {
    // Récupérer les coefficients saisis par l'utilisateur
    let userA = parseFloat(document.getElementById("coeff-a").value);
    let userB = parseFloat(document.getElementById("coeff-b").value);
    let userC = parseFloat(document.getElementById("coeff-c").value);
    let userD = parseFloat(document.getElementById("coeff-d").value);
    
    // Obtenir les coefficients corrects pour la question actuelle
    let correctPolynomial = correctPolynomials[currentQuestion];
    
    // Comparer les coefficients calculés et saisis par l'utilisateur
    if (correctPolynomial[0] === userA && correctPolynomial[1] === userB &&
        correctPolynomial[2] === userC && correctPolynomial[3] === userD) {
        // Si les coefficients sont corrects, ajouter un point à la note
        score++;
    }
}

// Afficher la question actuelle
function displayQuestion() {
    // Effacer les réponses précédentes
    document.getElementById("coeff-a").value = "";
    document.getElementById("coeff-b").value = "";
    document.getElementById("coeff-c").value = "";
    document.getElementById("coeff-d").value = "";

    // Afficher la matrice de la question actuelle - nouvelles valeurs aléatoires
    displayMatrix(matrices[currentQuestion]);
}

// Afficher les résultats finaux
function displayResults() {
    // Masquer la question et afficher les résultats
    document.getElementById("question-container").style.display = "none";
    document.getElementById("results").style.display = "block";
    
    // Afficher la note
    document.getElementById("score").textContent = `Votre note est de ${score} sur ${totalQuestions}.`;
}

// Fonction exécutée lors du clic sur le bouton "Suivant"
function handleNextQuestion() {
    // Vérifier la réponse de l'utilisateur
    verifyAnswer();
    
    // Passer à la question suivante ou afficher les résultats finaux
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        displayResults();
    }
}

// Attacher un gestionnaire d'événement au bouton "Suivant"
document.getElementById("next-question").addEventListener("click", handleNextQuestion);

// Initialiser les questions et afficher la première question
generateQuestions();
displayQuestion();
