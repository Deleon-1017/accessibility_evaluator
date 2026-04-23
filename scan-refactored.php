<?php
// scan-refactored.php
// Database-driven accessibility scanner

/**
 * @var \Symfony\Component\DomCrawler\Crawler $crawler
 * @var \Symfony\Component\DomCrawler\Crawler $node
 */

session_start();

// Configure error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/php-errors.log');

// Check if composer autoload exists
$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    $_SESSION['scan_error'] = 'Composer dependencies not installed. Please run "composer install".';
    header('Location: index.php?error=1');
    exit;
}

// Include required files
require_once __DIR__ . '/security-helper.php';
require_once $autoloadPath;

// Initialize secure session
initSecureSession();

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

// Validate CSRF token
if (!isset($_POST['csrf_token']) || !validateCsrfToken($_POST['csrf_token'])) {
    $_SESSION['scan_error'] = 'Invalid security token. Please try again.';
    header('Location: index.php?error=1');
    exit;
}

// Validate scan type
$scanType = sanitizeInput($_POST['scan_type'] ?? '');
if (!in_array($scanType, ['url', 'html'])) {
    $_SESSION['scan_error'] = 'Invalid scan type';
    header('Location: index.php?error=1');
    exit;
}

// Set time limit for scanning
set_time_limit(60);

// Initialize results array
$results = [
    'scan_type' => $scanType,
    'issues' => [],
    'summary' => [
        'total_issues' => 0,
        'error_count' => 0,
        'warning_count' => 0,
        'info_count' => 0,
        'principles' => [
            'Perceivable' => 0,
            'Operable' => 0,
            'Understandable' => 0,
            'Robust' => 0
        ]
    ],
    'source_url' => '',
    'html_content' => '',
    'timestamp' => date('Y-m-d H:i:s'),
    'scan_id' => uniqid('scan_', true)
];

// Include helper functions from original scan.php
require_once __DIR__ . '/scan-helpers.php';

try {
    $htmlContent = '';
    
    // Fetch or get HTML content
    if ($scanType === 'url') {
        $url = filter_var(trim($_POST['website_url'] ?? ''), FILTER_VALIDATE_URL);
        
        if (!$url) {
            throw new Exception('Invalid URL provided. Please enter a valid URL starting with http:// or https://');
        }
        
        $parsedUrl = parse_url($url);
        if (!is_array($parsedUrl)) {
            throw new Exception('Invalid URL provided.');
        }
        $scheme = strtolower($parsedUrl['scheme'] ?? '');
        if (!in_array($scheme, ['http', 'https'], true)) {
            throw new Exception('Only http and https URLs are supported.');
        }
        
        $results['source_url'] = $url;
        $htmlContent = fetchUrlContent($url);
        
        if (empty($htmlContent)) {
            throw new Exception('Received empty response from URL');
        }
        
        if (strlen($htmlContent) > 5242880) {
            throw new Exception('Fetched HTML content is too large. Maximum size is 5MB.');
        }
        
        $results['html_content'] = $htmlContent;
        
    } else {
        $htmlContent = $_POST['html_code'] ?? '';
        
        if (empty(trim($htmlContent))) {
            throw new Exception('Please enter HTML code to analyze');
        }
        
        if (strlen($htmlContent) > 5242880) {
            throw new Exception('HTML content is too large. Maximum size is 5MB.');
        }
        
        $results['html_content'] = $htmlContent;
        
        // Wrap partial HTML
        if (!preg_match('/<!DOCTYPE\s+html|<html\s+/i', $htmlContent)) {
            $htmlContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Scanned Page</title></head><body>' .
                $htmlContent . '</body></html>';
        }
    }
    
    // Parse HTML with DomCrawler
    if (!class_exists('Symfony\Component\DomCrawler\Crawler')) {
        throw new Exception('DomCrawler class not found. Please install Symfony DomCrawler via Composer.');
    }
    
    if (!class_exists('Symfony\Component\CssSelector\CssSelectorConverter')) {
        throw new Exception('Symfony CssSelector component is missing. Run "composer require symfony/css-selector" then "composer install".');
    }
    
    /** @var \Symfony\Component\DomCrawler\Crawler $crawler */
    $crawler = new Symfony\Component\DomCrawler\Crawler();
    
    // Suppress libxml warnings
    $useInternalErrors = libxml_use_internal_errors(true);
    $crawler->addHtmlContent($htmlContent, 'UTF-8');
    $parseErrors = libxml_get_errors();
    libxml_clear_errors();
    libxml_use_internal_errors($useInternalErrors);
    
    // Connect to database and load accessibility checker
    require_once __DIR__ . '/config/database.php';
    require_once __DIR__ . '/accessibility-checker.php';
    
    $db = getDatabaseConnection();
    $checker = new AccessibilityChecker($db, $crawler, $htmlContent);
    
    // Run all accessibility checks from database
    $allIssues = $checker->runAllChecks();
    
    // Add HTML parsing errors if any
    if (!empty($parseErrors)) {
        $allIssues[] = [
            'code' => '4.1.1',
            'principle' => 'Robust',
            'type' => 'warning',
            'title' => 'HTML parsing issues detected',
            'description' => 'The HTML contains parsing errors which may affect accessibility tools.',
            'recommendation' => 'Validate and fix HTML markup to ensure proper parsing by assistive technologies.',
            'severity' => 'low',
            'context' => 'Parsing errors: ' . count($parseErrors),
            'element' => '',
            'line' => null
        ];
    }
    
    // Process results
    $results['issues'] = $allIssues;
    $results['summary']['total_issues'] = count($allIssues);
    
    foreach ($allIssues as $issue) {
        switch ($issue['type']) {
            case 'error':
                $results['summary']['error_count']++;
                break;
            case 'warning':
                $results['summary']['warning_count']++;
                break;
            case 'info':
                $results['summary']['info_count']++;
                break;
        }
        
        if (isset($results['summary']['principles'][$issue['principle']])) {
            $results['summary']['principles'][$issue['principle']]++;
        }
    }
    
    // Calculate accessibility score
    $maxScore = 100;
    $errorDeduction = $results['summary']['error_count'] * 5;
    $warningDeduction = $results['summary']['warning_count'] * 2;
    $infoDeduction = $results['summary']['info_count'] * 1;
    $totalDeduction = min($errorDeduction + $warningDeduction + $infoDeduction, 70);
    $results['score'] = max($maxScore - $totalDeduction, 0);
    
    // Store results in session
    $_SESSION['scan_results'] = $results;
    
    // Save to database
    try {
        require_once __DIR__ . '/scan-results-db.php';
        $scanDB = new ScanResultsDB($db);
        $scanDB->saveScanResults($results);
        error_log("Scan results saved to database: " . $results['scan_id']);
    } catch (Exception $e) {
        error_log("Failed to save scan to database: " . $e->getMessage());
        
        // Fallback to JSON file
        $reportsDir = __DIR__ . '/reports';
        if (!is_dir($reportsDir)) {
            @mkdir($reportsDir, 0755, true);
        }
        $reportFile = $reportsDir . '/' . $results['scan_id'] . '.json';
        @file_put_contents($reportFile, json_encode($results, JSON_PRETTY_PRINT));
    }
    
    // Redirect to results page
    header('Location: results.php?scan_id=' . $results['scan_id']);
    exit;
    
} catch (Exception $e) {
    $_SESSION['scan_error'] = 'Error: ' . $e->getMessage();
    error_log('Scan error: ' . $e->getMessage());
    error_log('Trace: ' . $e->getTraceAsString());
    header('Location: index.php?error=1');
    exit;
}
