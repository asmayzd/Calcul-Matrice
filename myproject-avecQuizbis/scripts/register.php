<?php
// Récupère les données brutes envoyées dans la requête POST
$post_json = file_get_contents('php://input');
// Décode les données JSON en tableau associatif PHP et les affecte à $_POST
$_POST = json_decode($post_json, true);

// Vérifie si le nom d'utilisateur est défini dans $_POST
if (isset($_POST['username'])) {
    $username = $_POST['username'];
    $password = md5($_POST['password']);
    $role = $_POST['role'] ?? 'user';
    // Vérifie si le fichier users.json existe
    if (file_exists('users.json')) {
        $users = file_get_contents('users.json');
        $users = json_decode($users, true);
        if (isset($users[$username])) {
            echo json_encode(array("error" => "User already exists!"));
        } else {
            $users[$username] = array("password" => $password, "role" => $role);
            file_put_contents('users.json', json_encode($users));
            echo json_encode($users);
        }
    } else {
        $users = [];
        $users[$username] = array("password" => $password, "role" => $role);
        file_put_contents('users.json', json_encode($users));
        echo json_encode($users);
    }
}
