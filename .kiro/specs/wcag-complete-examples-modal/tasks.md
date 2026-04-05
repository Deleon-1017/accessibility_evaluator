# Implementation Plan: WCAG Complete Examples Modal

## Overview

This implementation extends the existing WCAG Success Criteria Details modal to include comprehensive before/after code examples with visual output rendering. The feature transforms the modal from a reference tool into an interactive learning platform where developers can see, understand, and copy accessibility implementation patterns.

The implementation uses JavaScript, HTML, and CSS to integrate seamlessly with the existing Bootstrap-based modal structure in wcag-script.js and wcag-data.js.

## Tasks

- [x] 1. Extend data structure with example data
  - [x] 1.1 Add examples property structure to wcagGuidelines array in wcag-data.js
    - Add `examples` object with `before`, `after`, `interactive`, `userGroups`, and `principle` properties
    - Include `html`, `css`, `js`, and `context` fields for before/after examples
    - Start with 3-5 representative examples (1.1.1 Non-text Content, 2.1.1 Keyboard, 1.4.3 Contrast)
    - _Requirements: 6.1, 6.3, 12.5_
  
  - [ ]* 1.2 Write unit tests for data structure validation
    - Test that examples have required properties
    - Test that HTML/CSS/JS code is valid strings
    - _Requirements: 6.3_

- [x] 2. Implement syntax highlighting for CSS and JavaScript
  - [x] 2.1 Create syntaxHighlightCode() function in wcag-script.js
    - Accept code string and language parameter (html, css, javascript)
    - Reuse existing syntaxHighlightLine() for HTML
    - Return highlighted HTML string with span elements for colorization
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 2.2 Create syntaxHighlightCSSLine() helper function
    - Highlight CSS selectors, properties, and values
    - Use distinct color classes for each element type
    - _Requirements: 3.2_
  
  - [x] 2.3 Create syntaxHighlightJSLine() helper function
    - Highlight JavaScript keywords, strings, and function names
    - Handle common patterns (const, let, function, return, etc.)
    - _Requirements: 3.3_
  
  - [x] 2.4 Add CSS classes for syntax highlighting colors
    - Add .css-selector, .css-property, .css-value classes to style.css
    - Add .js-keyword, .js-string, .js-function classes to style.css
    - Ensure 4.5:1 contrast ratio for all syntax colors
    - _Requirements: 3.4, 3.5_
  
  - [ ]* 2.5 Write unit tests for syntax highlighting functions
    - Test HTML, CSS, and JavaScript highlighting
    - Test edge cases (empty strings, special characters)
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Create visual output renderer with sandboxing
  - [x] 3.1 Implement renderExampleVisualOutput() function in wcag-script.js
    - Accept containerId, htmlCode, cssCode, jsCode, and guideline parameters
    - Create iframe element with sandbox attribute
    - Build complete HTML document with CSS and JS injection
    - Handle iframe document writing and error boundaries
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.8_
  
  - [x] 3.2 Add error handling for JavaScript execution in visual output
    - Wrap JS execution in try-catch block
    - Display user-friendly error messages in iframe
    - Log errors to console without breaking modal
    - _Requirements: 2.8, 10.4_
  
  - [x] 3.3 Implement execution timeout for long-running scripts
    - Set 100ms timeout for JavaScript execution
    - Display loading indicator for slow scripts
    - _Requirements: 8.5, 10.5_
  
  - [x] 3.4 Add CSS for visual output containers
    - Style .visual-output-iframe with border and responsive sizing
    - Add .visual-output-container and .visual-output-header styles
    - Ensure visual isolation from modal styling
    - _Requirements: 2.5, 11.5_
  
  - [ ]* 3.5 Write integration tests for visual output rendering
    - Test iframe creation and sandboxing
    - Test HTML/CSS/JS injection
    - Test error handling for malformed code
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.8_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement copy-to-clipboard functionality
  - [x] 5.1 Create setupCopyButtons() function in wcag-script.js
    - Query all .copy-btn elements and attach click handlers
    - Use navigator.clipboard.writeText() API
    - Handle async clipboard operations
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 5.2 Create showCopyConfirmation() helper function
    - Display "Copied!" message for 2 seconds
    - Change button styling to success state
    - Restore original button state after timeout
    - _Requirements: 5.4_
  
  - [x] 5.3 Create fallbackCopyMethod() for clipboard API failures
    - Use document.createRange() and window.getSelection()
    - Display alert with copy instructions
    - _Requirements: 5.5_
  
  - [x] 5.4 Add CSS for copy button states
    - Style .copy-btn with hover and focus states
    - Add success state styling for confirmation
    - Ensure keyboard accessibility
    - _Requirements: 5.6_
  
  - [ ]* 5.5 Write unit tests for copy functionality
    - Test clipboard API success path
    - Test fallback method when API unavailable
    - Test confirmation message display
    - _Requirements: 5.3, 5.4, 5.5_

- [-] 6. Extend showGuidelineDetails() to render example sections
  - [-] 6.1 Add example section HTML generation in showGuidelineDetails()
    - Insert new section between "Simple Description" and "How to Implement"
    - Generate skip links for before/after examples
    - Create before and after example cards with proper structure
    - Use template literals for clean HTML generation
    - _Requirements: 1.1, 12.1, 12.2_
  
  - [x] 6.2 Generate educational context sections
    - Display context text from guideline.examples.before.context
    - Display context text from guideline.examples.after.context
    - Include principle and user groups information
    - Use alert styling (warning for before, success for after)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 6.3 Generate code display sections with syntax highlighting
    - Create separate sections for HTML, CSS, and JavaScript code
    - Apply syntax highlighting using syntaxHighlightCode()
    - Add copy buttons with proper data attributes
    - Display line numbers for code over 20 lines
    - _Requirements: 1.2, 1.3, 1.4, 3.6_
  
  - [x] 6.4 Generate visual output containers with lazy loading attributes
    - Create .visual-output-container elements with data-render-target
    - Add proper ARIA labels and semantic structure
    - Include visual output headers
    - _Requirements: 2.1, 2.2, 8.2_
  
  - [-] 6.5 Add interactive instructions section when applicable
    - Check guideline.examples.interactive.enabled flag
    - Display instructions from guideline.examples.interactive.instructions
    - Use info alert styling with keyboard icon
    - _Requirements: 7.4_
  
  - [x] 6.6 Handle missing example data gracefully
    - Check if guideline.examples exists before rendering
    - Display "Examples coming soon" message when data missing
    - Maintain modal layout consistency
    - _Requirements: 10.1, 10.2_

- [x] 7. Implement lazy loading for visual output
  - [x] 7.1 Create setupLazyLoading() function in wcag-script.js
    - Use IntersectionObserver API to detect when containers are visible
    - Set rootMargin to 50px for preloading
    - Call renderExampleVisualOutput() when container intersects
    - Unobserve after rendering to prevent duplicate renders
    - _Requirements: 8.2_
  
  - [x] 7.2 Call setupLazyLoading() after modal content is inserted
    - Invoke after modalBody.innerHTML is set in showGuidelineDetails()
    - Ensure observers are attached to all .visual-output-container elements
    - _Requirements: 8.2_
  
  - [ ]* 7.3 Write integration tests for lazy loading
    - Test IntersectionObserver triggers rendering
    - Test that rendering only happens once per container
    - _Requirements: 8.2_

- [x] 8. Add responsive CSS for example sections
  - [x] 8.1 Create desktop layout styles (min-width: 992px)
    - Use CSS Grid for side-by-side before/after layout
    - Set .examples-container to display: grid with 2 columns
    - Add gap between example cards
    - _Requirements: 1.5, 11.1_
  
  - [x] 8.2 Create mobile layout styles (max-width: 991px)
    - Stack example cards vertically
    - Set .examples-container to single column
    - Adjust font sizes for readability (14px minimum)
    - _Requirements: 1.6, 11.1, 11.2, 11.3_
  
  - [x] 8.3 Style example cards with proper spacing and borders
    - Add .example-card, .before-example, .after-example classes
    - Use border colors to distinguish before (warning) and after (success)
    - Add padding and margin for visual hierarchy
    - _Requirements: 1.5, 1.6_
  
  - [x] 8.4 Style code sections with proper formatting
    - Add .code-section, .code-header, .code-block classes
    - Use monospace font for code display
    - Add horizontal scrolling for long code lines on mobile
    - Set max-height with overflow for very long code blocks
    - _Requirements: 11.4_
  
  - [x] 8.5 Add responsive modal sizing for mobile
    - Ensure modal occupies 95% of viewport height on mobile
    - Maintain scrollability for long content
    - _Requirements: 11.6_

- [x] 9. Implement accessibility features for modal
  - [x] 9.1 Add skip links for navigation
    - Create .example-skip-links navigation with links to #before-example and #after-example
    - Style skip links as visible buttons
    - Ensure keyboard accessibility
    - _Requirements: 9.6_
  
  - [x] 9.2 Add proper ARIA attributes to example sections
    - Use role="article" for example cards
    - Add aria-labelledby pointing to section headings
    - Use role="note" for educational context
    - _Requirements: 9.4, 9.5_
  
  - [x] 9.3 Ensure logical reading order for screen readers
    - Structure HTML in order: context, code, visual output
    - Use semantic HTML5 elements (article, section, nav)
    - Test with screen reader to verify announcement order
    - _Requirements: 9.8_
  
  - [x] 9.4 Include visual output interactive elements in focus order
    - Ensure iframe content is keyboard accessible
    - Test tab navigation through interactive examples
    - _Requirements: 9.7_
  
  - [ ]* 9.5 Write accessibility compliance tests
    - Test keyboard navigation through modal
    - Test screen reader announcements
    - Test focus management
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Add example data for priority WCAG criteria
  - [x] 11.1 Add examples for Level A criteria (highest priority)
    - Create examples for 1.1.1 Non-text Content
    - Create examples for 2.1.1 Keyboard
    - Create examples for 2.4.1 Bypass Blocks
    - Create examples for 3.1.1 Language of Page
    - Create examples for 4.1.2 Name, Role, Value
    - _Requirements: 6.1_
  
  - [x] 11.2 Add examples for common Level AA criteria
    - Create examples for 1.4.3 Contrast (Minimum)
    - Create examples for 2.4.6 Headings and Labels
    - Create examples for 3.2.3 Consistent Navigation
    - _Requirements: 6.1_
  
  - [x] 11.3 Add interactive examples for keyboard and focus criteria
    - Enable interactive flag for 2.1.1 Keyboard examples
    - Enable interactive flag for 2.4.7 Focus Visible examples
    - Add keyboard testing instructions
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 11.4 Add examples demonstrating ARIA live regions
    - Create examples for 4.1.3 Status Messages
    - Enable interactive flag and add testing instructions
    - _Requirements: 7.3_

- [ ] 12. Add error handling and edge cases
  - [ ] 12.1 Handle invalid HTML in visual output
    - Detect rendering failures in renderExampleVisualOutput()
    - Display error message in preview area
    - Show code example even when rendering fails
    - _Requirements: 10.3_
  
  - [ ] 12.2 Implement resource limits for visual output
    - Add timeout for excessive DOM manipulation
    - Prevent infinite loops from blocking UI
    - _Requirements: 10.5_
  
  - [ ] 12.3 Add "Disable Visual Preview" option
    - Create toggle button in modal header
    - Store preference in localStorage
    - Show code-only view when disabled
    - _Requirements: 10.6_
  
  - [ ]* 12.4 Write edge case tests
    - Test missing example data handling
    - Test invalid code rendering
    - Test JavaScript error handling
    - Test performance with large code examples
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 13. Final integration and polish
  - [ ] 13.1 Test modal with all example data
    - Open modal for each criterion with examples
    - Verify layout, styling, and functionality
    - Test on desktop and mobile viewports
    - _Requirements: 1.5, 1.6, 11.1, 11.2_
  
  - [ ] 13.2 Verify Bootstrap integration
    - Ensure modal-xl class is maintained
    - Test modal open/close behavior
    - Verify scroll behavior with long content
    - _Requirements: 12.3, 12.4_
  
  - [ ] 13.3 Test keyboard navigation end-to-end
    - Test Tab navigation through all interactive elements
    - Test Escape key to close modal
    - Test focus return to trigger element
    - _Requirements: 9.1, 9.2, 9.3_
  
  - [ ] 13.4 Optimize performance
    - Verify modal renders within 500ms
    - Test lazy loading triggers correctly
    - Check memory usage with multiple modal opens
    - _Requirements: 8.1, 8.2_
  
  - [ ]* 13.5 Write end-to-end integration tests
    - Test complete user flow from clicking criterion to copying code
    - Test responsive behavior at different viewport sizes
    - Test accessibility with keyboard and screen reader
    - _Requirements: All requirements_

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation builds incrementally: data structure → rendering → interactivity → polish
- Checkpoints ensure validation at key milestones
- Focus on core functionality first (tasks 1-6), then enhance with lazy loading, responsive design, and comprehensive examples
- The feature integrates with existing wcag-script.js and wcag-data.js without breaking current functionality
