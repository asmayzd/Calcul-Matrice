<?php
// Récupère les données brutes envoyées dans la requête POST
$post_json = file_get_contents('php://input');
// Décode les données JSON en tableau associatif PHP et les affecte à $_POST
$_POST = json_decode($post_json, true);

// Vérifie si le nom d'utilisateur est défini dans $_POST
if (isset($_POST['username'])) {
    $username = $_POST['username'];
    $password = md5($_POST['password']);
    // Vérifie si le fichier users.json existe
    if (file_exists('users.json')) {
        $users = file_get_contents('users.json');
        $users = json_decode($users, true);
        // Vérifie si l'utilisateur existe et si le mot de passe est correct
        if (isset($users[$username]) && $users[$username]['password'] == $password) {
            // Renvoie le rôle de l'utilisateur si la vérification est réussie
            echo json_encode(array("role" => $users[$username]['role']));
        } else {
            // Renvoie une erreur si le nom d'utilisateur ou le mot de passe est incorrect
            echo json_encode(array("error" => "Invalid username or password!"));
        }
    } else {
        // Renvoie une erreur si aucun utilisateur n'est trouvé
        echo json_encode(array("error" => "No users found!"));
    }
}
