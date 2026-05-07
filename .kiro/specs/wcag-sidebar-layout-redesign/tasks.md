# Implementation Plan: WCAG Sidebar Layout Redesign

## Overview

This implementation plan breaks down the redesign of the WCAG Guidelines page (wcag.php) into actionable coding tasks. The new layout features a left sidebar with collapsible WCAG principles and a dynamic main content area that displays either a landing page or guideline details. The implementation preserves existing data fetching mechanisms and modal functionality while introducing modern navigation patterns with full accessibility support.

## Tasks

- [x] 1. Create CSS file for sidebar layout system
  - Create new file `wcag-sidebar-layout.css` with CSS Grid layout structure
  - Define CSS custom properties for sidebar width, transitions, and breakpoints
  - Implement two-column grid layout (sidebar + main content)
  - Add responsive breakpoints for tablet (768px) and mobile (576px)
  - _Requirements: 1.1, 1.7, 6.1, 6.2, 6.3, 6.4, 8.1, 8.2, 8.3_

- [x] 2. Implement sidebar HTML structure and styling
  - [x] 2.1 Create sidebar HTML structure in wcag.php
    - Add `<aside class="wcag-sidebar">` element with navigation role
    - Include sidebar header with "WCAG 2.1 Guidelines" title
    - Add mobile toggle button with appropriate ARIA attributes
    - Create container for principle groups and guideline lists
    - _Requirements: 1.1, 1.2, 6.2, 7.2, 7.3_
  
  - [x] 2.2 Style sidebar component with CSS
    - Style sidebar container with fixed positioning and appropriate width
    - Style principle headers with collapsible indicators
    - Style guideline links with hover and active states
    - Add principle-specific icon colors (Perceivable, Operable, Understandable, Robust)
    - Style level badges (A, AA, AAA) within sidebar items
    - _Requirements: 1.1, 1.7, 8.1, 8.2, 8.5, 8.6_
  
  - [x] 2.3 Implement mobile sidebar toggle styling
    - Style hamburger toggle button for mobile viewports
    - Add sidebar collapse/expand animations
    - Implement overlay backdrop for mobile sidebar
    - Style sidebar to slide in/out on mobile devices
    - _Requirements: 6.1, 6.2, 6.6_

- [x] 3. Implement main content area HTML structure
  - [x] 3.1 Create main content container in wcag.php
    - Add `<main class="wcag-main-content">` element
    - Create landing page section with hero and conformance levels
    - Create guideline detail view container (initially hidden)
    - Ensure proper semantic HTML structure with headings hierarchy
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.8_
  
  - [x] 3.2 Style main content area with CSS
    - Style main content container to flex with available space
    - Preserve existing hero section styling
    - Preserve existing conformance levels card styling
    - Add smooth transitions for view switching
    - _Requirements: 3.5, 8.4, 10.5_

- [x] 4. Create JavaScript data manager module
  - [x] 4.1 Implement WCAGDataManager class
    - Create class with constructor accepting API endpoint
    - Implement `fetchGuidelines()` method to call api/get-wcag-guidelines.php
    - Implement `buildGuidelinesMap()` for quick guideline lookup by ID
    - Implement `getGuideline(id)` method to retrieve specific guideline
    - Implement `getGuidelinesByPrinciple()` to group guidelines by principle
    - Add error handling for API failures with appropriate error messages
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 10.3, 10.4_
  
  - [ ]* 4.2 Write unit tests for WCAGDataManager
    - Test guideline grouping by principle
    - Test guideline lookup by ID
    - Test API error handling
    - Test data caching behavior
    - _Requirements: 9.2, 9.4_

- [x] 5. Create JavaScript URL state manager module
  - [x] 5.1 Implement URLStateManager class
    - Create class with constructor accepting state change callback
    - Implement `getCurrentGuideline()` to parse URL parameters
    - Implement `updateURL(guidelineId)` using history.pushState
    - Implement `clearURL()` to remove guideline parameter
    - Add popstate event listener for browser back/forward navigation
    - _Requirements: 2.6, 2.7_
  
  - [ ]* 5.2 Write unit tests for URLStateManager
    - Test URL parameter extraction
    - Test URL updates without page reload
    - Test browser history integration
    - _Requirements: 2.6, 2.7_

- [x] 6. Implement sidebar component JavaScript
  - [x] 6.1 Create WCAGSidebar class
    - Create class with constructor accepting sidebar element and callback
    - Implement `render(guidelines)` to populate sidebar with principle groups
    - Implement `togglePrinciple(principleName)` for expand/collapse functionality
    - Implement `setActiveGuideline(guidelineId)` to highlight selected guideline
    - Implement `toggleSidebar()` for mobile menu visibility
    - Add event delegation for guideline link clicks
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 6.2_
  
  - [x] 6.2 Implement keyboard navigation for sidebar
    - Add keyboard event handlers for Enter and Space keys on guideline links
    - Add keyboard event handlers for principle header expansion
    - Implement arrow key navigation within guideline lists
    - Implement Escape key to close mobile sidebar
    - Ensure proper focus management when navigating
    - _Requirements: 2.4, 2.5, 7.1, 7.5_
  
  - [ ]* 6.3 Write unit tests for WCAGSidebar
    - Test sidebar rendering with guidelines data
    - Test principle expand/collapse logic
    - Test active guideline highlighting
    - Test mobile sidebar toggle
    - _Requirements: 1.3, 1.4, 2.2_

- [x] 7. Checkpoint - Ensure sidebar navigation is functional
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement main content area JavaScript
  - [x] 8.1 Create WCAGMainContent class
    - Create class with constructor accepting content element
    - Implement `showLandingPage()` to display default landing view
    - Implement `showGuidelineDetail(guideline)` to display guideline details
    - Implement `renderGuidelineDetail(guideline)` to build detail HTML
    - Implement `announceContentChange(message)` for screen reader announcements
    - _Requirements: 3.1, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 7.4_
  
  - [x] 8.2 Implement guideline detail view rendering
    - Render guideline title and description
    - Render before/after code examples using existing modal format
    - Render user experience impact sections
    - Render techniques list
    - Render user groups who benefit
    - Preserve existing code highlighting and formatting
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_
  
  - [ ]* 8.3 Write unit tests for WCAGMainContent
    - Test landing page display
    - Test guideline detail rendering
    - Test content switching logic
    - _Requirements: 3.1, 3.5, 4.1_

- [x] 9. Create main application controller
  - [x] 9.1 Implement WCAGApp class
    - Create main controller class to coordinate all components
    - Initialize WCAGDataManager, URLStateManager, WCAGSidebar, and WCAGMainContent
    - Implement application initialization flow
    - Wire up event handlers between components
    - Handle initial page load with URL parameter
    - Add loading state management during data fetch
    - _Requirements: 2.1, 2.3, 2.6, 2.7, 9.3, 9.5, 10.1, 10.4_
  
  - [x] 9.2 Implement guideline selection flow
    - Handle guideline click in sidebar
    - Update URL state when guideline is selected
    - Update main content area with guideline details
    - Update sidebar active state
    - Manage focus after content change
    - _Requirements: 2.1, 2.2, 2.3, 2.6, 7.5, 10.1_
  
  - [x] 9.3 Implement error handling and loading states
    - Display loading indicator while fetching data
    - Display error message if API call fails
    - Provide retry functionality for failed requests
    - Handle invalid guideline IDs from URL gracefully
    - _Requirements: 9.3, 9.4, 9.5, 9.6_

- [x] 10. Implement accessibility features
  - [x] 10.1 Add ARIA attributes to sidebar
    - Add `role="navigation"` to sidebar
    - Add `aria-expanded` to principle headers
    - Add `aria-controls` linking headers to guideline lists
    - Add `aria-current="page"` to active guideline
    - Add `aria-label` to sidebar and toggle button
    - _Requirements: 7.2, 7.3_
  
  - [x] 10.2 Add ARIA live regions for content changes
    - Add `aria-live="polite"` region for content change announcements
    - Announce guideline selection to screen readers
    - Announce principle expansion/collapse to screen readers
    - _Requirements: 7.4_
  
  - [x] 10.3 Implement focus management
    - Trap focus in mobile sidebar when open
    - Return focus to toggle button when closing mobile sidebar
    - Maintain focus visibility with proper outline styles
    - Ensure skip to main content link is functional
    - _Requirements: 7.5, 7.7_
  
  - [x] 10.4 Verify color contrast and touch targets
    - Ensure all text meets WCAG AA contrast ratios (4.5:1 for normal text)
    - Ensure all interactive elements are at least 44x44px on mobile
    - Test with browser developer tools color contrast checker
    - _Requirements: 6.6, 7.6, 7.8_

- [x] 11. Integrate new layout into wcag.php
  - [x] 11.1 Update wcag.php HTML structure
    - Replace existing filter card and table layout with new sidebar layout
    - Move hero section into main content area
    - Move conformance levels section into landing page
    - Add new CSS file link to head section
    - Add new JavaScript file script tag before closing body
    - Preserve existing navbar and footer structure
    - _Requirements: 1.1, 3.2, 3.3, 3.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 11.2 Remove or comment out old table rendering code
    - Comment out or remove existing wcag-script.js table rendering logic
    - Keep modal functionality from wcag-script.js if reusable
    - Ensure no conflicts between old and new JavaScript code
    - _Requirements: 2.3, 4.7, 4.8_

- [x] 12. Implement responsive behavior
  - [x] 12.1 Add responsive CSS media queries
    - Add media query for tablet breakpoint (max-width: 991px)
    - Add media query for mobile breakpoint (max-width: 767px)
    - Implement sidebar collapse on mobile with hamburger menu
    - Adjust main content padding and spacing for smaller screens
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [x] 12.2 Add mobile sidebar toggle functionality
    - Implement toggle button click handler
    - Add overlay backdrop that closes sidebar when clicked
    - Implement smooth slide-in/slide-out animations
    - Ensure sidebar closes when guideline is selected on mobile
    - _Requirements: 6.2, 6.3_
  
  - [ ]* 12.3 Write integration tests for responsive behavior
    - Test sidebar visibility at different viewport widths
    - Test mobile toggle button functionality
    - Test touch interactions on mobile devices
    - _Requirements: 6.1, 6.2, 6.3, 6.6_

- [x] 13. Checkpoint - Ensure responsive layout works across devices
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Performance optimization
  - [x] 14.1 Optimize data loading and caching
    - Ensure guidelines data is fetched only once on page load
    - Cache guideline data in memory to avoid redundant API calls
    - Implement efficient guideline lookup using Map data structure
    - _Requirements: 10.3, 10.4_
  
  - [x] 14.2 Optimize DOM updates and animations
    - Use DocumentFragment for batch DOM updates when rendering sidebar
    - Use CSS transforms for animations (GPU acceleration)
    - Implement event delegation for guideline clicks
    - Debounce resize event handlers if needed
    - _Requirements: 10.1, 10.2, 10.5_
  
  - [ ]* 14.3 Write performance tests
    - Test guideline selection response time (target: <100ms)
    - Test sidebar animation smoothness (target: 60fps)
    - Test initial page load time
    - _Requirements: 10.1, 10.2_

- [ ] 15. Testing and validation
  - [ ]* 15.1 Perform accessibility testing
    - Test keyboard navigation through entire sidebar
    - Test with screen reader (NVDA, JAWS, or VoiceOver)
    - Verify ARIA attributes are correctly announced
    - Test focus management and skip links
    - Run axe-core accessibility scanner
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_
  
  - [ ]* 15.2 Perform cross-browser testing
    - Test in Chrome/Edge (latest 2 versions)
    - Test in Firefox (latest 2 versions)
    - Test in Safari (latest 2 versions)
    - Test in Mobile Safari (iOS 13+)
    - Test in Chrome Mobile (Android 8+)
    - _Requirements: 6.5, 10.6_
  
  - [ ]* 15.3 Perform responsive testing
    - Test at desktop resolutions (1920px, 1440px, 1024px)
    - Test at tablet resolutions (768px, 834px)
    - Test at mobile resolutions (375px, 414px, 390px)
    - Test landscape orientation on mobile
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 16. Final integration and polish
  - [x] 16.1 Verify all existing functionality is preserved
    - Verify navbar links work correctly
    - Verify footer links work correctly
    - Verify guideline data displays correctly
    - Verify code examples display correctly
    - Verify modal functionality (if still used) works correctly
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.1, 9.2_
  
  - [x] 16.2 Add smooth transitions and polish
    - Add smooth transitions for sidebar expansion/collapse
    - Add smooth transitions for content switching
    - Add loading animations for data fetching
    - Ensure all animations are smooth and performant
    - _Requirements: 10.2, 10.5_
  
  - [x] 16.3 Final cleanup and documentation
    - Remove commented-out old code
    - Add code comments for complex logic
    - Update any inline documentation
    - Verify all CSS classes follow naming conventions
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 17. Final checkpoint - Complete end-to-end testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The implementation uses JavaScript, HTML, and CSS as specified in the design document
- All existing data structures and API endpoints are preserved
- Focus on accessibility throughout implementation to meet WCAG 2.1 Level AA compliance
