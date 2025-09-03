<?php
header('Content-Type: application/json');
$correctPass='123456';
if ($_SERVER['REQUEST_METHOD']==='POST'){
    $input=json_decode(file_get_contents('php://input'),true);
    echo json_encode(['success'=>($input['pass'] ?? '') === $correctPass]);
}
?>