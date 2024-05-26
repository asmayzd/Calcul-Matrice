<?php
$post_json = file_get_contents('php://input');
$_POST = json_decode($post_json, true);

if (isset($_POST['username'])) {
    $username = $_POST['username'];
    $password = md5($_POST['password']);
    $role = $_POST['role'] ?? 'user';
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
