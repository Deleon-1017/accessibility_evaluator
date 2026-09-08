<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/quiz-data.php';

function fetchQuizQuestionsFromDatabase(): ?array
{
    $config = require __DIR__ . '/../config/db-config.php';
    $dbConfig = $config['readonly'];

    $conn = new mysqli(
        $dbConfig['host'],
        $dbConfig['username'],
        $dbConfig['password'],
        $dbConfig['database'],
        $dbConfig['port']
    );

    if ($conn->connect_error) {
        return null;
    }

    $conn->set_charset($dbConfig['charset']);

    $tableCheck = $conn->prepare(
        'SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = ? LIMIT 1'
    );
    $tableName = 'quiz_questions';
    $tableCheck->bind_param('ss', $dbConfig['database'], $tableName);
    $tableCheck->execute();
    $tableCheck->store_result();

    if ($tableCheck->num_rows === 0) {
        $tableCheck->close();
        $conn->close();
        return null;
    }

    $tableCheck->close();

    $stmt = $conn->prepare(
        'SELECT id, principle, guideline_code, guideline_name, success_criterion, question, code_snippet, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty FROM quiz_questions ORDER BY id ASC'
    );

    if (!$stmt) {
        $conn->close();
        return null;
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }

    $stmt->close();
    $conn->close();

    return $questions;
}

try {
    $questions = fetchQuizQuestionsFromDatabase();
    if ($questions === null || count($questions) !== 40) {
        $questions = getQuizQuestions();
    }

    echo json_encode([
        'success' => true,
        'count' => count($questions),
        'questions' => $questions
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to load quiz questions.',
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
