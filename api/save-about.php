<?php
if ($_SERVER['REQUEST_METHOD']==='POST' && isset($_POST['text'])){
    file_put_contents('../data/about.txt', $_POST['text']);
    echo json_encode(['message'=>'? ??? ????? ??']);
}else{
    echo json_encode(['message'=>'? ??? ?? ?????']);
}
?>