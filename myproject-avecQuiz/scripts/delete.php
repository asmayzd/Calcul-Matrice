<?php
$post_json = file_get_contents('php://input');
$_POST = json_decode($post_json, true);

if (isset($_POST['username'])) {
    $username = $_POST['username'];
    if (file_exists('users.json')) {
        $users = file_get_contents('users.json');
        $users = json_decode($users, true);
        if (isset($users[$username])) {
            unset($users[$username]);
            file_put_contents('users.json', json_encode($users));
            echo json_encode($users);
        } else {
            echo json_encode(array("error" => "User not found!"));
        }
    } else {
        echo json_encode(array("error" => "No users found!"));
    }
}