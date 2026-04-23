<?php
/**
 * Accessibility Checker Class
 * Handles loading and executing accessibility checks from database
 */

class AccessibilityChecker
{
    private $db;
    private $checks = [];
    private $crawler;
    private $htmlContent;
    
    public function __construct($dbConnection, $crawler, $htmlContent)
    {
        $this->db = $dbConnection;
        $this->crawler = $crawler;
        $this->htmlContent = $htmlContent;
        $this->loadChecks();
    }
    
    /**
     * Load enabled accessibility checks from database
     */
    private function loadChecks()
    {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM accessibility_checks 
                WHERE enabled = 1 
                ORDER BY priority ASC, id ASC
            ");
            $stmt->execute();
            $this->checks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            error_log("Loaded " . count($this->checks) . " accessibility checks from database");
            
        } catch (Exception $e) {
            error_log("Error loading accessibility checks: " . $e->getMessage());
            $this->checks = [];
        }
    }
    
    /**
     * Run all accessibility checks
     * @return array Array of issues found
     */
    public function runAllChecks()
    {
        $allIssues = [];
        
        foreach ($this->checks as $check) {
            try {
                $issues = $this->runCheck($check);
                if (!empty($issues)) {
                    $allIssues = array_merge($allIssues, $issues);
                }
            } catch (Exception $e) {
                error_log("Error running check {$check['check_key']}: " . $e->getMessage());
            }
        }
        
        return $allIssues;
    }
    
    /**
     * Run a specific accessibility check
     * @param array $check The check configuration from database
     * @return array Array of issues found
     */
    private function runCheck($check)
    {
        $methodName = 'check_' . $check['check_key'];
        
        if (method_exists($this, $methodName)) {
            return $this->$methodName($check);
        }
        
        // Default: use selector-based check if method doesn't exist
        return $this->runSelectorCheck($check);
    }
    
    /**
     * Generic selector-based check
     */
    private function runSelectorCheck($check)
    {
        $issues = [];
        
        try {
            if (empty($check['selector'])) {
                return $issues;
            }
            
            $elements = $this->crawler->filter($check['selector']);
            
            if ($elements->count() === 0 && strpos($check['check_key'], 'missing_') === 0) {
                // This is a "missing element" check
                $issues[] = $this->createIssue($check, null);
            }
            
        } catch (Exception $e) {
            error_log("Error in selector check {$check['check_key']}: " . $e->getMessage());
        }
        
        return $issues;
    }
    
    /**
     * Create an issue array from check configuration
     */
    private function createIssue($check, $element = null, $context = null, $lineNumber = null)
    {
        return [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity'],
            'element' => $element,
            'selector' => $check['selector'],
            'context' => $context,
            'line' => $lineNumber
        ];
    }
    
    // ========================================================================
    // Specific Check Implementations
    // ========================================================================
    
    /**
     * Check: Image missing alt text
     */
    private function check_img_missing_alt($check)
    {
        $issues = [];
        
        if ($this->crawler->filter('img')->count() > 0) {
            $images = $this->crawler->filter('img');
            foreach ($images as $imageNode) {
                $node = new Symfony\Component\DomCrawler\Crawler($imageNode);
                $src = $node->attr('src');
                $alt = $node->attr('alt');
                $ariaHidden = strtolower((string)$node->attr('aria-hidden'));
                $role = strtolower((string)$node->attr('role'));
                
                if ($src && $alt === null && $ariaHidden !== 'true' && $role !== 'presentation' && $role !== 'none') {
                    $elementHtml = $this->getOuterHtml($node);
                    $lineNumber = $imageNode->getLineNo();
                    $issues[] = $this->createIssue($check, $elementHtml, null, $lineNumber);
                }
            }
        }
        
        return $issues;
    }
    
    /**
     * Check: Missing page title
     */
    private function check_missing_page_title($check)
    {
        $issues = [];
        $titleNodes = $this->crawler->filter('title');
        
        if ($titleNodes->count() === 0 || trim($titleNodes->text('', true)) === '') {
            $issues[] = $this->createIssue($check);
        }
        
        return $issues;
    }
    
    /**
     * Check: Missing language attribute
     */
    private function check_missing_lang_attr($check)
    {
        $issues = [];
        $htmlNodes = $this->crawler->filter('html');
        
        if ($htmlNodes->count() === 0) {
            $issues[] = $this->createIssue($check);
        } else {
            $lang = trim((string)$htmlNodes->attr('lang'));
            if ($lang === '') {
                $elementHtml = $this->getOuterHtml($htmlNodes);
                $issues[] = $this->createIssue($check, $elementHtml);
            }
        }
        
        return $issues;
    }
    
    /**
     * Check: Missing H1
     */
    private function check_missing_h1($check)
    {
        $issues = [];
        $h1Count = $this->crawler->filter('h1')->count();
        
        if ($h1Count === 0) {
            $issues[] = $this->createIssue($check);
        }
        
        return $issues;
    }
    
    /**
     * Check: Multiple H1
     */
    private function check_multiple_h1($check)
    {
        $issues = [];
        $h1Count = $this->crawler->filter('h1')->count();
        
        if ($h1Count > 1) {
            $issues[] = $this->createIssue($check);
        }
        
        return $issues;
    }
    
    /**
     * Check: Skipped heading level
     */
    private function check_skipped_heading_level($check)
    {
        $issues = [];
        $headings = $this->crawler->filter('h1, h2, h3, h4, h5, h6');
        $previousLevel = null;
        
        foreach ($headings as $headingNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($headingNode);
            $tagName = strtolower($headingNode->nodeName);
            $level = intval(substr($tagName, 1));
            
            if ($previousLevel !== null && $level - $previousLevel > 1) {
                $elementHtml = $this->getOuterHtml($node);
                $lineNumber = $headingNode->getLineNo();
                $issues[] = $this->createIssue($check, $elementHtml, null, $lineNumber);
            }
            $previousLevel = $level;
        }
        
        return $issues;
    }
    
    /**
     * Check: Link without accessible name
     */
    private function check_link_no_accessible_name($check)
    {
        $issues = [];
        
        if ($this->crawler->filter('a')->count() > 0) {
            $links = $this->crawler->filter('a');
            foreach ($links as $linkNode) {
                $node = new Symfony\Component\DomCrawler\Crawler($linkNode);
                $hasName = $this->hasAccessibleName($node);
                
                if (!$hasName) {
                    $hasImageAlt = $node->filter('img[alt]:not([alt=""])')->count() > 0;
                    if (!$hasImageAlt) {
                        $elementHtml = $this->getOuterHtml($node);
                        $lineNumber = $linkNode->getLineNo();
                        $issues[] = $this->createIssue($check, $elementHtml, null, $lineNumber);
                    }
                }
            }
        }
        
        return $issues;
    }
    
    /**
     * Check: Placeholder link
     */
    private function check_placeholder_link($check)
    {
        $issues = [];
        
        if ($this->crawler->filter('a')->count() > 0) {
            $links = $this->crawler->filter('a');
            foreach ($links as $linkNode) {
                $node = new Symfony\Component\DomCrawler\Crawler($linkNode);
                $href = trim((string)$node->attr('href'));
                
                if ($href !== '' && $this->isPlaceholderLink($href)) {
                    $elementHtml = $this->getOuterHtml($node);
                    $lineNumber = $linkNode->getLineNo();
                    $issues[] = $this->createIssue($check, $elementHtml, null, $lineNumber);
                }
            }
        }
        
        return $issues;
    }
    
    /**
     * Check: Form control missing label
     */
    private function check_form_control_no_label($check)
    {
        $issues = [];
        $formControls = $this->crawler->filter('input, textarea, select');
        
        foreach ($formControls as $controlNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($controlNode);
            $tagName = strtolower($controlNode->nodeName);
            $type = strtolower((string)$node->attr('type'));
            
            // Skip hidden inputs and buttons
            if ($tagName === 'input' && in_array($type, ['hidden', 'submit', 'reset', 'button', 'image'], true)) {
                continue;
            }
            
            if (!$this->hasControlLabel($node)) {
                $elementHtml = $this->getOuterHtml($node);
                $lineNumber = $controlNode->getLineNo();
                $issues[] = $this->createIssue($check, $elementHtml, null, $lineNumber);
            }
        }
        
        return $issues;
    }
    
    /**
     * Check: HTML parsing errors
     */
    private function check_html_parsing_errors($check)
    {
        $issues = [];
        
        // This check needs to be run during HTML parsing
        // For now, we'll skip it in the checker class
        // It should be handled separately in scan.php
        
        return $issues;
    }
    
    // ========================================================================
    // Helper Methods
    // ========================================================================
    
    private function getOuterHtml($node)
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
    
    private function hasAccessibleName($node)
    {
        if ($this->hasAriaLabel($node)) {
            return true;
        }
        
        $title = trim((string)$node->attr('title'));
        if ($title !== '') {
            return true;
        }
        
        $text = $this->getNodeText($node);
        return $text !== '';
    }
    
    private function hasAriaLabel($node)
    {
        $ariaLabel = trim((string)$node->attr('aria-label'));
        if ($ariaLabel !== '') {
            return true;
        }
        
        $ariaLabelledBy = trim((string)$node->attr('aria-labelledby'));
        return $ariaLabelledBy !== '';
    }
    
    private function hasControlLabel($node)
    {
        if ($this->hasAriaLabel($node)) {
            return true;
        }
        
        $id = trim((string)$node->attr('id'));
        if ($id !== '') {
            $labelFor = $this->crawler->filter('label[for="' . $id . '"]');
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
    
    private function getNodeText($node)
    {
        try {
            return $this->normalizeWhitespace($node->text('', true));
        } catch (Exception $e) {
            return '';
        }
    }
    
    private function normalizeWhitespace($text)
    {
        return preg_replace('/\s+/', ' ', trim($text));
    }
    
    private function isPlaceholderLink($href)
    {
        $href = strtolower(trim($href));
        if ($href === '' || $href === '#' || $href === '#!') {
            return true;
        }
        return strpos($href, 'javascript:') === 0;
    }
}
