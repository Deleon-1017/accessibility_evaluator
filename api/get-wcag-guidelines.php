<?php
/**
 * API Endpoint: Get WCAG Guidelines
 * 
 * Fetches WCAG guidelines from the database with optional filtering
 * by level and principle.
 * 
 * Query Parameters:
 * - level: Filter by conformance level (A, AA, AAA)
 * - principle: Filter by principle (Perceivable, Operable, Understandable, Robust)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Get database connection
$config = require __DIR__ . '/../config/db-config.php';
$dbConfig = $config['readonly']; // Use read-only connection for GET requests

try {
    $conn = new mysqli(
        $dbConfig['host'],
        $dbConfig['username'],
        $dbConfig['password'],
        $dbConfig['database'],
        $dbConfig['port']
    );
    
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset($dbConfig['charset']);
    
    // Get filter parameters
    $level = isset($_GET['level']) ? $_GET['level'] : null;
    $principle = isset($_GET['principle']) ? $_GET['principle'] : null;
    
    // Build query with filters
    $query = "SELECT * FROM wcag_criteria WHERE 1=1";
    $params = [];
    $types = "";
    
    if ($level && in_array($level, ['A', 'AA', 'AAA'])) {
        $query .= " AND level = ?";
        $params[] = $level;
        $types .= "s";
    }
    
    if ($principle && in_array($principle, ['Perceivable', 'Operable', 'Understandable', 'Robust'])) {
        $query .= " AND principle = ?";
        $params[] = $principle;
        $types .= "s";
    }
    
    $query .= " ORDER BY id";
    
    // Prepare and execute query
    $stmt = $conn->prepare($query);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $guidelines = [];
    
    while ($row = $result->fetch_assoc()) {
        $criterionId = $row['id'];
        
        // Fetch techniques for this criterion
        $techStmt = $conn->prepare("SELECT technique_code FROM wcag_techniques WHERE criterion_id = ?");
        $techStmt->bind_param("s", $criterionId);
        $techStmt->execute();
        $techResult = $techStmt->get_result();
        
        $techniques = [];
        while ($techRow = $techResult->fetch_assoc()) {
            $techniques[] = $techRow['technique_code'];
        }
        $techStmt->close();
        
        // Fetch examples for this criterion
        $exampleStmt = $conn->prepare("
            SELECT state, html_code, css_code, js_code, context 
            FROM wcag_examples 
            WHERE criterion_id = ?
            ORDER BY state
        ");
        $exampleStmt->bind_param("s", $criterionId);
        $exampleStmt->execute();
        $exampleResult = $exampleStmt->get_result();
        
        $examples = [
            'before' => null,
            'after' => null,
            'userGroups' => [],
            'keySummary' => [],
            'interactive' => ['enabled' => false],
            'principle' => $row['principle']
        ];
        
        while ($exampleRow = $exampleResult->fetch_assoc()) {
            $examples[$exampleRow['state']] = [
                'html' => $exampleRow['html_code'],
                'css' => $exampleRow['css_code'],
                'js' => $exampleRow['js_code'],
                'context' => $exampleRow['context']
            ];
        }
        $exampleStmt->close();
        
        // Fetch user groups
        $userGroupStmt = $conn->prepare("SELECT user_group FROM wcag_user_groups WHERE criterion_id = ?");
        $userGroupStmt->bind_param("s", $criterionId);
        $userGroupStmt->execute();
        $userGroupResult = $userGroupStmt->get_result();
        
        while ($ugRow = $userGroupResult->fetch_assoc()) {
            $examples['userGroups'][] = $ugRow['user_group'];
        }
        $userGroupStmt->close();
        
        // Fetch key summaries
        $summaryStmt = $conn->prepare("
            SELECT summary_text 
            FROM wcag_key_summaries 
            WHERE criterion_id = ? 
            ORDER BY display_order
        ");
        $summaryStmt->bind_param("s", $criterionId);
        $summaryStmt->execute();
        $summaryResult = $summaryStmt->get_result();
        
        while ($summaryRow = $summaryResult->fetch_assoc()) {
            $examples['keySummary'][] = $summaryRow['summary_text'];
        }
        $summaryStmt->close();
        
        // Fetch interactive config
        $interactiveStmt = $conn->prepare("SELECT enabled FROM wcag_interactive_config WHERE criterion_id = ?");
        $interactiveStmt->bind_param("s", $criterionId);
        $interactiveStmt->execute();
        $interactiveResult = $interactiveStmt->get_result();
        
        if ($interactiveRow = $interactiveResult->fetch_assoc()) {
            $examples['interactive']['enabled'] = (bool) $interactiveRow['enabled'];
        }
        $interactiveStmt->close();
        
        // Build guideline object
        $guideline = [
            'id' => $row['id'],
            'principle' => $row['principle'],
            'title' => $row['title'],
            'level' => $row['level'],
            'description' => $row['description'],
            'explanation' => $row['explanation'],
            'techniques' => $techniques,
            'examples' => $examples
        ];
        
        $guidelines[] = $guideline;
    }
    
    $stmt->close();
    $conn->close();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'count' => count($guidelines),
        'data' => $guidelines
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
