<?php
// Récupère les données brutes envoyées dans la requête POST
$post_json = file_get_contents('php://input');
// Décode les données JSON en tableau associatif PHP et les affecte à $_POST
$_POST = json_decode($post_json, true);

// Vérifie si le nom d'utilisateur est défini dans $_POST
if (isset($_POST['username'])) {
    // Récupère le nom d'utilisateur
    $username = $_POST['username'];
    // Vérifie si le fichier users.json existe
    if (file_exists('users.json')) {
        // Lit le contenu du fichier users.json
        $users = file_get_contents('users.json');
        $users = json_decode($users, true);
        // Vérifie si l'utilisateur existe
        if (isset($users[$username])) {
            // Supprime l'utilisateur du tableau
            unset($users[$username]);
            // Enregistre le tableau mis à jour dans le fichier users.json
            file_put_contents('users.json', json_encode($users));
            // Renvoie la liste des utilisateurs mise à jour
            echo json_encode($users);
        } else {
            // Renvoie une erreur si l'utilisateur n'est pas trouvé
            echo json_encode(array("error" => "User not found!"));
        }
    } else {
        // Renvoie une erreur si aucun utilisateur n'est trouvé
        echo json_encode(array("error" => "No users found!"));
    }
}
