<?php
// Lit le contenu du fichier users.json
$users = file_get_contents('users.json');
// Affiche le contenu du fichier
echo $users;
