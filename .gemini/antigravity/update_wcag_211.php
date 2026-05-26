<?php
$config = include __DIR__ . '/../../config/db-config.php';
if ($config === 1) { $config = include __DIR__ . '/../../config/db-config.php'; }
$db = $config['default'];

try {
    $dsn = "mysql:host={$db['host']};dbname={$db['database']};charset={$db['charset']}";
    $pdo = new PDO($dsn, $db['username'], $db['password'], $db['options']);
    
    // Fetch current 2.1.1 examples
    $stmt = $pdo->prepare("SELECT state, html_code FROM wcag_examples WHERE criterion_id = '2.1.1'");
    $stmt->execute();
    $examples = $stmt->fetchAll();

    foreach ($examples as $example) {
        $html = $example['html_code'];
        
        if ($example['state'] === 'before') {
            $new_html = preg_replace('/\s*<p id="statusMessage".*?<\/p>/s', '', $html);
            $new_html = preg_replace('/\s*<p class="helper-text error-text".*?<\/p>/s', '', $new_html);
        } else {
            $new_html = preg_replace('/\s*<p id="statusAfterMessage".*?<\/p>/s', '', $html);
            $new_html = preg_replace('/\s*<p class="helper-text success-text".*?<\/p>/s', '', $new_html);
        }
        
        $stmt_update = $pdo->prepare("UPDATE wcag_examples SET html_code = ? WHERE criterion_id = '2.1.1' AND state = ?");
        $stmt_update->execute([$new_html, $example['state']]);
        
        echo "Updated 2.1.1 " . $example['state'] . " state.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
