<?php
header('Content-Type: application/json; charset=utf-8');

$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$results = [];

// پاسبک ساده
$greetings = ['سلام', 'hi', 'خوبی', 'هلو'];
if (in_array(strtolower($q), $greetings)) {
    $results[] = "سلام عزیز! لطفاً مدل ماشین یا قطعه را بنویسید.";
} else {
    $results[] = "محصولی یافت نشد. لطفاً با ۰۹۳۷۰۷۶۹۱۹۱ یا ۰۹۹۲۱۳۵۲۰۸۸ تماس بگیرید.";
}

echo json_encode($results);
