<?php
/**
 * Verification Script: Check All 55 Functions Exist
 * Run this to verify all accessibility check functions are implemented
 */

require_once __DIR__ . '/scan-check-implementations.php';

echo "=== Accessibility Checks Verification ===\n\n";

// Expected check keys from database
$expectedChecks = [
    'img_missing_alt',
    'missing_page_title',
    'missing_lang_attr',
    'missing_h1',
    'multiple_h1',
    'skipped_heading_level',
    'link_no_accessible_name',
    'placeholder_link',
    'form_control_no_label',
    'button_input_no_label',
    'image_input_no_alt',
    'button_no_accessible_name',
    'iframe_no_title',
    'table_no_headers',
    'audio_no_transcript',
    'video_no_captions',
    'autoplay_media',
    'meta_refresh',
    'no_skip_link',
    'positive_tabindex',
    'required_no_error_structure',
    'no_lang_markup_non_latin',
    'radio_no_fieldset',
    'no_aria_live_regions',
    'empty_heading',
    'generic_heading',
    'hidden_content_accessibility',
    'aria_role_no_name',
    'missing_main_landmark',
    'missing_nav_landmark',
    'video_no_audio_desc',
    'css_reordering',
    'color_only_info',
    'image_for_text',
    'non_semantic_clickable',
    'marquee_element',
    'rapid_flashing',
    'focus_outline_removed',
    'limited_navigation',
    'form_auto_submit',
    'form_no_confirmation',
    'no_client_error_handling',
    'complex_input_no_help',
    'touch_no_fallback',
    'char_key_shortcuts',
    'inconsistent_link_text',
    'video_no_basic_attrs',
    'fixed_font_size',
    'layout_no_semantic',
    'zoom_disabled',
    'no_viewport_meta',
    'form_no_aria',
    'bullets_not_lists',
    'vague_link_text',
    'html_parsing_errors'
];

$totalChecks = count($expectedChecks);
$implementedCount = 0;
$missingChecks = [];

echo "Checking for $totalChecks expected functions...\n\n";

foreach ($expectedChecks as $index => $checkKey) {
    $functionName = 'run_check_' . $checkKey;
    $checkNumber = $index + 1;
    
    if (function_exists($functionName)) {
        echo "✅ Check #$checkNumber: $functionName\n";
        $implementedCount++;
    } else {
        echo "❌ Check #$checkNumber: $functionName - MISSING!\n";
        $missingChecks[] = $checkKey;
    }
}

echo "\n=== Summary ===\n";
echo "Total Expected: $totalChecks\n";
echo "Implemented: $implementedCount\n";
echo "Missing: " . count($missingChecks) . "\n";

if (count($missingChecks) > 0) {
    echo "\n❌ FAILED - Missing functions:\n";
    foreach ($missingChecks as $missing) {
        echo "  - run_check_$missing\n";
    }
    exit(1);
} else {
    echo "\n✅ SUCCESS - All 55 accessibility check functions are implemented!\n";
    echo "\nYour scanner is ready to use. Test it with:\n";
    echo "1. Open: http://localhost/trial/index.php\n";
    echo "2. Scan the test file: test-accessibility-checks.html\n";
    echo "3. You should see 30+ issues detected\n";
    exit(0);
}
