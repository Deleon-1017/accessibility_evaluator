<?php
/**
 * Accessibility Check Implementations
 * Individual check functions called by scan.php
 * Each function is named: run_check_{check_key}
 * 
 * This file contains all 55 accessibility check implementations
 */

// 1. Image missing alt text
function run_check_img_missing_alt($check, $crawler, $htmlContent, &$allIssues) {
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
                $lineNumber = $imageNode->getLineNo();
                addIssue($allIssues, [
                    'code' => $check['wcag_code'],
                    'principle' => $check['principle'],
                    'type' => $check['issue_type'],
                    'title' => $check['title'],
                    'description' => $check['description'],
                    'element' => $elementHtml,
                    'selector' => $check['selector'],
                    'recommendation' => $check['recommendation'],
                    'severity' => $check['severity'],
                    'line' => $lineNumber
                ]);
            }
        }
    }
}

// 2. Missing page title
function run_check_missing_page_title($check, $crawler, $htmlContent, &$allIssues) {
    $titleNodes = $crawler->filter('title');
    if ($titleNodes->count() === 0 || trim($titleNodes->text('', true)) === '') {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 3. Missing language attribute
function run_check_missing_lang_attr($check, $crawler, $htmlContent, &$allIssues) {
    $htmlNodes = $crawler->filter('html');
    if ($htmlNodes->count() === 0) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => 'Missing <html> element',
            'description' => 'The document does not contain an <html> element.',
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    } else {
        $lang = trim((string)$htmlNodes->attr('lang'));
        if ($lang === '') {
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity'],
                'element' => getOuterHtml($htmlNodes)
            ]);
        }
    }
}

// 4. Missing H1
function run_check_missing_h1($check, $crawler, $htmlContent, &$allIssues) {
    $h1Count = $crawler->filter('h1')->count();
    if ($h1Count === 0) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 5. Multiple H1
function run_check_multiple_h1($check, $crawler, $htmlContent, &$allIssues) {
    $h1Count = $crawler->filter('h1')->count();
    if ($h1Count > 1) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 6. Skipped heading level
function run_check_skipped_heading_level($check, $crawler, $htmlContent, &$allIssues) {
    $headings = $crawler->filter('h1, h2, h3, h4, h5, h6');
    $previousLevel = null;
    
    foreach ($headings as $headingNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($headingNode);
        $tagName = strtolower($headingNode->nodeName);
        $level = intval(substr($tagName, 1));
        
        if ($previousLevel !== null && $level - $previousLevel > 1) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $headingNode->getLineNo();
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity'],
                'line' => $lineNumber
            ]);
        }
        $previousLevel = $level;
    }
}

// 7. Link without accessible name
function run_check_link_no_accessible_name($check, $crawler, $htmlContent, &$allIssues) {
    if ($crawler->filter('a')->count() > 0) {
        $links = $crawler->filter('a');
        foreach ($links as $linkNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($linkNode);
            $hasName = hasAccessibleName($node);
            
            if (!$hasName) {
                $hasImageAlt = $node->filter('img[alt]:not([alt=""])')->count() > 0;
                if (!$hasImageAlt) {
                    $elementHtml = getOuterHtml($node);
                    $lineNumber = $linkNode->getLineNo();
                    addIssue($allIssues, [
                        'code' => $check['wcag_code'],
                        'principle' => $check['principle'],
                        'type' => $check['issue_type'],
                        'title' => $check['title'],
                        'description' => $check['description'],
                        'element' => $elementHtml,
                        'recommendation' => $check['recommendation'],
                        'severity' => $check['severity'],
                        'line' => $lineNumber
                    ]);
                }
            }
        }
    }
}

// 8. Placeholder link
function run_check_placeholder_link($check, $crawler, $htmlContent, &$allIssues) {
    if ($crawler->filter('a')->count() > 0) {
        $links = $crawler->filter('a');
        foreach ($links as $linkNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($linkNode);
            $href = trim((string)$node->attr('href'));
            
            if ($href !== '' && isPlaceholderLink($href)) {
                $elementHtml = getOuterHtml($node);
                $lineNumber = $linkNode->getLineNo();
                addIssue($allIssues, [
                    'code' => $check['wcag_code'],
                    'principle' => $check['principle'],
                    'type' => $check['issue_type'],
                    'title' => $check['title'],
                    'description' => $check['description'],
                    'element' => $elementHtml,
                    'recommendation' => $check['recommendation'],
                    'severity' => $check['severity'],
                    'line' => $lineNumber
                ]);
            }
        }
    }
}

// 9. Form control missing label
function run_check_form_control_no_label($check, $crawler, $htmlContent, &$allIssues) {
    $formControls = $crawler->filter('input, textarea, select');
    
    foreach ($formControls as $controlNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($controlNode);
        $tagName = strtolower($controlNode->nodeName);
        $type = strtolower((string)$node->attr('type'));
        
        // Skip hidden inputs and buttons
        if ($tagName === 'input' && in_array($type, ['hidden', 'submit', 'reset', 'button', 'image'], true)) {
            continue;
        }
        
        if (!hasControlLabel($node, $crawler)) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $controlNode->getLineNo();
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity'],
                'line' => $lineNumber
            ]);
        }
    }
}

// 10. Button input missing label
function run_check_button_input_no_label($check, $crawler, $htmlContent, &$allIssues) {
    $buttonInputs = $crawler->filter('input[type="submit"], input[type="reset"], input[type="button"]');
    
    foreach ($buttonInputs as $buttonNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($buttonNode);
        $value = trim((string)$node->attr('value'));
        
        if ($value === '' && !hasAccessibleName($node)) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $buttonNode->getLineNo();
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity'],
                'line' => $lineNumber
            ]);
        }
    }
}

// 11. Image input missing alt
function run_check_image_input_no_alt($check, $crawler, $htmlContent, &$allIssues) {
    $imageInputs = $crawler->filter('input[type="image"]');
    
    foreach ($imageInputs as $imageNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($imageNode);
        $alt = trim((string)$node->attr('alt'));
        
        if ($alt === '') {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $imageNode->getLineNo();
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity'],
                'line' => $lineNumber
            ]);
        }
    }
}

// 12. Button missing accessible name
function run_check_button_no_accessible_name($check, $crawler, $htmlContent, &$allIssues) {
    $buttons = $crawler->filter('button');
    
    foreach ($buttons as $buttonNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($buttonNode);
        if (!hasAccessibleName($node)) {
            $elementHtml = getOuterHtml($node);
            $lineNumber = $buttonNode->getLineNo();
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity'],
                'line' => $lineNumber
            ]);
        }
    }
}

// 13. Iframe missing title
function run_check_iframe_no_title($check, $crawler, $htmlContent, &$allIssues) {
    $iframes = $crawler->filter('iframe');
    
    foreach ($iframes as $iframeNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($iframeNode);
        $title = trim((string)$node->attr('title'));
        
        if ($title === '') {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 14. Table missing headers
function run_check_table_no_headers($check, $crawler, $htmlContent, &$allIssues) {
    $tables = $crawler->filter('table');
    
    foreach ($tables as $tableNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($tableNode);
        $hasHeader = $node->filter('th')->count() > 0;
        $hasCaption = $node->filter('caption')->count() > 0;
        
        if (!$hasHeader && !$hasCaption) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 15. Audio without transcript
function run_check_audio_no_transcript($check, $crawler, $htmlContent, &$allIssues) {
    $audioElements = $crawler->filter('audio');
    
    foreach ($audioElements as $audioNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($audioNode);
        $hasTrack = $node->filter('track')->count() > 0;
        
        if (!$hasTrack) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 16. Video without captions
function run_check_video_no_captions($check, $crawler, $htmlContent, &$allIssues) {
    $videoElements = $crawler->filter('video');
    
    foreach ($videoElements as $videoNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($videoNode);
        $hasCaptionTrack = false;
        
        $tracks = $node->filter('track');
        foreach ($tracks as $trackNode) {
            $trackCrawler = new Symfony\Component\DomCrawler\Crawler($trackNode);
            $kind = strtolower((string)$trackCrawler->attr('kind'));
            if ($kind === 'captions' || $kind === 'subtitles') {
                $hasCaptionTrack = true;
                break;
            }
        }
        
        if (!$hasCaptionTrack) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 17. Autoplay media without control
function run_check_autoplay_media($check, $crawler, $htmlContent, &$allIssues) {
    $autoplayMedia = $crawler->filter('audio[autoplay], video[autoplay]');
    
    foreach ($autoplayMedia as $mediaNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($mediaNode);
        $hasControls = $node->attr('controls') !== null;
        
        if (!$hasControls) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 18. Meta refresh redirect
function run_check_meta_refresh($check, $crawler, $htmlContent, &$allIssues) {
    $metaRefresh = $crawler->filter('meta[http-equiv="refresh"]');
    
    if ($metaRefresh->count() > 0) {
        foreach ($metaRefresh as $metaNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($metaNode);
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 19. No skip navigation link
function run_check_no_skip_link($check, $crawler, $htmlContent, &$allIssues) {
    $skipLinks = $crawler->filter('a[href="#main"], a[href="#content"], a[href="#maincontent"]');
    
    if ($skipLinks->count() === 0) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 20. Positive tabindex detected
function run_check_positive_tabindex($check, $crawler, $htmlContent, &$allIssues) {
    $elementsWithTabindex = $crawler->filter('[tabindex]');
    
    foreach ($elementsWithTabindex as $element) {
        $node = new Symfony\Component\DomCrawler\Crawler($element);
        $tabindex = trim((string)$node->attr('tabindex'));
        
        if (is_numeric($tabindex) && intval($tabindex) > 0) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 21. Required field without error structure
function run_check_required_no_error_structure($check, $crawler, $htmlContent, &$allIssues) {
    $requiredFields = $crawler->filter('[required], [aria-required="true"]');
    
    foreach ($requiredFields as $fieldNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($fieldNode);
        $hasAriaDescribedby = $node->attr('aria-describedby') !== null;
        $hasAriaInvalid = $node->attr('aria-invalid') !== null;
        
        if (!$hasAriaDescribedby && !$hasAriaInvalid) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 22. No language markup for non-Latin text
function run_check_no_lang_markup_non_latin($check, $crawler, $htmlContent, &$allIssues) {
    // Check for non-Latin characters in text content
    if (preg_match('/[\x{0400}-\x{04FF}\x{0600}-\x{06FF}\x{4E00}-\x{9FFF}\x{3040}-\x{309F}\x{30A0}-\x{30FF}]/u', $htmlContent)) {
        $elementsWithLang = $crawler->filter('[lang]')->count();
        
        if ($elementsWithLang < 2) { // Less than 2 means only html tag has lang
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 23. Radio buttons not grouped
function run_check_radio_no_fieldset($check, $crawler, $htmlContent, &$allIssues) {
    $radioButtons = $crawler->filter('input[type="radio"]');
    
    if ($radioButtons->count() > 1) {
        $radioGroups = [];
        
        foreach ($radioButtons as $radioNode) {
            $node = new Symfony\Component\DomCrawler\Crawler($radioNode);
            $name = $node->attr('name');
            
            if ($name) {
                if (!isset($radioGroups[$name])) {
                    $radioGroups[$name] = [];
                }
                $radioGroups[$name][] = $radioNode;
            }
        }
        
        foreach ($radioGroups as $groupName => $radios) {
            if (count($radios) > 1) {
                $firstRadio = new Symfony\Component\DomCrawler\Crawler($radios[0]);
                $inFieldset = $firstRadio->closest('fieldset')->count() > 0;
                
                if (!$inFieldset) {
                    $elementHtml = getOuterHtml($firstRadio);
                    addIssue($allIssues, [
                        'code' => $check['wcag_code'],
                        'principle' => $check['principle'],
                        'type' => $check['issue_type'],
                        'title' => $check['title'],
                        'description' => $check['description'],
                        'element' => $elementHtml,
                        'recommendation' => $check['recommendation'],
                        'severity' => $check['severity'],
                        'context' => "Radio group: $groupName"
                    ]);
                }
            }
        }
    }
}

// 24. No ARIA live regions
function run_check_no_aria_live_regions($check, $crawler, $htmlContent, &$allIssues) {
    $forms = $crawler->filter('form');
    
    if ($forms->count() > 0) {
        $liveRegions = $crawler->filter('[role="alert"], [aria-live]');
        
        if ($liveRegions->count() === 0) {
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 25. Empty heading
function run_check_empty_heading($check, $crawler, $htmlContent, &$allIssues) {
    $headings = $crawler->filter('h1, h2, h3, h4, h5, h6');
    
    foreach ($headings as $headingNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($headingNode);
        $text = trim($node->text('', true));
        
        if ($text === '') {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 26. Generic heading text
function run_check_generic_heading($check, $crawler, $htmlContent, &$allIssues) {
    $headings = $crawler->filter('h1, h2, h3, h4, h5, h6');
    $genericTerms = ['untitled', 'heading', 'title', 'header', 'section', 'content'];
    
    foreach ($headings as $headingNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($headingNode);
        $text = strtolower(trim($node->text('', true)));
        
        if (in_array($text, $genericTerms, true)) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 27. Hidden content accessibility
function run_check_hidden_content_accessibility($check, $crawler, $htmlContent, &$allIssues) {
    $hiddenElements = $crawler->filter('[hidden], [style*="display: none"], [style*="display:none"]');
    
    foreach ($hiddenElements as $hiddenNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($hiddenNode);
        $ariaHidden = $node->attr('aria-hidden');
        
        if ($ariaHidden === null) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 28. ARIA role without accessible name
function run_check_aria_role_no_name($check, $crawler, $htmlContent, &$allIssues) {
    $interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'switch', 'textbox'];
    $elementsWithRole = $crawler->filter('[role]');
    
    foreach ($elementsWithRole as $element) {
        $node = new Symfony\Component\DomCrawler\Crawler($element);
        $role = strtolower((string)$node->attr('role'));
        
        if (in_array($role, $interactiveRoles, true)) {
            if (!hasAccessibleName($node)) {
                $elementHtml = getOuterHtml($node);
                addIssue($allIssues, [
                    'code' => $check['wcag_code'],
                    'principle' => $check['principle'],
                    'type' => $check['issue_type'],
                    'title' => $check['title'],
                    'description' => $check['description'],
                    'element' => $elementHtml,
                    'recommendation' => $check['recommendation'],
                    'severity' => $check['severity']
                ]);
            }
        }
    }
}

// 29. Missing main landmark
function run_check_missing_main_landmark($check, $crawler, $htmlContent, &$allIssues) {
    $mainLandmarks = $crawler->filter('main, [role="main"]');
    
    if ($mainLandmarks->count() === 0) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 30. Missing navigation landmark
function run_check_missing_nav_landmark($check, $crawler, $htmlContent, &$allIssues) {
    $navLandmarks = $crawler->filter('nav, [role="navigation"]');
    
    if ($navLandmarks->count() === 0) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 31. Video missing audio description
function run_check_video_no_audio_desc($check, $crawler, $htmlContent, &$allIssues) {
    $videoElements = $crawler->filter('video');
    
    foreach ($videoElements as $videoNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($videoNode);
        $hasDescriptionTrack = false;
        
        $tracks = $node->filter('track');
        foreach ($tracks as $trackNode) {
            $trackCrawler = new Symfony\Component\DomCrawler\Crawler($trackNode);
            $kind = strtolower((string)$trackCrawler->attr('kind'));
            if ($kind === 'descriptions') {
                $hasDescriptionTrack = true;
                break;
            }
        }
        
        if (!$hasDescriptionTrack) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 32. CSS reordering affects sequence
function run_check_css_reordering($check, $crawler, $htmlContent, &$allIssues) {
    $elementsWithFlexOrder = $crawler->filter('[style*="flex-direction"], [style*="order"]');
    
    if ($elementsWithFlexOrder->count() > 0) {
        foreach ($elementsWithFlexOrder as $element) {
            $node = new Symfony\Component\DomCrawler\Crawler($element);
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 33. Color used to convey information
function run_check_color_only_info($check, $crawler, $htmlContent, &$allIssues) {
    // Check for elements with color styling but no additional indicators
    $coloredElements = $crawler->filter('[style*="color"], [style*="background-color"]');
    
    if ($coloredElements->count() > 3) { // Only flag if multiple colored elements exist
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity'],
            'context' => 'Found ' . $coloredElements->count() . ' elements with color styling'
        ]);
    }
}

// 34. Image used for text content
function run_check_image_for_text($check, $crawler, $htmlContent, &$allIssues) {
    $images = $crawler->filter('img[alt]');
    $textIndicators = ['text', 'heading', 'title', 'button', 'label', 'sign', 'banner'];
    
    foreach ($images as $imageNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($imageNode);
        $alt = strtolower(trim((string)$node->attr('alt')));
        
        foreach ($textIndicators as $indicator) {
            if (strpos($alt, $indicator) !== false) {
                $elementHtml = getOuterHtml($node);
                addIssue($allIssues, [
                    'code' => $check['wcag_code'],
                    'principle' => $check['principle'],
                    'type' => $check['issue_type'],
                    'title' => $check['title'],
                    'description' => $check['description'],
                    'element' => $elementHtml,
                    'recommendation' => $check['recommendation'],
                    'severity' => $check['severity']
                ]);
                break;
            }
        }
    }
}

// 35. Non-semantic element with click handler
function run_check_non_semantic_clickable($check, $crawler, $htmlContent, &$allIssues) {
    $clickableElements = $crawler->filter('div[onclick], span[onclick]');
    
    foreach ($clickableElements as $element) {
        $node = new Symfony\Component\DomCrawler\Crawler($element);
        $role = $node->attr('role');
        $tabindex = $node->attr('tabindex');
        
        // Flag if no proper role or tabindex
        if ($role === null || $tabindex === null) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 36. Marquee element used
function run_check_marquee_element($check, $crawler, $htmlContent, &$allIssues) {
    $marquees = $crawler->filter('marquee');
    
    foreach ($marquees as $marqueeNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($marqueeNode);
        $elementHtml = getOuterHtml($node);
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'element' => $elementHtml,
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 37. Rapid flashing animation
function run_check_rapid_flashing($check, $crawler, $htmlContent, &$allIssues) {
    // Check for CSS animations with rapid timing
    if (preg_match('/animation.*?(\d+)ms/i', $htmlContent, $matches)) {
        $duration = intval($matches[1]);
        if ($duration < 333) { // Less than 333ms = more than 3 times per second
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity'],
                'context' => "Animation duration: {$duration}ms"
            ]);
        }
    }
}

// 38. Focus outline removed
function run_check_focus_outline_removed($check, $crawler, $htmlContent, &$allIssues) {
    // Check for CSS that removes focus outline
    if (preg_match('/:focus\s*\{[^}]*outline\s*:\s*none/i', $htmlContent) ||
        preg_match('/:focus\s*\{[^}]*outline\s*:\s*0/i', $htmlContent)) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 39. Limited navigation methods
function run_check_limited_navigation($check, $crawler, $htmlContent, &$allIssues) {
    $searchInputs = $crawler->filter('input[type="search"], [role="search"]');
    $navElements = $crawler->filter('nav, [role="navigation"]');
    
    if ($searchInputs->count() === 0 && $navElements->count() < 2) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 40. Form submission on input change
function run_check_form_auto_submit($check, $crawler, $htmlContent, &$allIssues) {
    $autoSubmitElements = $crawler->filter('select[onchange], input[onchange]');
    
    foreach ($autoSubmitElements as $element) {
        $node = new Symfony\Component\DomCrawler\Crawler($element);
        $onchange = strtolower((string)$node->attr('onchange'));
        
        if (strpos($onchange, 'submit') !== false || strpos($onchange, 'location') !== false) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 41. High-risk form lacks confirmation
function run_check_form_no_confirmation($check, $crawler, $htmlContent, &$allIssues) {
    $forms = $crawler->filter('form');
    $highRiskKeywords = ['delete', 'remove', 'cancel', 'payment', 'purchase', 'transaction'];
    
    foreach ($forms as $formNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($formNode);
        $formHtml = strtolower($node->html());
        
        foreach ($highRiskKeywords as $keyword) {
            if (strpos($formHtml, $keyword) !== false) {
                // Check if there's a confirmation step
                if (strpos($formHtml, 'confirm') === false && strpos($formHtml, 'are you sure') === false) {
                    $elementHtml = getOuterHtml($node);
                    addIssue($allIssues, [
                        'code' => $check['wcag_code'],
                        'principle' => $check['principle'],
                        'type' => $check['issue_type'],
                        'title' => $check['title'],
                        'description' => $check['description'],
                        'element' => $elementHtml,
                        'recommendation' => $check['recommendation'],
                        'severity' => $check['severity'],
                        'context' => "High-risk keyword found: $keyword"
                    ]);
                    break;
                }
            }
        }
    }
}

// 42. No client-side error handling
function run_check_no_client_error_handling($check, $crawler, $htmlContent, &$allIssues) {
    $forms = $crawler->filter('form');
    
    foreach ($forms as $formNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($formNode);
        $hasValidation = $node->filter('[required], [pattern], [min], [max], [minlength], [maxlength]')->count() > 0;
        
        if (!$hasValidation) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 43. Complex inputs missing help
function run_check_complex_input_no_help($check, $crawler, $htmlContent, &$allIssues) {
    $complexInputs = $crawler->filter('input[pattern], input[type="date"], input[type="time"], input[type="tel"]');
    
    foreach ($complexInputs as $inputNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($inputNode);
        $hasHelp = $node->attr('title') !== null || 
                   $node->attr('placeholder') !== null || 
                   $node->attr('aria-describedby') !== null;
        
        if (!$hasHelp) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 44. Touch events without fallback
function run_check_touch_no_fallback($check, $crawler, $htmlContent, &$allIssues) {
    // Check for touch event handlers in inline scripts or attributes
    if (preg_match('/ontouchstart|ontouchmove|ontouchend/i', $htmlContent)) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 45. Character key shortcuts
function run_check_char_key_shortcuts($check, $crawler, $htmlContent, &$allIssues) {
    // Check for keypress event listeners in scripts
    if (preg_match('/onkeypress|addEventListener.*keypress/i', $htmlContent)) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 46. Inconsistent link text
function run_check_inconsistent_link_text($check, $crawler, $htmlContent, &$allIssues) {
    $links = $crawler->filter('a[href]');
    $linkMap = [];
    
    foreach ($links as $linkNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($linkNode);
        $href = trim((string)$node->attr('href'));
        $text = trim($node->text('', true));
        
        if ($href && $text) {
            if (!isset($linkMap[$href])) {
                $linkMap[$href] = [];
            }
            $linkMap[$href][] = $text;
        }
    }
    
    foreach ($linkMap as $href => $texts) {
        $uniqueTexts = array_unique($texts);
        if (count($uniqueTexts) > 1) {
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity'],
                'context' => "URL: $href has different link texts: " . implode(', ', $uniqueTexts)
            ]);
        }
    }
}

// 47. Video without basic attributes
function run_check_video_no_basic_attrs($check, $crawler, $htmlContent, &$allIssues) {
    $videos = $crawler->filter('video');
    
    foreach ($videos as $videoNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($videoNode);
        $hasControls = $node->attr('controls') !== null;
        $hasPoster = $node->attr('poster') !== null;
        
        if (!$hasControls || !$hasPoster) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 48. Body text uses fixed pixel size
function run_check_fixed_font_size($check, $crawler, $htmlContent, &$allIssues) {
    // Check for fixed pixel font sizes in body or main text elements
    if (preg_match('/body\s*\{[^}]*font-size\s*:\s*\d+px/i', $htmlContent) ||
        preg_match('/p\s*\{[^}]*font-size\s*:\s*\d+px/i', $htmlContent)) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 49. Layout without semantic structure
function run_check_layout_no_semantic($check, $crawler, $htmlContent, &$allIssues) {
    $layoutElements = $crawler->filter('[style*="position"], [style*="grid"], [style*="flex"]');
    $semanticElements = $crawler->filter('section, article, aside, header, footer, nav, main');
    
    if ($layoutElements->count() > 5 && $semanticElements->count() < 2) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 50. User zoom disabled
function run_check_zoom_disabled($check, $crawler, $htmlContent, &$allIssues) {
    $viewportMeta = $crawler->filter('meta[name="viewport"]');
    
    foreach ($viewportMeta as $metaNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($metaNode);
        $content = strtolower((string)$node->attr('content'));
        
        if (strpos($content, 'user-scalable=no') !== false || 
            strpos($content, 'maximum-scale=1') !== false) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 51. No viewport meta tag
function run_check_no_viewport_meta($check, $crawler, $htmlContent, &$allIssues) {
    $viewportMeta = $crawler->filter('meta[name="viewport"]');
    
    if ($viewportMeta->count() === 0) {
        addIssue($allIssues, [
            'code' => $check['wcag_code'],
            'principle' => $check['principle'],
            'type' => $check['issue_type'],
            'title' => $check['title'],
            'description' => $check['description'],
            'recommendation' => $check['recommendation'],
            'severity' => $check['severity']
        ]);
    }
}

// 52. Form lacks ARIA enhancements
function run_check_form_no_aria($check, $crawler, $htmlContent, &$allIssues) {
    $forms = $crawler->filter('form');
    
    foreach ($forms as $formNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($formNode);
        $hasAriaEnhancements = $node->filter('[aria-label], [aria-describedby], [aria-invalid]')->count() > 0;
        
        if (!$hasAriaEnhancements && $node->filter('input, textarea, select')->count() > 2) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 53. Bullet points not using list elements
function run_check_bullets_not_lists($check, $crawler, $htmlContent, &$allIssues) {
    // Check for bullet characters without list markup
    if (preg_match('/[•\-\*]\s+\w+/u', $htmlContent)) {
        $lists = $crawler->filter('ul, ol');
        
        if ($lists->count() === 0) {
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 54. Vague link text found
function run_check_vague_link_text($check, $crawler, $htmlContent, &$allIssues) {
    $links = $crawler->filter('a');
    $vagueTerms = ['click here', 'here', 'more', 'read more', 'link', 'this', 'continue'];
    
    foreach ($links as $linkNode) {
        $node = new Symfony\Component\DomCrawler\Crawler($linkNode);
        $text = strtolower(trim($node->text('', true)));
        
        if (in_array($text, $vagueTerms, true)) {
            $elementHtml = getOuterHtml($node);
            addIssue($allIssues, [
                'code' => $check['wcag_code'],
                'principle' => $check['principle'],
                'type' => $check['issue_type'],
                'title' => $check['title'],
                'description' => $check['description'],
                'element' => $elementHtml,
                'recommendation' => $check['recommendation'],
                'severity' => $check['severity']
            ]);
        }
    }
}

// 55. HTML parsing issues (already handled in scan.php)
function run_check_html_parsing_errors($check, $crawler, $htmlContent, &$allIssues) {
    // This check is handled directly in scan.php when parsing HTML
    // No additional implementation needed here
}
