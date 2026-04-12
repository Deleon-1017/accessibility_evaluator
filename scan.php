<?php
// scan.php

/**
 * @var \Symfony\Component\DomCrawler\Crawler $crawler
 * @var \Symfony\Component\DomCrawler\Crawler $node
 */

// Built-in PHP functions stubs for IDE support
if (!function_exists('session_start')) {
    /**
     * Start new or resume existing session
     * @return bool
     */
    function session_start()
    {
        return true;
    }
}

session_start();

// Configure error reporting for production
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

// Include security helper
require_once __DIR__ . '/security-helper.php';

// Initialize secure session
initSecureSession();

// Include IDE Helper for VS Code
$ideHelperPath = __DIR__ . '/vendor/ide-helper.php';
if (file_exists($ideHelperPath)) {
    require_once $ideHelperPath;
}

require_once $autoloadPath;

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

// Function to extract element context
function getElementContext($element, $length = 200)
{
    if (empty($element))
        return '';

    // Remove HTML tags and get text
    $text = strip_tags($element);
    $text = trim($text);

    if (empty($text)) {
        return '[Empty element]';
    }

    if (strlen($text) > $length) {
        $text = substr($text, 0, $length) . '...';
    }

    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

// Function to safely get outer HTML
function getOuterHtml($node)
{
    try {
        if (method_exists($node, 'outerHtml')) {
            return $node->outerHtml();
        }
        elseif (method_exists($node, 'html')) {
            return $node->html();
        }
        else {
            return (string)$node;
        }
    }
    catch (Exception $e) {
        return '[Unable to extract element]';
    }
}

function normalizeWhitespace($text)
{
    $text = preg_replace('/\s+/', ' ', trim($text));
    return $text;
}

function getNodeText($node)
{
    try {
        return normalizeWhitespace($node->text('', true));
    }
    catch (Exception $e) {
        return '';
    }
}

// Function to find the line number of an HTML element in the source
function findLineNumber($htmlContent, $node)
{
    try {
        if (!$node || !isset($node->form)) {
            // Try to get the line number from DOMNode
            if (method_exists($node, 'getLineNo')) {
                $lineNo = $node->getLineNo();
                if ($lineNo > 0) {
                    return $lineNo;
                }
            }

            // Fallback: search by element name and attributes
            $element = $node->nodeName ?? 'div';
            $lines = explode("\n", $htmlContent);

            // Get element attributes for matching
            $attrString = '';
            if ($node->attributes) {
                foreach ($node->attributes as $attr) {
                    $attrString .= $attr->nodeName . '="' . $attr->nodeValue . '" ';
                }
            }

            // Search for the element in the HTML
            foreach ($lines as $lineNum => $line) {
                if (stripos($line, '<' . $element) !== false) {
                    // Check if attributes match
                    if (empty($attrString) || stripos($line, $attrString) !== false) {
                        return $lineNum + 1; // Line numbers are 1-indexed
                    }
                }
            }

            return null;
        }
    }
    catch (Exception $e) {
        return null;
    }

    return null;
}

function hasAriaLabel($node)
{
    $ariaLabel = trim((string)$node->attr('aria-label'));
    if ($ariaLabel !== '') {
        return true;
    }

    $ariaLabelledBy = trim((string)$node->attr('aria-labelledby'));
    return $ariaLabelledBy !== '';
}

function hasAccessibleName($node)
{
    if (hasAriaLabel($node)) {
        return true;
    }

    $title = trim((string)$node->attr('title'));
    if ($title !== '') {
        return true;
    }

    $text = getNodeText($node);
    return $text !== '';
}

function hasControlLabel($node, $crawler)
{
    if (hasAriaLabel($node)) {
        return true;
    }

    $id = trim((string)$node->attr('id'));
    if ($id !== '') {
        $labelFor = $crawler->filter('label[for="' . $id . '"]');
        if ($labelFor->count() > 0) {
            return true;
        }
    }

    try {
        $labelParent = $node->ancestors()->filter('label');
        if ($labelParent->count() > 0) {
            return true;
        }
    }
    catch (Exception $e) {
    // Ignore and fall through
    }

    return false;
}

function isPlaceholderLink($href)
{
    $href = strtolower(trim($href));
    if ($href === '' || $href === '#' || $href === '#!') {
        return true;
    }
    return strpos($href, 'javascript:') === 0;
}

function addIssue(&$issues, $issue)
{
    if (!isset($issue['type'])) {
        $issue['type'] = 'warning';
    }
    if (!isset($issue['severity'])) {
        $issue['severity'] = 'medium';
    }
    if (!isset($issue['element'])) {
        $issue['element'] = '';
    }
    if (!isset($issue['context'])) {
        $issue['context'] = getElementContext($issue['element']);
    }
    // Line number is passed from the caller
    if (!isset($issue['line'])) {
        $issue['line'] = null;
    }
    $issues[] = $issue;
}

// Function to fetch URL content with fallback
function fetchUrlContent($url)
{
    $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    $headers = [
        'User-Agent' => $userAgent,
        'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language' => 'en-US,en;q=0.9',
        'Cache-Control' => 'no-cache',
        'Pragma' => 'no-cache'
    ];

    // Method 1: Try Guzzle first
    if (class_exists('GuzzleHttp\Client')) {
        try {
            $client = new \GuzzleHttp\Client([
                'timeout' => 30,
                'connect_timeout' => 15,
                'headers' => $headers,
                'http_errors' => true,
                'verify' => false,
                'allow_redirects' => true
            ]);

            $response = $client->get($url);
            if ($response->getStatusCode() === 200) {
                return (string)$response->getBody();
            }
            error_log("Guzzle returned status: " . $response->getStatusCode());
        }
        catch (\Exception $e) {
            error_log("Guzzle failed: " . $e->getMessage());
        }
    }

    // Method 2: Try file_get_contents with context
    $headerString = "";
    foreach ($headers as $key => $value) {
        $headerString .= "$key: $value\r\n";
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => $headerString,
            'timeout' => 30,
            'follow_location' => 1,
            'ignore_errors' => true
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);

    $content = @file_get_contents($url, false, $context);
    if ($content !== false && !empty($content)) {
        return $content;
    }

    // Method 3: Try cURL as last resort
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_USERAGENT => $userAgent,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER => array_map(function ($k, $v) {
            return "$k: $v"; }, array_keys($headers), array_values($headers))
        ]);

        $content = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($content !== false && !empty($content)) {
            return $content;
        }
        if ($curlError) {
            error_log("cURL failed: " . $curlError);
        }
    }

    throw new Exception('Unable to fetch URL content using any available method. The server might be blocking automated requests.');
}

try {
    $htmlContent = '';

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

        // Fetch HTML content
        $htmlContent = fetchUrlContent($url);

        if (empty($htmlContent)) {
            throw new Exception('Received empty response from URL');
        }

        if (strlen($htmlContent) > 5242880) {
            throw new Exception('Fetched HTML content is too large. Maximum size is 5MB.');
        }

        $results['html_content'] = $htmlContent;

    }
    else {
        $htmlContent = $_POST['html_code'] ?? '';

        if (empty(trim($htmlContent))) {
            throw new Exception('Please enter HTML code to analyze');
        }

        // Limit HTML size
        if (strlen($htmlContent) > 5242880) {
            throw new Exception('HTML content is too large. Maximum size is 5MB.');
        }

        $results['html_content'] = $htmlContent;

        // If HTML is partial, wrap it for proper parsing
        if (!preg_match('/<!DOCTYPE\s+html|<html\s+/i', $htmlContent)) {
            $htmlContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Scanned Page</title></head><body>' .
                $htmlContent . '</body></html>';
        }
    }

    // Parse HTML with DomCrawler
    // Use conditional loading to avoid VS Code warnings
    if (class_exists('Symfony\Component\DomCrawler\Crawler')) {
        /** @var \Symfony\Component\DomCrawler\Crawler $crawler */
        $crawler = new Symfony\Component\DomCrawler\Crawler();
    }
    else {
        throw new Exception('DomCrawler class not found. Please install Symfony DomCrawler via Composer.');
    }

    if (!class_exists('Symfony\Component\CssSelector\CssSelectorConverter')) {
        throw new Exception('Symfony CssSelector component is missing. Run "composer require symfony/css-selector" then "composer install".');
    }

    // Suppress libxml warnings from malformed HTML to avoid breaking redirects
    $useInternalErrors = libxml_use_internal_errors(true);
    $crawler->addHtmlContent($htmlContent, 'UTF-8');
    $parseErrors = libxml_get_errors();
    libxml_clear_errors();
    libxml_use_internal_errors($useInternalErrors);

    // Run accessibility checks (keep your existing checks here)
    $allIssues = [];

    if (!empty($parseErrors)) {
        addIssue($allIssues, [
            'code' => '4.1.1',
            'principle' => 'Robust',
            'type' => 'warning',
            'title' => 'HTML parsing issues detected',
            'description' => 'The HTML contains parsing errors which may affect accessibility tools.',
            'recommendation' => 'Validate and fix HTML markup to ensure proper parsing by assistive technologies.',
            'severity' => 'low',
            'context' => 'Parsing errors: ' . count($parseErrors)
        ]);
    }

    // 1. Image alt attributes
    if ($crawler->filter('img')->count() > 0) {
        $images = $crawler->filter('img');
        foreach ($images as $imageNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($imageNode);
            $src = $node->attr('src');
            $alt = $node->attr('alt');
            $ariaHidden = strtolower((string)$node->attr('aria-hidden'));
            $role = strtolower((string)$node->attr('role'));

            if ($src && $alt === null && $ariaHidden !== 'true' && $role !== 'presentation' && $role !== 'none') {
                $elementHtml = getOuterHtml($node);
                $lineNumber = $imageNode->getLineNo() !== null ? $imageNode->getLineNo() : null;
                addIssue($allIssues, [
                    'code' => '1.1.1',
                    'principle' => 'Perceivable',
                    'type' => 'error',
                    'title' => 'Image missing alt text',
                    'description' => "Image is missing alternative text description.",
                    'element' => $elementHtml,
                    'selector' => 'img:not([alt])',
                    'recommendation' => 'Add descriptive alt text. For decorative images, use alt="" or aria-hidden="true".',
                    'severity' => 'high',
                    'line' => $lineNumber
                ]);
            }
        }
    }

    // 2. Page title check
    $titleNodes = $crawler->filter('title');
    if ($titleNodes->count() === 0 || trim($titleNodes->text('', true)) === '') {
        addIssue($allIssues, [
            'code' => '2.4.2',
            'principle' => 'Operable',
            'type' => 'error',
            'title' => 'Missing page title',
            'description' => 'The page does not have a descriptive <title> element.',
            'recommendation' => 'Add a concise, descriptive <title> that reflects the page content.',
            'severity' => 'high'
        ]);
    }

    // 3. Language attribute on <html>
    $htmlNodes = $crawler->filter('html');
    if ($htmlNodes->count() === 0) {
        addIssue($allIssues, [
            'code' => '3.1.1',
            'principle' => 'Understandable',
            'type' => 'error',
            'title' => 'Missing <html> element',
            'description' => 'The document does not contain an <html> element.',
            'recommendation' => 'Ensure the document includes a proper <html> element with a language attribute.',
            'severity' => 'high'
        ]);
    }
    else {
        $lang = trim((string)$htmlNodes->attr('lang'));
        if ($lang === '') {
            addIssue($allIssues, [
                'code' => '3.1.1',
                'principle' => 'Understandable',
                'type' => 'error',
                'title' => 'Missing language attribute',
                'description' => 'The <html> element is missing a lang attribute.',
                'recommendation' => 'Add a lang attribute to the <html> element (e.g., lang="en").',
                'severity' => 'high',
                'element' => getOuterHtml($htmlNodes)
            ]);
        }
    }

    // 4. Heading structure checks
    $h1Count = $crawler->filter('h1')->count();
    if ($h1Count === 0) {
        addIssue($allIssues, [
            'code' => '2.4.6',
            'principle' => 'Operable',
            'type' => 'warning',
            'title' => 'Missing primary heading',
            'description' => 'The page does not contain an <h1> heading.',
            'recommendation' => 'Add a single <h1> heading that describes the page topic.',
            'severity' => 'medium'
        ]);
    }
    elseif ($h1Count > 1) {
        addIssue($allIssues, [
            'code' => '2.4.6',
            'principle' => 'Operable',
            'type' => 'info',
            'title' => 'Multiple <h1> headings',
            'description' => 'The page has more than one <h1> heading.',
            'recommendation' => 'Use one <h1> per page and structure the rest with <h2>-<h6>.',
            'severity' => 'low'
        ]);
    }

    $headings = $crawler->filter('h1, h2, h3, h4, h5, h6');
    $previousLevel = null;
    foreach ($headings as $headingNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($headingNode);
        $tagName = strtolower($headingNode->nodeName);
        $level = intval(substr($tagName, 1));
        if ($previousLevel !== null && $level - $previousLevel > 1) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $headingNode->getLineNo() !== null ? $headingNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '1.3.1',
                'principle' => 'Perceivable',
                'type' => 'warning',
                'title' => 'Skipped heading level',
                'description' => 'Heading levels should not skip levels (e.g., <h2> to <h4>).',
                'element' => $elementHtml,
                'recommendation' => 'Use heading levels in a logical order without skipping.',
                'severity' => 'medium',
                'line' => $lineNumber
            ]);
        }
        $previousLevel = $level;
    }

    // 5. Link accessibility
    if ($crawler->filter('a')->count() > 0) {
        $links = $crawler->filter('a');
        foreach ($links as $linkNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($linkNode);
            $href = trim((string)$node->attr('href'));
            $text = getNodeText($node);
            $hasName = hasAccessibleName($node);
            if (!$hasName) {
                $hasImageAlt = $node->filter('img[alt]:not([alt=""])')->count() > 0;
                if (!$hasImageAlt) {
                    $elementHtml = getOuterHtml($node);
                    $lineNumber = $linkNode->getLineNo() !== null ? $linkNode->getLineNo() : null;
                    addIssue($allIssues, [
                        'code' => '2.4.4',
                        'principle' => 'Operable',
                        'type' => 'error',
                        'title' => 'Link without accessible name',
                        'description' => 'Links must have meaningful text or an accessible name.',
                        'element' => $elementHtml,
                        'recommendation' => 'Provide descriptive link text or an aria-label.',
                        'severity' => 'high',
                        'line' => $lineNumber
                    ]);
                }
            }

            if ($href !== '' && isPlaceholderLink($href)) {
                $elementHtml = getOuterHtml($node);
                $lineNumber = $linkNode->getLineNo() !== null ? $linkNode->getLineNo() : null;
                addIssue($allIssues, [
                    'code' => '2.4.4',
                    'principle' => 'Operable',
                    'type' => 'warning',
                    'title' => 'Placeholder link detected',
                    'description' => 'Links with "#" or "javascript:" do not provide a real destination.',
                    'element' => $elementHtml,
                    'recommendation' => 'Replace placeholder links with real destinations or use buttons for actions.',
                    'severity' => 'low',
                    'line' => $lineNumber
                ]);
            }
        }
    }

    // 6. Form control labels
    $formControls = $crawler->filter('input, textarea, select');
    foreach ($formControls as $controlNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($controlNode);
        $tagName = strtolower($controlNode->nodeName);
        $type = strtolower((string)$node->attr('type'));

        if ($tagName === 'input' && in_array($type, ['hidden'], true)) {
            continue;
        }

        if ($tagName === 'input' && in_array($type, ['submit', 'reset', 'button'], true)) {
            $value = trim((string)$node->attr('value'));
            if ($value === '' && !hasAccessibleName($node)) {
                $elementHtml = getOuterHtml($node);
                $lineNumber = $controlNode->getLineNo() !== null ? $controlNode->getLineNo() : null;
                addIssue($allIssues, [
                    'code' => '4.1.2',
                    'principle' => 'Robust',
                    'type' => 'error',
                    'title' => 'Button input missing label',
                    'description' => 'Button inputs need a value or accessible name.',
                    'element' => $elementHtml,
                    'recommendation' => 'Add a value attribute or aria-label to describe the button.',
                    'severity' => 'high',
                    'line' => $lineNumber
                ]);
            }
            continue;
        }

        if ($tagName === 'input' && $type === 'image') {
            $alt = trim((string)$node->attr('alt'));
            if ($alt === '') {
                $elementHtml = getOuterHtml($node);
                $lineNumber = $controlNode->getLineNo() !== null ? $controlNode->getLineNo() : null;
                addIssue($allIssues, [
                    'code' => '1.1.1',
                    'principle' => 'Perceivable',
                    'type' => 'error',
                    'title' => 'Image input missing alt text',
                    'description' => 'Image buttons must have alternative text.',
                    'element' => $elementHtml,
                    'recommendation' => 'Provide descriptive alt text for image buttons.',
                    'severity' => 'high',
                    'line' => $lineNumber
                ]);
            }
            continue;
        }

        if (!hasControlLabel($node, $crawler)) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $controlNode->getLineNo() !== null ? $controlNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '3.3.2',
                'principle' => 'Understandable',
                'type' => 'error',
                'title' => 'Form control missing label',
                'description' => 'Form inputs must have associated labels or accessible names.',
                'element' => $elementHtml,
                'recommendation' => 'Add a <label> associated with the control or an aria-label.',
                'severity' => 'high',
                'line' => $lineNumber
            ]);
        }
    }

    // 7. Button elements without accessible name
    $buttons = $crawler->filter('button');
    foreach ($buttons as $buttonNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($buttonNode);
        if (!hasAccessibleName($node)) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $buttonNode->getLineNo() !== null ? $buttonNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '4.1.2',
                'principle' => 'Robust',
                'type' => 'error',
                'title' => 'Button missing accessible name',
                'description' => 'Buttons must have visible text or an accessible name.',
                'line' => $lineNumber,
                'element' => $elementHtml,
                'recommendation' => 'Add button text or an aria-label to describe its action.',
                'severity' => 'high'
            ]);
        }
    }

    // 8. Iframe title attribute
    $iframes = $crawler->filter('iframe');
    foreach ($iframes as $iframeNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($iframeNode);
        $title = trim((string)$node->attr('title'));
        if ($title === '') {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => '4.1.2',
                'principle' => 'Robust',
                'type' => 'error',
                'title' => 'Iframe missing title',
                'description' => 'Iframes must have a title describing their content.',
                'element' => $elementHtml,
                'recommendation' => 'Add a descriptive title attribute to the iframe.',
                'severity' => 'medium'
            ]);
        }
    }

    // 9. Table headers
    $tables = $crawler->filter('table');
    foreach ($tables as $tableNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($tableNode);
        $hasHeader = $node->filter('th')->count() > 0;
        $hasCaption = $node->filter('caption')->count() > 0;
        if (!$hasHeader && !$hasCaption) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => '1.3.1',
                'principle' => 'Perceivable',
                'type' => 'warning',
                'title' => 'Table missing headers',
                'description' => 'Data tables should include headers or a caption.',
                'element' => $elementHtml,
                'recommendation' => 'Use <th> elements and/or a <caption> to describe the table.',
                'severity' => 'medium'
            ]);
        }
    }

    // 10. Audio and Video elements (1.2.1, 1.2.2)
    $audios = $crawler->filter('audio');
    foreach ($audios as $audioNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($audioNode);
        $hasTranscript = $node->filter('track[kind="captions"], track[kind="descriptions"], track[kind="subtitles"]')->count() > 0;
        if (!$hasTranscript) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $audioNode->getLineNo() !== null ? $audioNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '1.2.1',
                'principle' => 'Perceivable',
                'type' => 'warning',
                'title' => 'Audio without transcript',
                'description' => 'Audio content should have a transcript or alternative format.',
                'element' => $elementHtml,
                'recommendation' => 'Provide a transcript or use <track> elements for captions.',
                'severity' => 'medium',
                'line' => $lineNumber
            ]);
        }
    }

    $videos = $crawler->filter('video');
    foreach ($videos as $videoNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($videoNode);
        $hasCaptions = $node->filter('track[kind="captions"], track[kind="subtitles"]')->count() > 0;
        $hasDescription = $node->filter('track[kind="descriptions"]')->count() > 0;
        if (!$hasCaptions && !$hasDescription) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $videoNode->getLineNo() !== null ? $videoNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '1.2.2',
                'principle' => 'Perceivable',
                'type' => 'warning',
                'title' => 'Video without captions',
                'description' => 'Video content should have captions or a description track.',
                'element' => $elementHtml,
                'recommendation' => 'Add <track> elements with captions or descriptive audio.',
                'severity' => 'medium',
                'line' => $lineNumber
            ]);
        }
    }

    // 11. Auto-playing audio (1.4.2)
    $autoplayAudios = $crawler->filter('audio[autoplay], video[autoplay]');
    foreach ($autoplayAudios as $autoplayNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($autoplayNode);
        $elementHtml = getOuterHtml($node);
        $lineNumber = $autoplayNode->getLineNo() !== null ? $autoplayNode->getLineNo() : null;
        addIssue($allIssues, [
            'code' => '1.4.2',
            'principle' => 'Perceivable',
            'type' => 'warning',
            'title' => 'Autoplay media without control',
            'description' => 'Media that plays automatically must have a pause mechanism.',
            'element' => $elementHtml,
            'recommendation' => 'Remove autoplay or provide a clear pause button.',
            'severity' => 'medium',
            'line' => $lineNumber
        ]);
    }

    // 12. Meta refresh redirects (2.2.1)
    $metaRefresh = $crawler->filter('meta[http-equiv="refresh"]');
    if ($metaRefresh->count() > 0) {
        foreach ($metaRefresh as $metaNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($metaNode);
            $content = $node->attr('content');
            $lineNumber = $metaNode->getLineNo() !== null ? $metaNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '2.2.1',
                'principle' => 'Operable',
                'type' => 'warning',
                'title' => 'Meta refresh redirect detected',
                'description' => 'Page redirects using meta refresh can confuse users.',
                'element' => getOuterHtml($node),
                'recommendation' => 'Use server-side redirects (HTTP 301/302) instead of meta refresh.',
                'severity' => 'low',
                'line' => $lineNumber
            ]);
        }
    }

    // 13. Bypass blocks / Skip links (2.4.1)
    $skipLinks = $crawler->filter('a[href="#main"], a[href="#content"], a[href="#skip"]');
    if ($skipLinks->count() === 0) {
        addIssue($allIssues, [
            'code' => '2.4.1',
            'principle' => 'Operable',
            'type' => 'info',
            'title' => 'No skip navigation link found',
            'description' => 'Skip links help keyboard users bypass repetitive content.',
            'recommendation' => 'Add a skip link at the beginning of the page: <a href="#main">Skip to main content</a>',
            'severity' => 'low'
        ]);
    }

    // 14. Focus management (2.4.3) - check for proper tabindex
    $elementsWithTabindex = $crawler->filter('[tabindex]');
    foreach ($elementsWithTabindex as $tabindexNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($tabindexNode);
        $tabindex = intval($node->attr('tabindex'));
        if ($tabindex > 0) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $tabindexNode->getLineNo() !== null ? $tabindexNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '2.4.3',
                'principle' => 'Operable',
                'type' => 'warning',
                'title' => 'Positive tabindex detected',
                'description' => 'Positive tabindex values can break natural tab order.',
                'element' => $elementHtml,
                'recommendation' => 'Use tabindex="0" for focusable elements or remove it to follow natural order.',
                'severity' => 'medium',
                'line' => $lineNumber
            ]);
        }
    }

    // 15. Form error handling (3.3.1)
    $requiredInputs = $crawler->filter('[required], [aria-required="true"]');
    foreach ($requiredInputs as $requiredNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($requiredNode);
        $id = $node->attr('id');
        $ariaDescribedBy = $node->attr('aria-describedby');

        $hasErrorDescription = false;
        if ($id) {
            $errorElements = $crawler->filter('[id], [role="alert"], [role="status"]')->filter('*:contains("error"), *:contains("required"), *:contains("invalid")');
            if ($errorElements->count() > 0) {
                $hasErrorDescription = true;
            }
        }
        if ($ariaDescribedBy) {
            $hasErrorDescription = true;
        }

        if (!$hasErrorDescription) {
            $lineNumber = $requiredNode->getLineNo() !== null ? $requiredNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '3.3.1',
                'principle' => 'Understandable',
                'type' => 'info',
                'title' => 'Required field without error message structure',
                'description' => 'Required fields should provide feedback mechanism for errors.',
                'element' => getOuterHtml($node),
                'recommendation' => 'Link error messages with aria-describedby or use ARIA live regions.',
                'severity' => 'low',
                'line' => $lineNumber
            ]);
        }
    }

    // 16. Language for parts (3.1.2) - check for lang attribute on elements
    $nonEnglishElements = $crawler->filter('[lang]');
    $foundLangAttribute = $nonEnglishElements->count() > 0;

    // Only warn if content appears to have non-Latin characters but no lang attribute
    if (!$foundLangAttribute) {
        $bodyText = $crawler->filter('body')->text();
        // Simple check for common Asian characters
        if (preg_match('/[\x{4E00}-\x{9FFF}\x{3040}-\x{309F}\x{AC00}-\x{D7AF}]/u', $bodyText)) {
            addIssue($allIssues, [
                'code' => '3.1.2',
                'principle' => 'Understandable',
                'type' => 'info',
                'title' => 'No language markup for non-Latin text',
                'description' => 'Text in multiple languages should have language markup.',
                'recommendation' => 'Add lang attribute to elements with different language content.',
                'severity' => 'low'
            ]);
        }
    }

    // 17. Fieldset for grouped controls (1.3.1, 3.3.2)
    $radioButtons = $crawler->filter('input[type="radio"]');
    $checkboxGroups = $crawler->filter('input[type="checkbox"]');

    if ($radioButtons->count() > 0) {
        $radioNames = [];
        foreach ($radioButtons as $radioNode) {
            $name = new Symfony\Component\DomCrawler\Crawler($radioNode);
            $radioNames[] = $name->attr('name');
        }
        $radioNames = array_unique($radioNames);

        foreach ($radioNames as $name) {
            $radiosWithName = $crawler->filter('input[type="radio"][name="' . $name . '"]');
            if ($radiosWithName->count() > 1) {
                $parentFieldset = null;
                foreach ($radiosWithName as $radioNode) {
                    $parent = $radioNode;
                    while ($parent && $parent->nodeName !== 'fieldset') {
                        $parent = $parent->parentNode;
                    }
                    if (!$parent) {
                        $parentFieldset = false;
                        break;
                    }
                }

                if ($parentFieldset === false) {
                    $firstRadio = $radiosWithName->getNode(0);
                    $lineNumber = $firstRadio->getLineNo() !== null ? $firstRadio->getLineNo() : null;
                    addIssue($allIssues, [
                        'code' => '1.3.1',
                        'principle' => 'Perceivable',
                        'type' => 'warning',
                        'title' => 'Radio buttons not grouped in fieldset',
                        'description' => 'Related radio buttons should be grouped in a <fieldset> with <legend>.',
                        'recommendation' => 'Wrap radio button groups in <fieldset> and add descriptive <legend>.',
                        'severity' => 'medium',
                        'line' => $lineNumber
                    ]);
                }
            }
        }
    }

    // 18. Form feedback with ARIA live regions (4.1.3)
    $forms = $crawler->filter('form');
    $hasLiveRegions = $crawler->filter('[role="alert"], [role="status"], [aria-live]')->count() > 0;

    if ($forms->count() > 0 && !$hasLiveRegions) {
        addIssue($allIssues, [
            'code' => '4.1.3',
            'principle' => 'Robust',
            'type' => 'info',
            'title' => 'No ARIA live regions for dynamic updates',
            'description' => 'Forms with dynamic feedback should use ARIA live regions.',
            'recommendation' => 'Add elements with role="alert" or aria-live="polite" for form feedback.',
            'severity' => 'low'
        ]);
    }

    // 19. Meaningful heading and label text (2.4.6)
    $headersWithoutText = $crawler->filter('h1, h2, h3, h4, h5, h6');
    foreach ($headersWithoutText as $headerNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($headerNode);
        $text = normalizeWhitespace($node->text());

        $genericHeadings = ['untitled', 'heading', 'section', 'article', 'content', 'main', 'page'];
        $lowerText = strtolower($text);

        if (empty($text)) {
            $lineNumber = $headerNode->getLineNo() !== null ? $headerNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '2.4.6',
                'principle' => 'Operable',
                'type' => 'warning',
                'title' => 'Empty heading',
                'description' => 'Headings must contain descriptive text.',
                'element' => getOuterHtml($node),
                'recommendation' => 'Add meaningful text to heading elements.',
                'severity' => 'high',
                'line' => $lineNumber
            ]);
        }
        elseif (in_array($lowerText, $genericHeadings)) {
            $lineNumber = $headerNode->getLineNo() !== null ? $headerNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '2.4.6',
                'principle' => 'Operable',
                'type' => 'info',
                'title' => 'Generic heading text',
                'description' => 'Headings should be descriptive and indicate content purpose.',
                'element' => getOuterHtml($node),
                'recommendation' => 'Use descriptive heading text that indicates the section purpose.',
                'severity' => 'low',
                'line' => $lineNumber
            ]);
        }
    }

    // 20. Off-screen text for hidden content (1.3.1)
    $hiddenElements = $crawler->filter('[style*="display: none"], [style*="visibility: hidden"], [hidden]');
    if ($hiddenElements->count() > 0) {
        foreach ($hiddenElements as $hiddenNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($hiddenNode);
            $role = $node->attr('role');
            $ariaHidden = $node->attr('aria-hidden');

            // Check if it's actually meant to be hidden from screen readers
            if ($role !== 'presentation' && $role !== 'none' && $ariaHidden !== 'true') {
                $text = normalizeWhitespace($node->text());
                if (!empty($text) && strlen($text) > 20) {
                    $lineNumber = $hiddenNode->getLineNo() !== null ? $hiddenNode->getLineNo() : null;
                    addIssue($allIssues, [
                        'code' => '1.3.1',
                        'principle' => 'Perceivable',
                        'type' => 'info',
                        'title' => 'Hidden content that may need screen reader access',
                        'description' => 'Content hidden with CSS may still need to be announced.',
                        'recommendation' => 'Use aria-hidden="true" for decorative hidden content, or ensure it\'s accessible via keyboard.',
                        'severity' => 'low',
                        'line' => $lineNumber
                    ]);
                }
            }
        }
    }

    // 21. Empty elements with roles (1.3.1)
    $elementsWithRoles = $crawler->filter('[role]');
    foreach ($elementsWithRoles as $roleNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($roleNode);
        $role = $node->attr('role');
        $hasName = hasAccessibleName($node);
        $ariaHidden = $node->attr('aria-hidden');

        $requiresLabel = in_array($role, ['button', 'link', 'tab', 'menuitem', 'checkbox', 'radio']);

        if ($requiresLabel && !$hasName && $ariaHidden !== 'true') {
            $lineNumber = $roleNode->getLineNo() !== null ? $roleNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '4.1.2',
                'principle' => 'Robust',
                'type' => 'error',
                'title' => 'ARIA role without accessible name',
                'description' => 'Elements with ARIA roles must have an accessible name.',
                'element' => getOuterHtml($node),
                'recommendation' => 'Add text content or aria-label to elements with ARIA roles.',
                'severity' => 'high',
                'line' => $lineNumber
            ]);
        }
    }

    // 22. Landmark regions (2.4.1)
    $hasMain = $crawler->filter('main, [role="main"]')->count() > 0;
    $hasNav = $crawler->filter('nav, [role="navigation"]')->count() > 0;
    $hasContentInfo = $crawler->filter('footer, [role="contentinfo"]')->count() > 0;

    if (!$hasMain) {
        addIssue($allIssues, [
            'code' => '2.4.1',
            'principle' => 'Operable',
            'type' => 'info',
            'title' => 'Missing main landmark',
            'description' => 'Pages should include a main landmark region.',
            'recommendation' => 'Add a <main> element or element with role="main" for the main content.',
            'severity' => 'low'
        ]);
    }

    if (!$hasNav && $crawler->filter('a')->count() > 5) {
        addIssue($allIssues, [
            'code' => '2.4.1',
            'principle' => 'Operable',
            'type' => 'info',
            'title' => 'Missing navigation landmark',
            'description' => 'Pages with navigation should have a nav element or navigation landmark.',
            'recommendation' => 'Wrap navigation links in a <nav> element or use role="navigation".',
            'severity' => 'low'
        ]);
    }

    // 23. Audio Description or Media Alternative (1.2.3)
    $videos = $crawler->filter('video');
    foreach ($videos as $videoNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($videoNode);
        $hasAudioDesc = $node->filter('track[kind="descriptions"]')->count() > 0;
        $hasTranscript = $node->filter('a[href*="transcript"], p:contains("transcript")')->count() > 0;

        if (!$hasAudioDesc && !$hasTranscript) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $videoNode->getLineNo() !== null ? $videoNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '1.2.3',
                'principle' => 'Perceivable',
                'type' => 'info',
                'title' => 'Video missing audio description alternative',
                'description' => 'Videos with important visual information should have audio descriptions.',
                'element' => $elementHtml,
                'recommendation' => 'Provide audio description track or a detailed transcript describing visual content.',
                'severity' => 'medium',
                'line' => $lineNumber
            ]);
        }
    }

    // 24. Meaningful Sequence (1.3.2)
    $elementsWithFlexReverse = $crawler->filterXPath("//*[contains(@style, 'flex-direction') or contains(@style, 'order')]");
    if ($elementsWithFlexReverse->count() > 0) {
        foreach ($elementsWithFlexReverse as $flexNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($flexNode);
            $style = $node->attr('style');

            if (stripos($style, 'flex-direction: row-reverse') !== false || stripos($style, 'order:') !== false) {
                $lineNumber = $flexNode->getLineNo() !== null ? $flexNode->getLineNo() : null;
                addIssue($allIssues, [
                    'code' => '1.3.2',
                    'principle' => 'Perceivable',
                    'type' => 'warning',
                    'title' => 'CSS reordering affects reading sequence',
                    'description' => 'Flexbox properties reorder visual layout, but screen readers follow HTML order.',
                    'element' => getOuterHtml($node),
                    'recommendation' => 'Ensure HTML source order matches the logical reading sequence, not CSS order.',
                    'severity' => 'medium',
                    'line' => $lineNumber
                ]);
            }
        }
    }

    // 25. Use of Color (1.4.1)
    $elementsWithOnlyColor = $crawler->filterXPath("//*[contains(@style, 'background-color') or contains(@style, 'color')]");
    $colorOnlyElements = 0;
    if ($elementsWithOnlyColor->count() > 0) {
        foreach ($elementsWithOnlyColor as $colorNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($colorNode);
            $style = $node->attr('style');
            $text = normalizeWhitespace($node->text());

            // Check if element uses color but has minimal text content
            if ((stripos($style, 'color:') !== false || stripos($style, 'background-color:') !== false) && strlen($text) < 5) {
                $colorOnlyElements++;
            }
        }
    }

    if ($colorOnlyElements > 0) {
        addIssue($allIssues, [
            'code' => '1.4.1',
            'principle' => 'Perceivable',
            'type' => 'info',
            'title' => 'Color used to convey information',
            'description' => 'Color alone appears to be used to convey meaning. Colorblind users will not perceive this information.',
            'recommendation' => 'Add text labels, icons, patterns, or other visual indicators in addition to color.',
            'severity' => 'medium'
        ]);
    }

    // 26. Images of Text (1.4.5)
    $images = $crawler->filter('img');
    foreach ($images as $imageNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($imageNode);
        $src = strtolower($node->attr('src'));
        $alt = $node->attr('alt');

        // Check for common text-image patterns (logos excluded)
        if (preg_match('/\b(button|heading|title|text|caption|label|sign|banner|logo)\b/i', $alt) ||
        preg_match('/\.(png|jpg|gif)$/', $src)) {

            // Only flag if alt text suggests it contains text
            if ($alt && preg_match('/[A-Z]{2,}|heading|title|button|text/i', $alt)) {
                $elementHtml = getOuterHtml($node);
                $lineNumber = $imageNode->getLineNo() !== null ? $imageNode->getLineNo() : null;
                addIssue($allIssues, [
                    'code' => '1.4.5',
                    'principle' => 'Perceivable',
                    'type' => 'info',
                    'title' => 'Image used for text content',
                    'description' => 'Using images instead of text can cause scaling and maintenance problems.',
                    'element' => $elementHtml,
                    'recommendation' => 'Use CSS and HTML text formatting instead of images for text content.',
                    'severity' => 'low',
                    'line' => $lineNumber
                ]);
                break; // Only report once for the whole page
            }
        }
    }

    // 27. Keyboard Support (2.1.1)
    $divButtons = $crawler->filter('div[onclick], span[onclick]');
    if ($divButtons->count() > 0) {
        foreach ($divButtons as $divNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($divNode);
            $lineNumber = $divNode->getLineNo() !== null ? $divNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '2.1.1',
                'principle' => 'Operable',
                'type' => 'warning',
                'title' => 'Non-semantic element with click handler',
                'description' => 'Using div/span with onclick is not keyboard accessible by default.',
                'element' => getOuterHtml($node),
                'recommendation' => 'Use semantic <button> or <a> elements, or add proper ARIA role and keyboard handlers.',
                'severity' => 'high',
                'line' => $lineNumber
            ]);
        }
    }

    // 28. Marquee and scrolling text (2.2.2)
    $marquees = $crawler->filter('marquee');
    if ($marquees->count() > 0) {
        foreach ($marquees as $marqueeNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($marqueeNode);
            $lineNumber = $marqueeNode->getLineNo() !== null ? $marqueeNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '2.2.2',
                'principle' => 'Operable',
                'type' => 'error',
                'title' => 'Marquee element used',
                'description' => 'The <marquee> element is obsolete and causes accessibility problems.',
                'element' => getOuterHtml($node),
                'recommendation' => 'Replace <marquee> with CSS animations or scrollable divs with pause controls.',
                'severity' => 'high',
                'line' => $lineNumber
            ]);
        }
    }

    // 29. Animation and flashing (2.3.1)
    $styles = $crawler->filter('style');
    $hasProblematicAnimation = false;
    foreach ($styles as $styleNode) {
        $styleContent = $styleNode->textContent;
        // Check for animation definitions with high frequency (less than 333ms = more than 3fps)
        if (preg_match('/@keyframes\s+\w+\s*{[^}]*animation:\s*\w+\s+([0-9.]+)([ms]+)/i', $styleContent, $matches)) {
            $duration = floatval($matches[1]);
            $unit = strtolower($matches[2]);

            // Convert to milliseconds
            $durationMs = ($unit === 's') ? $duration * 1000 : $duration;

            // More than 3 flashes per second means less than 333ms per cycle
            if ($durationMs < 333 && $durationMs > 0) {
                $hasProblematicAnimation = true;
            }
        }
    }

    if ($hasProblematicAnimation) {
        addIssue($allIssues, [
            'code' => '2.3.1',
            'principle' => 'Operable',
            'type' => 'error',
            'title' => 'Rapid flashing animation detected',
            'description' => 'Animations flashing more than 3 times per second can trigger seizures.',
            'recommendation' => 'Reduce animation frequency or avoid rapid flashing animations entirely.',
            'severity' => 'high'
        ]);
    }

    // 30. Focus visible styling (2.4.7)
    $styles = $crawler->filter('style');
    $removesOutline = false;
    foreach ($styles as $styleNode) {
        $styleContent = $styleNode->textContent;
        if (preg_match('/:\s*focus\s*\{[^}]*outline:\s*none/i', $styleContent)) {
            $removesOutline = true;
            break;
        }
    }

    if ($removesOutline) {
        addIssue($allIssues, [
            'code' => '2.4.7',
            'principle' => 'Operable',
            'type' => 'error',
            'title' => 'Focus outline removed without replacement',
            'description' => 'CSS removes focus outline but provides no visible focus indicator.',
            'recommendation' => 'Keep focus outlines visible or replace with an alternative visible focus indicator.',
            'severity' => 'high'
        ]);
    }

    // 31. Multiple ways to navigate (2.4.5)
    $hasSearch = $crawler->filter('input[type="search"], form[role="search"], [role="search"]')->count() > 0;
    $hasMenu = $crawler->filter('nav, [role="navigation"]')->count() > 0;
    $hasSitemap = $crawler->filterXPath("//*[contains(text(), 'sitemap') or contains(text(), 'Sitemap')]")->count() > 0;
    $hasIndex = $crawler->filterXPath("//*[contains(text(), 'index') or contains(text(), 'Index')]")->count() > 0;

    $navigationMethods = ($hasSearch ? 1 : 0) + ($hasMenu ? 1 : 0) + ($hasSitemap ? 1 : 0) + ($hasIndex ? 1 : 0);

    if ($navigationMethods < 2 && $crawler->filter('a')->count() > 5) {
        addIssue($allIssues, [
            'code' => '2.4.5',
            'principle' => 'Operable',
            'type' => 'info',
            'title' => 'Limited navigation methods',
            'description' => 'Page offers only one way to navigate. Users benefit from multiple navigation methods.',
            'recommendation' => 'Provide search, site map, and/or index in addition to navigation menus.',
            'severity' => 'low'
        ]);
    }

    // 32. On Focus behavior (3.2.1)
    $selectsWithOnchange = $crawler->filter('select[onchange], input[onchange], textarea[onchange]');
    foreach ($selectsWithOnchange as $selectNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($selectNode);
        $onchange = $node->attr('onchange');

        // Check for form.submit or navigation in onchange
        if ($onchange && (stripos($onchange, 'submit') !== false || stripos($onchange, 'location') !== false)) {
            $lineNumber = $selectNode->getLineNo() !== null ? $selectNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '3.2.1',
                'principle' => 'Understandable',
                'type' => 'error',
                'title' => 'Form submission on input change',
                'description' => 'Form auto-submits or navigates when user changes a field value.',
                'element' => getOuterHtml($node),
                'recommendation' => 'Remove auto-submit behavior. Users should initiate actions with a Submit button.',
                'severity' => 'high',
                'line' => $lineNumber
            ]);
        }
    }

    // 33. Error prevention (3.3.4)
    $forms = $crawler->filter('form');
    foreach ($forms as $formNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($formNode);
        $method = strtoupper($node->attr('method') ?? 'get');

        // Check for deletion or confirmation patterns
        if ($method === 'POST') {
            $inputs = $node->filter('input[name*="delete"], input[name*="confirm"], input[name*="amount"], input[name*="transaction"]');
            if ($inputs->count() > 0) {
                // Check if there's a confirmation mechanism
                $hasButton = $node->filter('button')->count() > 0;
                if (!$hasButton || $node->filter('button:contains("confirm"), button:contains("Confirm")')->count() === 0) {
                    $lineNumber = $formNode->getLineNo() !== null ? $formNode->getLineNo() : null;
                    addIssue($allIssues, [
                        'code' => '3.3.4',
                        'principle' => 'Understandable',
                        'type' => 'warning',
                        'title' => 'High-risk form lacks confirmation',
                        'description' => 'Forms with deletion or financial operations need explicit confirmation.',
                        'element' => getOuterHtml($node),
                        'recommendation' => 'Add a confirmation step with clear description of the action and explicit Confirm/Cancel buttons.',
                        'severity' => 'high',
                        'line' => $lineNumber
                    ]);
                }
            }
        }
    }

    // 34. Error messages with suggestions (3.3.3)
    $formsWithErrors = $crawler->filter('form[novalidate], form input[aria-invalid="true"], form textarea[aria-invalid="true"], form select[aria-invalid="true"]');
    if ($formsWithErrors->count() === 0 && $crawler->filter('form')->count() > 0) {
        addIssue($allIssues, [
            'code' => '3.3.3',
            'principle' => 'Understandable',
            'type' => 'info',
            'title' => 'No client-side error handling detected',
            'description' => 'Forms should provide suggestions when errors occur.',
            'recommendation' => 'Implement client-side and server-side validation with helpful error messages and correction suggestions.',
            'severity' => 'low'
        ]);
    }

    // 35. Help and instructions (3.3.5)
    $complexInputs = $crawler->filter('input[pattern], input[type="date"], input[type="time"], input[type="tel"]');
    if ($complexInputs->count() > 0) {
        $withHelp = 0;
        foreach ($complexInputs as $inputNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($inputNode);
            $helpText = $node->attr('aria-describedby');
            $title = $node->attr('title');
            $placeholder = $node->attr('placeholder');

            if ($helpText || $title || $placeholder) {
                $withHelp++;
            }
        }

        if ($withHelp < count($complexInputs)) {
            addIssue($allIssues, [
                'code' => '3.3.5',
                'principle' => 'Understandable',
                'type' => 'info',
                'title' => 'Complex inputs missing help text',
                'description' => 'Inputs with patterns, dates, or phone numbers need format guidance.',
                'recommendation' => 'Add title, placeholder, or aria-describedby pointing to help text describing expected format.',
                'severity' => 'low'
            ]);
        }
    }

    // 36. Pointer gestures (2.5.1)
    // Check for touch event handlers without fallback
    if (stripos($htmlContent, 'touchstart') !== false || stripos($htmlContent, 'touchmove') !== false) {
        if (!preg_match('/getElementById|querySelector|addEventListener.*click/i', $htmlContent)) {
            addIssue($allIssues, [
                'code' => '2.5.1',
                'principle' => 'Operable',
                'type' => 'warning',
                'title' => 'Touch events without mouse fallback',
                'description' => 'Touch event handlers detected without keyboard/mouse alternatives.',
                'recommendation' => 'Provide equivalent keyboard and mouse event handlers alongside touch events.',
                'severity' => 'medium'
            ]);
        }
    }

    // 37. Character key shortcuts (2.1.4)
    if (stripos($htmlContent, 'addEventListener(\'keypress\'') !== false || stripos($htmlContent, 'onkeypress=') !== false) {
        addIssue($allIssues, [
            'code' => '2.1.4',
            'principle' => 'Operable',
            'type' => 'warning',
            'title' => 'Character key shortcuts detected',
            'description' => 'Single character shortcuts can interfere with browser and assistive technology shortcuts.',
            'recommendation' => 'Use multi-key shortcuts (Ctrl+S) or allow users to disable/remap shortcuts.',
            'severity' => 'medium'
        ]);
    }

    // 38. Consistent links and language (3.2.4, 3.2.3)
    $links = $crawler->filter('a');
    if ($links->count() > 5) {
        $linkTexts = [];
        $sameDestDifferentText = 0;

        foreach ($links as $linkNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($linkNode);
            $href = $node->attr('href');
            $text = normalizeWhitespace($node->text());

            if (!empty($href) && !empty($text) && !isPlaceholderLink($href)) {
                if (isset($linkTexts[$href]) && $linkTexts[$href] !== $text) {
                    $sameDestDifferentText++;
                }
                else {
                    $linkTexts[$href] = $text;
                }
            }
        }

        if ($sameDestDifferentText > 0) {
            addIssue($allIssues, [
                'code' => '2.4.4',
                'principle' => 'Operable',
                'type' => 'info',
                'title' => 'Inconsistent link text for same destination',
                'description' => 'Same destination referenced with different link text.',
                'recommendation' => 'Use consistent link text for the same destination across the website.',
                'severity' => 'low'
            ]);
        }
    }

    // 39. Caption and audio description tracking (1.2.4, 1.2.5)
    $videos = $crawler->filter('video');
    foreach ($videos as $videoNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($videoNode);

        // Check for live captions vs prerecorded (warning for live content)
        $tracks = $node->filter('track');
        $hasLiveCaption = false;
        $hasPrerecordedCaption = false;

        foreach ($tracks as $trackNode) {
            $trackCrawler = new Symfony\Component\DomCrawler\Crawler($trackNode);
            $kind = strtolower($trackCrawler->attr('kind'));

            if ($kind === 'captions') {
                $hasPrerecordedCaption = true;
            }
        }

        // Check for poster or no JavaScript fallback
        $poster = $node->attr('poster');
        $controls = $node->attr('controls');

        if (empty($poster) && empty($controls)) {
            $lineNumber = $videoNode->getLineNo() !== null ? $videoNode->getLineNo() : null;
            addIssue($allIssues, [
                'code' => '1.2.4',
                'principle' => 'Perceivable',
                'type' => 'warning',
                'title' => 'Video element without basic attributes',
                'description' => 'Video should have controls and poster image for better accessibility.',
                'element' => getOuterHtml($node),
                'recommendation' => 'Add controls attribute and poster image showing video content.',
                'severity' => 'medium',
                'line' => $lineNumber
            ]);
        }
    }

    // 40. Font sizing and text resizing (1.4.4)
    $hasFixedFontSize = false;
    $styles = $crawler->filter('style');
    foreach ($styles as $styleNode) {
        $styleContent = $styleNode->textContent;
        // Look for fixed pixel sizes on important elements
        if (preg_match('/body\s*\{[^}]*font-size:\s*\d+px/i', $styleContent)) {
            $hasFixedFontSize = true;
            break;
        }
    }

    if ($hasFixedFontSize) {
        addIssue($allIssues, [
            'code' => '1.4.4',
            'principle' => 'Perceivable',
            'type' => 'warning',
            'title' => 'Body text uses fixed pixel size',
            'description' => 'Fixed pixel sizes prevent text resizing in some browsers.',
            'recommendation' => 'Use relative units (rem, em, %) for font sizes to allow text resizing.',
            'severity' => 'medium'
        ]);
    }

    // 41. Definition of elements by position (1.3.2 - Grid/position)
    $elementsWithPosition = $crawler->filterXPath("//*[contains(@style, 'position')]");
    $gridElements = $crawler->filterXPath("//*[contains(@style, 'grid')]");

    if ($elementsWithPosition->count() > 5 || $gridElements->count() > 0) {
        if (!preg_match('/<h[1-6]|<nav|<main|<article|<section/i', $htmlContent)) {
            addIssue($allIssues, [
                'code' => '1.3.2',
                'principle' => 'Perceivable',
                'type' => 'info',
                'title' => 'Layout uses CSS positioning without semantic structure',
                'description' => 'Complex layout using position or grid without semantic HTML can confuse screen readers.',
                'recommendation' => 'Use semantic HTML elements (section, article, nav) with ARIA landmarks to define layout structure.',
                'severity' => 'low'
            ]);
        }
    }

    // 42. Meta viewport and zoom (1.4.4)
    $metaViewport = $crawler->filter('meta[name="viewport"]');
    if ($metaViewport->count() > 0) {
        $content = $metaViewport->attr('content');
        if (stripos($content, 'user-scalable=no') !== false) {
            $lineNumber = null;
            if ($metaViewport->getNode(0)) {
                $lineNumber = $metaViewport->getNode(0)->getLineNo();
            }
            addIssue($allIssues, [
                'code' => '1.4.4',
                'principle' => 'Perceivable',
                'type' => 'error',
                'title' => 'User zoom disabled',
                'description' => 'user-scalable=no prevents users from zooming, which harms accessibility.',
                'recommendation' => 'Remove user-scalable=no to allow users to zoom up to 200%.',
                'severity' => 'high',
                'line' => $lineNumber
            ]);
        }
    }
    else {
        addIssue($allIssues, [
            'code' => '1.4.4',
            'principle' => 'Perceivable',
            'type' => 'info',
            'title' => 'No viewport meta tag',
            'description' => 'Viewport meta tag helps with responsive design and zoom on mobile.',
            'recommendation' => 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
            'severity' => 'low'
        ]);
    }

    // 43. Assistive technology testing markers (4.1.2)
    $ariaLive = $crawler->filter('[aria-live]')->count();
    $ariaLabel = $crawler->filter('[aria-label]')->count();
    $ariaDescribedBy = $crawler->filter('[aria-describedby]')->count();

    if ($crawler->filter('form')->count() > 0 && ($ariaLabel + $ariaDescribedBy) === 0) {
        addIssue($allIssues, [
            'code' => '4.1.2',
            'principle' => 'Robust',
            'type' => 'info',
            'title' => 'Form lacks ARIA enhancements',
            'description' => 'Complex forms benefit from ARIA labels and descriptions.',
            'recommendation' => 'Use aria-label, aria-describedby, and aria-invalid for enhanced form accessibility.',
            'severity' => 'low'
        ]);
    }

    // 44. Document structure and lists (1.3.1)
    $lists = $crawler->filter('ol, ul')->count();
    $listItems = $crawler->filter('li')->count();

    // Check for list-like content not using list elements
    $bulletPoints = substr_count($htmlContent, 'â€¢') + substr_count($htmlContent, 'Â·') + substr_count($htmlContent, 'â—‹');

    if ($bulletPoints > 0 && $lists === 0) {
        addIssue($allIssues, [
            'code' => '1.3.1',
            'principle' => 'Perceivable',
            'type' => 'warning',
            'title' => 'Bullet points not using list elements',
            'description' => 'Content appears to have bullet-point lists but doesn\'t use <ul> elements.',
            'recommendation' => 'Use <ul><li> or <ol><li> elements for lists to provide proper structure.',
            'severity' => 'medium'
        ]);
    }

    // 45. Link text quality (2.4.4)
    $poorLinkTexts = ['click here', 'read more', 'more', 'link', 'here', 'this', 'page', 'go'];
    $poorLinkCount = 0;

    foreach ($links as $linkNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($linkNode);
        $text = strtolower(normalizeWhitespace($node->text()));

        if (in_array($text, $poorLinkTexts)) {
            $poorLinkCount++;
        }
    }

    if ($poorLinkCount > 0) {
        addIssue($allIssues, [
            'code' => '2.4.4',
            'principle' => 'Operable',
            'type' => 'warning',
            'title' => 'Vague link text found',
            'description' => $poorLinkCount . ' link(s) use non-descriptive text like "click here" or "more".',
            'recommendation' => 'Write descriptive link text that describes destination/action. Avoid "click here".',
            'severity' => 'medium'
        ]);
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
        require_once __DIR__ . '/config/database.php';
        
        $db = getDatabaseConnection();
        $scanDB = new ScanResultsDB($db);
        $scanDB->saveScanResults($results);
        
        error_log("Scan results saved to database: " . $results['scan_id']);
    } catch (Exception $e) {
        error_log("Failed to save scan to database: " . $e->getMessage());
        
        // Fallback to JSON file if database fails
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


}
catch (Exception $e) {
    // Store error in session
    $_SESSION['scan_error'] = 'Error: ' . $e->getMessage();

    // Debug output
    error_log('Scan error: ' . $e->getMessage());
    error_log('Trace: ' . $e->getTraceAsString());

    header('Location: index.php?error=1');
    exit;
}
