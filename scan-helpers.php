<?php
/**
 * Scan Helper Functions
 * Shared utility functions for accessibility scanning
 */

/**
 * Extract element context for display
 */
function getElementContext($element, $length = 200)
{
    if (empty($element))
        return '';
    
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

/**
 * Safely get outer HTML of a node
 */
function getOuterHtml($node)
{
    try {
        if (method_exists($node, 'outerHtml')) {
            return $node->outerHtml();
        } elseif (method_exists($node, 'html')) {
            return $node->html();
        } else {
            return (string)$node;
        }
    } catch (Exception $e) {
        return '[Unable to extract element]';
    }
}

/**
 * Normalize whitespace in text
 */
function normalizeWhitespace($text)
{
    return preg_replace('/\s+/', ' ', trim($text));
}

/**
 * Get text content from a node
 */
function getNodeText($node)
{
    try {
        return normalizeWhitespace($node->text('', true));
    } catch (Exception $e) {
        return '';
    }
}

/**
 * Check if node has ARIA label
 */
function hasAriaLabel($node)
{
    $ariaLabel = trim((string)$node->attr('aria-label'));
    if ($ariaLabel !== '') {
        return true;
    }
    
    $ariaLabelledBy = trim((string)$node->attr('aria-labelledby'));
    return $ariaLabelledBy !== '';
}

/**
 * Check if node has accessible name
 */
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

/**
 * Check if form control has label
 */
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
    } catch (Exception $e) {
        // Ignore
    }
    
    return false;
}

/**
 * Check if link is a placeholder
 */
function isPlaceholderLink($href)
{
    $href = strtolower(trim($href));
    if ($href === '' || $href === '#' || $href === '#!') {
        return true;
    }
    return strpos($href, 'javascript:') === 0;
}

/**
 * Add an issue to the issues array
 */
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
    if (!isset($issue['line'])) {
        $issue['line'] = null;
    }
    $issues[] = $issue;
}

/**
 * Fetch URL content with multiple fallback methods
 */
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
        } catch (\Exception $e) {
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
                return "$k: $v";
            }, array_keys($headers), array_values($headers))
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
