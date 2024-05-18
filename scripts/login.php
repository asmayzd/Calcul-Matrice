<?php
$post_json = file_get_contents('php://input');
$_POST = json_decode($post_json, true);

if (isset($_POST['username'])) {
    $username = $_POST['username'];
    $password = md5($_POST['password']);
    if (file_exists('users.json')) {
        $users = file_get_contents('users.json');
        $users = json_decode($users, true);
        if (isset($users[$username]) && $users[$username]['password'] == $password) {
            echo json_encode(array("role" => $users[$username]['role']));
        } else {
            echo json_encode(array("error" => "Invalid username or password!"));
        }
    } else {
        echo json_encode(array("error" => "No users found!"));
    }
}
