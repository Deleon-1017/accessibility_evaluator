<?php
$config = include __DIR__ . '/../../config/db-config.php';
if ($config === 1) { $config = include __DIR__ . '/../../config/db-config.php'; }
$db = $config['default'];

try {
    $dsn = "mysql:host={$db['host']};dbname={$db['database']};charset={$db['charset']}";
    $pdo = new PDO($dsn, $db['username'], $db['password'], $db['options']);
    $stmt = $pdo->prepare("SELECT state, html_code FROM wcag_examples WHERE criterion_id = '2.1.1'");
    $stmt->execute();
    $examples = $stmt->fetchAll();

    foreach ($examples as $example) {
        echo "State: " . $example['state'] . "\n";
        echo "HTML: " . $example['html_code'] . "\n";
        echo "-------------------\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
