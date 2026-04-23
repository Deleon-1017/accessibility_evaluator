-- ============================================================================
-- Migration 008: Create Accessibility Checks Table
-- ============================================================================
-- This migration creates a table to store the 45+ accessibility check rules
-- that were previously hardcoded in scan.php
-- ============================================================================

USE wcag_db;

-- ============================================================================
-- Accessibility Checks Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS accessibility_checks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    check_key VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique identifier for the check',
    wcag_code VARCHAR(20) NOT NULL COMMENT 'WCAG criterion code (e.g., 1.1.1)',
    principle ENUM('Perceivable', 'Operable', 'Understandable', 'Robust') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    severity ENUM('low', 'medium', 'high') NOT NULL,
    issue_type ENUM('error', 'warning', 'info') NOT NULL,
    selector VARCHAR(500) COMMENT 'CSS selector or XPath for the check',
    check_logic TEXT COMMENT 'Description of the check logic',
    enabled BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 50 COMMENT 'Execution priority (lower = earlier)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_check_key (check_key),
    INDEX idx_wcag_code (wcag_code),
    INDEX idx_principle (principle),
    INDEX idx_enabled (enabled),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Insert the 45 Accessibility Checks
-- ============================================================================

INSERT INTO accessibility_checks (check_key, wcag_code, principle, title, description, recommendation, severity, issue_type, selector, check_logic, priority) VALUES

-- 1. Image alt attributes
('img_missing_alt', '1.1.1', 'Perceivable', 'Image missing alt text', 
'Image is missing alternative text description.', 
'Add descriptive alt text. For decorative images, use alt="" or aria-hidden="true".', 
'high', 'error', 'img:not([alt])', 
'Check all img elements without alt attribute, excluding those with aria-hidden="true" or role="presentation"', 10),

-- 2. Page title check
('missing_page_title', '2.4.2', 'Operable', 'Missing page title', 
'The page does not have a descriptive <title> element.', 
'Add a concise, descriptive <title> that reflects the page content.', 
'high', 'error', 'title', 
'Check if title element exists and has non-empty text', 20),

-- 3. Language attribute on <html>
('missing_lang_attr', '3.1.1', 'Understandable', 'Missing language attribute', 
'The <html> element is missing a lang attribute.', 
'Add a lang attribute to the <html> element (e.g., lang="en").', 
'high', 'error', 'html[lang]', 
'Check if html element has lang attribute', 30),

-- 4. Missing primary heading
('missing_h1', '2.4.6', 'Operable', 'Missing primary heading', 
'The page does not contain an <h1> heading.', 
'Add a single <h1> heading that describes the page topic.', 
'medium', 'warning', 'h1', 
'Check if page has at least one h1 element', 40),

-- 5. Multiple h1 headings
('multiple_h1', '2.4.6', 'Operable', 'Multiple <h1> headings', 
'The page has more than one <h1> heading.', 
'Use one <h1> per page and structure the rest with <h2>-<h6>.', 
'low', 'info', 'h1', 
'Count h1 elements and flag if more than 1', 41),

-- 6. Skipped heading level
('skipped_heading_level', '1.3.1', 'Perceivable', 'Skipped heading level', 
'Heading levels should not skip levels (e.g., <h2> to <h4>).', 
'Use heading levels in a logical order without skipping.', 
'medium', 'warning', 'h1, h2, h3, h4, h5, h6', 
'Check sequential heading levels for gaps', 42),

-- 7. Link without accessible name
('link_no_accessible_name', '2.4.4', 'Operable', 'Link without accessible name', 
'Links must have meaningful text or an accessible name.', 
'Provide descriptive link text or an aria-label.', 
'high', 'error', 'a', 
'Check links for text content, aria-label, or img with alt', 50),

-- 8. Placeholder link detected
('placeholder_link', '2.4.4', 'Operable', 'Placeholder link detected', 
'Links with "#" or "javascript:" do not provide a real destination.', 
'Replace placeholder links with real destinations or use buttons for actions.', 
'low', 'warning', 'a[href="#"], a[href^="javascript:"]', 
'Check for links with href="#" or "javascript:"', 51),

-- 9. Form control missing label
('form_control_no_label', '3.3.2', 'Understandable', 'Form control missing label', 
'Form inputs must have associated labels or accessible names.', 
'Add a <label> associated with the control or an aria-label.', 
'high', 'error', 'input, textarea, select', 
'Check form controls for associated label or aria-label', 60),

-- 10. Button input missing label
('button_input_no_label', '4.1.2', 'Robust', 'Button input missing label', 
'Button inputs need a value or accessible name.', 
'Add a value attribute or aria-label to describe the button.', 
'high', 'error', 'input[type="submit"], input[type="reset"], input[type="button"]', 
'Check button inputs for value or accessible name', 61),

-- 11. Image input missing alt
('image_input_no_alt', '1.1.1', 'Perceivable', 'Image input missing alt text', 
'Image buttons must have alternative text.', 
'Provide descriptive alt text for image buttons.', 
'high', 'error', 'input[type="image"]', 
'Check image inputs for alt attribute', 62),

-- 12. Button missing accessible name
('button_no_accessible_name', '4.1.2', 'Robust', 'Button missing accessible name', 
'Buttons must have visible text or an accessible name.', 
'Add button text or an aria-label to describe its action.', 
'high', 'error', 'button', 
'Check button elements for text content or accessible name', 70),

-- 13. Iframe missing title
('iframe_no_title', '4.1.2', 'Robust', 'Iframe missing title', 
'Iframes must have a title describing their content.', 
'Add a descriptive title attribute to the iframe.', 
'medium', 'error', 'iframe', 
'Check iframe elements for title attribute', 80),

-- 14. Table missing headers
('table_no_headers', '1.3.1', 'Perceivable', 'Table missing headers', 
'Data tables should include headers or a caption.', 
'Use <th> elements and/or a <caption> to describe the table.', 
'medium', 'warning', 'table', 
'Check tables for th elements or caption', 90),

-- 15. Audio without transcript
('audio_no_transcript', '1.2.1', 'Perceivable', 'Audio without transcript', 
'Audio content should have a transcript or alternative format.', 
'Provide a transcript or use <track> elements for captions.', 
'medium', 'warning', 'audio', 
'Check audio elements for track elements', 100),

-- 16. Video without captions
('video_no_captions', '1.2.2', 'Perceivable', 'Video without captions', 
'Video content should have captions or a description track.', 
'Add <track> elements with captions or descriptive audio.', 
'medium', 'warning', 'video', 
'Check video elements for caption tracks', 101),

-- 17. Autoplay media without control
('autoplay_media', '1.4.2', 'Perceivable', 'Autoplay media without control', 
'Media that plays automatically must have a pause mechanism.', 
'Remove autoplay or provide a clear pause button.', 
'medium', 'warning', 'audio[autoplay], video[autoplay]', 
'Check for autoplay attribute on media elements', 102),

-- 18. Meta refresh redirect
('meta_refresh', '2.2.1', 'Operable', 'Meta refresh redirect detected', 
'Page redirects using meta refresh can confuse users.', 
'Use server-side redirects (HTTP 301/302) instead of meta refresh.', 
'low', 'warning', 'meta[http-equiv="refresh"]', 
'Check for meta refresh elements', 110),

-- 19. No skip navigation link
('no_skip_link', '2.4.1', 'Operable', 'No skip navigation link found', 
'Skip links help keyboard users bypass repetitive content.', 
'Add a skip link at the beginning of the page: <a href="#main">Skip to main content</a>', 
'low', 'info', 'a[href="#main"], a[href="#content"]', 
'Check for skip navigation links', 120),

-- 20. Positive tabindex detected
('positive_tabindex', '2.4.3', 'Operable', 'Positive tabindex detected', 
'Positive tabindex values can break natural tab order.', 
'Use tabindex="0" for focusable elements or remove it to follow natural order.', 
'medium', 'warning', '[tabindex]', 
'Check for positive tabindex values', 130),

-- 21. Required field without error structure
('required_no_error_structure', '3.3.1', 'Understandable', 'Required field without error message structure', 
'Required fields should provide feedback mechanism for errors.', 
'Link error messages with aria-describedby or use ARIA live regions.', 
'low', 'info', '[required], [aria-required="true"]', 
'Check required fields for error handling structure', 140),

-- 22. No language markup for non-Latin text
('no_lang_markup_non_latin', '3.1.2', 'Understandable', 'No language markup for non-Latin text', 
'Text in multiple languages should have language markup.', 
'Add lang attribute to elements with different language content.', 
'low', 'info', '[lang]', 
'Check for non-Latin characters without lang attributes', 150),

-- 23. Radio buttons not grouped
('radio_no_fieldset', '1.3.1', 'Perceivable', 'Radio buttons not grouped in fieldset', 
'Related radio buttons should be grouped in a <fieldset> with <legend>.', 
'Wrap radio button groups in <fieldset> and add descriptive <legend>.', 
'medium', 'warning', 'input[type="radio"]', 
'Check radio button groups for fieldset wrapper', 160),

-- 24. No ARIA live regions
('no_aria_live_regions', '4.1.3', 'Robust', 'No ARIA live regions for dynamic updates', 
'Forms with dynamic feedback should use ARIA live regions.', 
'Add elements with role="alert" or aria-live="polite" for form feedback.', 
'low', 'info', '[role="alert"], [aria-live]', 
'Check forms for ARIA live regions', 170),

-- 25. Empty heading
('empty_heading', '2.4.6', 'Operable', 'Empty heading', 
'Headings must contain descriptive text.', 
'Add meaningful text to heading elements.', 
'high', 'warning', 'h1, h2, h3, h4, h5, h6', 
'Check headings for empty text content', 180),

-- 26. Generic heading text
('generic_heading', '2.4.6', 'Operable', 'Generic heading text', 
'Headings should be descriptive and indicate content purpose.', 
'Use descriptive heading text that indicates the section purpose.', 
'low', 'info', 'h1, h2, h3, h4, h5, h6', 
'Check for generic heading text like "untitled", "heading"', 181),

-- 27. Hidden content accessibility
('hidden_content_accessibility', '1.3.1', 'Perceivable', 'Hidden content that may need screen reader access', 
'Content hidden with CSS may still need to be announced.', 
'Use aria-hidden="true" for decorative hidden content, or ensure it\'s accessible via keyboard.', 
'low', 'info', '[style*="display: none"], [hidden]', 
'Check hidden elements for appropriate aria-hidden', 190),

-- 28. ARIA role without accessible name
('aria_role_no_name', '4.1.2', 'Robust', 'ARIA role without accessible name', 
'Elements with ARIA roles must have an accessible name.', 
'Add text content or aria-label to elements with ARIA roles.', 
'high', 'error', '[role]', 
'Check elements with interactive roles for accessible names', 200),

-- 29. Missing main landmark
('missing_main_landmark', '2.4.1', 'Operable', 'Missing main landmark', 
'Pages should include a main landmark region.', 
'Add a <main> element or element with role="main" for the main content.', 
'low', 'info', 'main, [role="main"]', 
'Check for main landmark', 210),

-- 30. Missing navigation landmark
('missing_nav_landmark', '2.4.1', 'Operable', 'Missing navigation landmark', 
'Pages with navigation should have a nav element or navigation landmark.', 
'Wrap navigation links in a <nav> element or use role="navigation".', 
'low', 'info', 'nav, [role="navigation"]', 
'Check for navigation landmark', 211),

-- 31. Video missing audio description
('video_no_audio_desc', '1.2.3', 'Perceivable', 'Video missing audio description alternative', 
'Videos with important visual information should have audio descriptions.', 
'Provide audio description track or a detailed transcript describing visual content.', 
'medium', 'info', 'video', 
'Check videos for audio description tracks', 220),

-- 32. CSS reordering affects sequence
('css_reordering', '1.3.2', 'Perceivable', 'CSS reordering affects reading sequence', 
'Flexbox properties reorder visual layout, but screen readers follow HTML order.', 
'Ensure HTML source order matches the logical reading sequence, not CSS order.', 
'medium', 'warning', '[style*="flex-direction"], [style*="order"]', 
'Check for CSS properties that reorder content', 230),

-- 33. Color used to convey information
('color_only_info', '1.4.1', 'Perceivable', 'Color used to convey information', 
'Color alone appears to be used to convey meaning. Colorblind users will not perceive this information.', 
'Add text labels, icons, patterns, or other visual indicators in addition to color.', 
'medium', 'info', '[style*="color"], [style*="background-color"]', 
'Check for elements using only color to convey information', 240),

-- 34. Image used for text content
('image_for_text', '1.4.5', 'Perceivable', 'Image used for text content', 
'Using images instead of text can cause scaling and maintenance problems.', 
'Use CSS and HTML text formatting instead of images for text content.', 
'low', 'info', 'img', 
'Check images with alt text suggesting text content', 250),

-- 35. Non-semantic element with click handler
('non_semantic_clickable', '2.1.1', 'Operable', 'Non-semantic element with click handler', 
'Using div/span with onclick is not keyboard accessible by default.', 
'Use semantic <button> or <a> elements, or add proper ARIA role and keyboard handlers.', 
'high', 'warning', 'div[onclick], span[onclick]', 
'Check for onclick on non-interactive elements', 260),

-- 36. Marquee element used
('marquee_element', '2.2.2', 'Operable', 'Marquee element used', 
'The <marquee> element is obsolete and causes accessibility problems.', 
'Replace <marquee> with CSS animations or scrollable divs with pause controls.', 
'high', 'error', 'marquee', 
'Check for marquee elements', 270),

-- 37. Rapid flashing animation
('rapid_flashing', '2.3.1', 'Operable', 'Rapid flashing animation detected', 
'Animations flashing more than 3 times per second can trigger seizures.', 
'Reduce animation frequency or avoid rapid flashing animations entirely.', 
'high', 'error', 'style', 
'Check CSS animations for rapid flashing (< 333ms)', 280),

-- 38. Focus outline removed
('focus_outline_removed', '2.4.7', 'Operable', 'Focus outline removed without replacement', 
'CSS removes focus outline but provides no visible focus indicator.', 
'Keep focus outlines visible or replace with an alternative visible focus indicator.', 
'high', 'error', 'style', 
'Check CSS for outline:none on focus without replacement', 290),

-- 39. Limited navigation methods
('limited_navigation', '2.4.5', 'Operable', 'Limited navigation methods', 
'Page offers only one way to navigate. Users benefit from multiple navigation methods.', 
'Provide search, site map, and/or index in addition to navigation menus.', 
'low', 'info', 'input[type="search"], [role="search"]', 
'Check for multiple navigation methods', 300),

-- 40. Form submission on input change
('form_auto_submit', '3.2.1', 'Understandable', 'Form submission on input change', 
'Form auto-submits or navigates when user changes a field value.', 
'Remove auto-submit behavior. Users should initiate actions with a Submit button.', 
'high', 'error', 'select[onchange], input[onchange]', 
'Check for auto-submit on change events', 310),

-- 41. High-risk form lacks confirmation
('form_no_confirmation', '3.3.4', 'Understandable', 'High-risk form lacks confirmation', 
'Forms with deletion or financial operations need explicit confirmation.', 
'Add a confirmation step with clear description of the action and explicit Confirm/Cancel buttons.', 
'high', 'warning', 'form', 
'Check forms with delete/confirm/transaction fields for confirmation', 320),

-- 42. No client-side error handling
('no_client_error_handling', '3.3.3', 'Understandable', 'No client-side error handling detected', 
'Forms should provide suggestions when errors occur.', 
'Implement client-side and server-side validation with helpful error messages and correction suggestions.', 
'low', 'info', 'form', 
'Check forms for validation attributes', 330),

-- 43. Complex inputs missing help
('complex_input_no_help', '3.3.5', 'Understandable', 'Complex inputs missing help text', 
'Inputs with patterns, dates, or phone numbers need format guidance.', 
'Add title, placeholder, or aria-describedby pointing to help text describing expected format.', 
'low', 'info', 'input[pattern], input[type="date"]', 
'Check complex inputs for help text', 340),

-- 44. Touch events without fallback
('touch_no_fallback', '2.5.1', 'Operable', 'Touch events without mouse fallback', 
'Touch event handlers detected without keyboard/mouse alternatives.', 
'Provide equivalent keyboard and mouse event handlers alongside touch events.', 
'medium', 'warning', 'script', 
'Check for touchstart/touchmove without click handlers', 350),

-- 45. Character key shortcuts
('char_key_shortcuts', '2.1.4', 'Operable', 'Character key shortcuts detected', 
'Single character shortcuts can interfere with browser and assistive technology shortcuts.', 
'Use multi-key shortcuts (Ctrl+S) or allow users to disable/remap shortcuts.', 
'medium', 'warning', 'script', 
'Check for keypress event listeners', 360),

-- 46. Inconsistent link text
('inconsistent_link_text', '2.4.4', 'Operable', 'Inconsistent link text for same destination', 
'Same destination referenced with different link text.', 
'Use consistent link text for the same destination across the website.', 
'low', 'info', 'a', 
'Check for same href with different text', 370),

-- 47. Video without basic attributes
('video_no_basic_attrs', '1.2.4', 'Perceivable', 'Video element without basic attributes', 
'Video should have controls and poster image for better accessibility.', 
'Add controls attribute and poster image showing video content.', 
'medium', 'warning', 'video', 
'Check videos for controls and poster attributes', 380),

-- 48. Body text uses fixed pixel size
('fixed_font_size', '1.4.4', 'Perceivable', 'Body text uses fixed pixel size', 
'Fixed pixel sizes prevent text resizing in some browsers.', 
'Use relative units (rem, em, %) for font sizes to allow text resizing.', 
'medium', 'warning', 'style', 
'Check CSS for fixed pixel font sizes on body', 390),

-- 49. Layout without semantic structure
('layout_no_semantic', '1.3.2', 'Perceivable', 'Layout uses CSS positioning without semantic structure', 
'Complex layout using position or grid without semantic HTML can confuse screen readers.', 
'Use semantic HTML elements (section, article, nav) with ARIA landmarks to define layout structure.', 
'low', 'info', '[style*="position"], [style*="grid"]', 
'Check for CSS layout without semantic HTML', 400),

-- 50. User zoom disabled
('zoom_disabled', '1.4.4', 'Perceivable', 'User zoom disabled', 
'user-scalable=no prevents users from zooming, which harms accessibility.', 
'Remove user-scalable=no to allow users to zoom up to 200%.', 
'high', 'error', 'meta[name="viewport"]', 
'Check viewport meta for user-scalable=no', 410),

-- 51. No viewport meta tag
('no_viewport_meta', '1.4.4', 'Perceivable', 'No viewport meta tag', 
'Viewport meta tag helps with responsive design and zoom on mobile.', 
'Add <meta name="viewport" content="width=device-width, initial-scale=1">', 
'low', 'info', 'meta[name="viewport"]', 
'Check for viewport meta tag', 411),

-- 52. Form lacks ARIA enhancements
('form_no_aria', '4.1.2', 'Robust', 'Form lacks ARIA enhancements', 
'Complex forms benefit from ARIA labels and descriptions.', 
'Use aria-label, aria-describedby, and aria-invalid for enhanced form accessibility.', 
'low', 'info', 'form', 
'Check forms for ARIA attributes', 420),

-- 53. Bullet points not using list elements
('bullets_not_lists', '1.3.1', 'Perceivable', 'Bullet points not using list elements', 
'Content appears to have bullet-point lists but doesn\'t use <ul> elements.', 
'Use <ul><li> or <ol><li> elements for lists to provide proper structure.', 
'medium', 'warning', 'ul, ol', 
'Check for bullet characters without list markup', 430),

-- 54. Vague link text found
('vague_link_text', '2.4.4', 'Operable', 'Vague link text found', 
'Links use non-descriptive text like "click here" or "more".', 
'Write descriptive link text that describes destination/action. Avoid "click here".', 
'medium', 'warning', 'a', 
'Check for generic link text patterns', 440),

-- 55. HTML parsing issues
('html_parsing_errors', '4.1.1', 'Robust', 'HTML parsing issues detected', 
'The HTML contains parsing errors which may affect accessibility tools.', 
'Validate and fix HTML markup to ensure proper parsing by assistive technologies.', 
'low', 'warning', 'html', 
'Check for libxml parsing errors', 5);

-- ============================================================================
-- Verification
-- ============================================================================
SELECT COUNT(*) as total_checks FROM accessibility_checks;
SELECT principle, COUNT(*) as count FROM accessibility_checks GROUP BY principle;
SELECT severity, COUNT(*) as count FROM accessibility_checks GROUP BY severity;

