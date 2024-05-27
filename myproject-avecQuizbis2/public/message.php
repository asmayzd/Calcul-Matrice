<?php
session_start();

header('Content-Type: application/json');

$filename = 'messages.json';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);
    $username = $postData['username'];
    $message = $postData['message'];

    // Lire les messages existants
    $messages = [];
    if (file_exists($filename)) {
        $messages = json_decode(file_get_contents($filename), true);
    }

    // Ajouter le nouveau message
    $messages[] = ['username' => $username, 'message' => $message];

    // Enregistrer les messages mis à jour
    file_put_contents($filename, json_encode($messages));

    echo json_encode(['success' => true, 'username' => $username, 'message' => $message]);
} else {
    // Récupérer les messages depuis le fichier
    if (file_exists($filename)) {
        $messages = json_decode(file_get_contents($filename), true);
    } else {
        $messages = [];
    }

    echo json_encode($messages);
}
?>
