# Design Document: WCAG Sidebar Layout Redesign

## Overview

This design document outlines the technical implementation for redesigning the WCAG Guidelines page (wcag.php) with a sidebar-based navigation layout. The new design replaces the current table-based layout with a modern sidebar navigation system that displays all WCAG 2.1 Guidelines organized by principles, with dynamic content display in the main area.

### Design Goals

1. **Improved Navigation**: Provide intuitive sidebar navigation with collapsible principle groups
2. **Enhanced User Experience**: Enable seamless guideline browsing without page reloads
3. **Accessibility First**: Maintain WCAG 2.1 Level AA compliance throughout
4. **Responsive Design**: Adapt gracefully across desktop, tablet, and mobile devices
5. **Preserve Existing Functionality**: Maintain current data fetching and modal display patterns

### Key Features

- Left sidebar with collapsible WCAG principles
- Dynamic main content area displaying landing page or guideline details
- URL state management for shareable links
- Keyboard navigation support
- Mobile-responsive with hamburger menu
- Smooth transitions and animations

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Fixed Navbar                          │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│   Sidebar    │         Main Content Area                │
│              │                                           │
│  - Principles│  - Landing Page (default)                │
│  - Guidelines│  - Guideline Detail View (on selection)  │
│              │                                           │
│  (Fixed)     │  (Scrollable)                            │
│              │                                           │
├──────────────┴──────────────────────────────────────────┤
│                      Footer                              │
└─────────────────────────────────────────────────────────┘
```

### Layout System

The layout uses CSS Grid for the main structure and Flexbox for component-level layouts:

- **Grid Container**: Two-column layout (sidebar + main content)
- **Sidebar**: Fixed width on desktop, collapsible on mobile
- **Main Content**: Flexible width, adapts to available space
- **Responsive Breakpoints**: 768px (tablet), 576px (mobile)

### State Management

The application maintains state through:

1. **URL Parameters**: `?guideline=1.1.1` for shareable links
2. **DOM State**: Active sidebar item, expanded principles
3. **Data Cache**: Guidelines data loaded once on page load
4. **UI State**: Sidebar visibility (mobile), scroll position

## Components and Interfaces

### 1. Sidebar Component

#### HTML Structure

```html
<aside class="wcag-sidebar" id="wcagSidebar" role="navigation" aria-label="WCAG Guidelines Navigation">
  <!-- Mobile Toggle Button -->
  <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar" aria-expanded="true">
    <i class="bi bi-list"></i>
  </button>
  
  <!-- Sidebar Header -->
  <div class="sidebar-header">
    <h2 class="sidebar-title">WCAG 2.1 Guidelines</h2>
  </div>
  
  <!-- Sidebar Content -->
  <nav class="sidebar-nav">
    <!-- Principle Group (Repeatable) -->
    <div class="principle-group" data-principle="Perceivable">
      <button class="principle-header" aria-expanded="true" aria-controls="principle-perceivable">
        <span class="principle-icon perceivable">
          <i class="bi bi-eye"></i>
        </span>
        <span class="principle-name">Perceivable</span>
        <i class="bi bi-chevron-down expand-icon"></i>
      </button>
      
      <ul class="guideline-list" id="principle-perceivable" role="list">
        <!-- Guideline Item (Repeatable) -->
        <li class="guideline-item">
          <a href="#" class="guideline-link" data-guideline-id="1.1.1" role="button" tabindex="0">
            <span class="guideline-id">1.1.1</span>
            <span class="guideline-title">Non-text Content</span>
            <span class="level-badge level-A">A</span>
          </a>
        </li>
        <!-- More guidelines... -->
      </ul>
    </div>
    <!-- More principle groups... -->
  </nav>
</aside>
```

#### CSS Classes

- `.wcag-sidebar`: Main sidebar container
- `.sidebar-toggle`: Mobile menu toggle button
- `.sidebar-header`: Sidebar header section
- `.sidebar-nav`: Navigation container
- `.principle-group`: Collapsible principle section
- `.principle-header`: Clickable principle header
- `.principle-icon`: Icon container with principle-specific styling
- `.guideline-list`: List of guidelines under a principle
- `.guideline-item`: Individual guideline list item
- `.guideline-link`: Clickable guideline link
- `.guideline-link.active`: Active/selected guideline state

#### JavaScript Interface

```javascript
class WCAGSidebar {
  constructor(sidebarElement, onGuidelineSelect) {
    this.sidebar = sidebarElement;
    this.onGuidelineSelect = onGuidelineSelect;
    this.activeGuideline = null;
  }
  
  // Render sidebar with guidelines data
  render(guidelines) { }
  
  // Toggle principle expansion
  togglePrinciple(principleName) { }
  
  // Set active guideline
  setActiveGuideline(guidelineId) { }
  
  // Toggle sidebar visibility (mobile)
  toggleSidebar() { }
  
  // Handle keyboard navigation
  handleKeyboardNav(event) { }
}
```

### 2. Main Content Area Component

#### HTML Structure

```html
<main class="wcag-main-content" id="wcagMainContent" role="main">
  <!-- Landing Page (Default View) -->
  <div class="landing-page" id="landingPage">
    <!-- Hero Section -->
    <div class="wcag-hero">
      <h1>WCAG 2.1 Guidelines</h1>
      <p class="lead">Web Content Accessibility Guidelines (WCAG) 2.1 defines how to make web content more accessible to people with disabilities.</p>
      <p class="text-muted">These guidelines are organized around four principles: Perceivable, Operable, Understandable, and Robust.</p>
    </div>
    
    <!-- Conformance Levels Section -->
    <div class="conformance-levels-section">
      <!-- Conformance level cards... -->
    </div>
  </div>
  
  <!-- Guideline Detail View (Dynamic) -->
  <div class="guideline-detail-view" id="guidelineDetailView" style="display: none;">
    <!-- Content populated dynamically -->
  </div>
</main>
```

#### JavaScript Interface

```javascript
class WCAGMainContent {
  constructor(contentElement) {
    this.content = contentElement;
    this.landingPage = document.getElementById('landingPage');
    this.detailView = document.getElementById('guidelineDetailView');
  }
  
  // Show landing page
  showLandingPage() { }
  
  // Show guideline details
  showGuidelineDetail(guideline) { }
  
  // Render guideline detail content
  renderGuidelineDetail(guideline) { }
  
  // Announce content change to screen readers
  announceContentChange(message) { }
}
```

### 3. URL State Manager

```javascript
class URLStateManager {
  constructor(onStateChange) {
    this.onStateChange = onStateChange;
    this.init();
  }
  
  // Initialize popstate listener
  init() {
    window.addEventListener('popstate', (event) => {
      this.onStateChange(event.state);
    });
  }
  
  // Get current guideline from URL
  getCurrentGuideline() {
    const params = new URLSearchParams(window.location.search);
    return params.get('guideline');
  }
  
  // Update URL with guideline parameter
  updateURL(guidelineId) {
    const url = guidelineId 
      ? `?guideline=${encodeURIComponent(guidelineId)}`
      : window.location.pathname;
    window.history.pushState({ guideline: guidelineId }, '', url);
  }
  
  // Clear URL parameters
  clearURL() {
    window.history.pushState({}, '', window.location.pathname);
  }
}
```

### 4. Data Manager

```javascript
class WCAGDataManager {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.guidelines = [];
    this.guidelinesMap = new Map();
    this.loading = false;
    this.error = null;
  }
  
  // Fetch guidelines from API
  async fetchGuidelines() {
    if (this.loading) return;
    
    this.loading = true;
    try {
      const response = await fetch(this.apiEndpoint);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to load guidelines');
      
      this.guidelines = result.data;
      this.buildGuidelinesMap();
      this.loading = false;
      return this.guidelines;
    } catch (error) {
      this.error = error.message;
      this.loading = false;
      throw error;
    }
  }
  
  // Build map for quick guideline lookup
  buildGuidelinesMap() {
    this.guidelinesMap.clear();
    this.guidelines.forEach(guideline => {
      this.guidelinesMap.set(guideline.id, guideline);
    });
  }
  
  // Get guideline by ID
  getGuideline(guidelineId) {
    return this.guidelinesMap.get(guidelineId);
  }
  
  // Get guidelines grouped by principle
  getGuidelinesByPrinciple() {
    const grouped = {
      'Perceivable': [],
      'Operable': [],
      'Understandable': [],
      'Robust': []
    };
    
    this.guidelines.forEach(guideline => {
      if (grouped[guideline.principle]) {
        grouped[guideline.principle].push(guideline);
      }
    });
    
    return grouped;
  }
}
```

## Data Models

### Guideline Data Structure

The application uses the existing data structure from `api/get-wcag-guidelines.php`:

```typescript
interface Guideline {
  id: string;                    // e.g., "1.1.1"
  principle: string;             // "Perceivable" | "Operable" | "Understandable" | "Robust"
  title: string;                 // e.g., "Non-text Content"
  level: string;                 // "A" | "AA" | "AAA"
  description: string;           // Brief description
  explanation: string;           // Detailed explanation
  techniques: string[];          // Array of technique codes
  examples: {
    before: CodeExample | null;
    after: CodeExample | null;
    userGroups: string[];
    keySummary: string[];
    interactive: {
      enabled: boolean;
    };
    principle: string;
  };
}

interface CodeExample {
  html: string;
  css: string;
  js: string;
  context: string;              // User experience impact description
}
```

### UI State Model

```typescript
interface UIState {
  sidebarVisible: boolean;       // Sidebar visibility (mobile)
  expandedPrinciples: Set<string>; // Set of expanded principle names
  activeGuideline: string | null;  // Currently selected guideline ID
  viewMode: 'landing' | 'detail';  // Current view mode
  scrollPosition: number;          // Main content scroll position
}
```

## Error Handling

### Error Scenarios and Handling

1. **API Fetch Failure**
   - Display error message in main content area
   - Provide retry button
   - Log error to console for debugging

2. **Invalid Guideline ID in URL**
   - Show landing page
   - Display notification: "Guideline not found"
   - Clear invalid URL parameter

3. **Missing Guideline Data**
   - Show error state in detail view
   - Provide "Back to Guidelines" button

4. **Network Timeout**
   - Show loading indicator with timeout message
   - Provide manual retry option

### Error Display Component

```javascript
function showError(message, retryCallback) {
  const errorHTML = `
    <div class="error-state" role="alert">
      <div class="error-icon">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <h3>Error Loading Guidelines</h3>
      <p>${escapeHtml(message)}</p>
      ${retryCallback ? `
        <button class="btn btn-primary" onclick="retryCallback()">
          <i class="bi bi-arrow-clockwise"></i> Retry
        </button>
      ` : ''}
    </div>
  `;
  document.getElementById('wcagMainContent').innerHTML = errorHTML;
}
```

## Testing Strategy

### Unit Testing

**Focus Areas:**
- URL state management functions
- Data transformation and grouping logic
- Keyboard navigation handlers
- Sidebar collapse/expand logic
- Guideline selection and activation

**Example Tests:**
```javascript
describe('URLStateManager', () => {
  test('should extract guideline ID from URL', () => {
    // Test URL parsing
  });
  
  test('should update URL without page reload', () => {
    // Test history.pushState
  });
});

describe('WCAGDataManager', () => {
  test('should group guidelines by principle', () => {
    // Test data grouping
  });
  
  test('should handle API errors gracefully', () => {
    // Test error handling
  });
});
```

### Integration Testing

**Focus Areas:**
- Sidebar navigation to content display flow
- URL parameter to guideline display
- Mobile sidebar toggle functionality
- Keyboard navigation across components
- Screen reader announcements

**Example Tests:**
```javascript
describe('Sidebar to Content Integration', () => {
  test('clicking guideline should update main content', () => {
    // Test click handler integration
  });
  
  test('URL with guideline parameter should load correct content', () => {
    // Test URL-driven navigation
  });
});
```

### Accessibility Testing

**Manual Testing Checklist:**
- [ ] Keyboard navigation through sidebar
- [ ] Screen reader announces principle expansion
- [ ] Screen reader announces content changes
- [ ] Focus management when navigating
- [ ] Color contrast ratios meet WCAG AA
- [ ] Touch targets are 44x44px minimum
- [ ] Skip links function correctly

**Automated Testing:**
- Run axe-core accessibility scanner
- Validate ARIA attributes
- Check heading hierarchy
- Verify semantic HTML structure

### Responsive Testing

**Breakpoints to Test:**
- Desktop: 1920px, 1440px, 1024px
- Tablet: 768px, 834px
- Mobile: 375px, 414px, 390px

**Test Scenarios:**
- Sidebar collapses on mobile
- Toggle button appears and functions
- Content remains readable at all sizes
- Touch interactions work on mobile
- Landscape orientation on mobile

### Performance Testing

**Metrics to Monitor:**
- Initial page load time
- Time to interactive
- Guideline selection response time (<100ms requirement)
- Sidebar animation smoothness (60fps)
- Memory usage with all guidelines loaded

**Performance Optimization:**
- Lazy load guideline details
- Debounce scroll events
- Use CSS transforms for animations
- Minimize DOM manipulations
- Cache guideline data in memory

## Implementation Notes

### CSS Architecture

**File Organization:**
```
wcag-sidebar-layout.css
├── Variables (CSS Custom Properties)
├── Layout Grid
├── Sidebar Styles
├── Main Content Styles
├── Responsive Breakpoints
└── Animations
```

**Key CSS Variables:**
```css
:root {
  --sidebar-width: 320px;
  --sidebar-width-collapsed: 0;
  --content-padding: 2rem;
  --transition-speed: 0.3s;
  --mobile-breakpoint: 768px;
}
```

### JavaScript Module Structure

```
wcag-sidebar-app.js
├── WCAGDataManager
├── URLStateManager
├── WCAGSidebar
├── WCAGMainContent
└── WCAGApp (Main Controller)
```

### Accessibility Implementation

**ARIA Attributes:**
- `role="navigation"` on sidebar
- `aria-expanded` on collapsible elements
- `aria-current="page"` on active guideline
- `aria-label` on interactive elements
- `aria-live="polite"` for content changes

**Keyboard Navigation:**
- Tab: Move between focusable elements
- Enter/Space: Activate links and buttons
- Arrow keys: Navigate within sidebar
- Escape: Close mobile sidebar

**Focus Management:**
- Trap focus in mobile sidebar when open
- Return focus to trigger when closing
- Maintain focus visibility with outline
- Skip to main content link

### Performance Considerations

**Optimization Strategies:**
1. **Data Loading**: Single API call on page load, cache in memory
2. **DOM Updates**: Use DocumentFragment for batch updates
3. **Event Delegation**: Single listener on sidebar for all guideline clicks
4. **CSS Animations**: Use transform and opacity for GPU acceleration
5. **Debouncing**: Debounce resize and scroll events

**Code Splitting:**
- Core layout and navigation: Inline
- Guideline detail rendering: Separate module
- Modal functionality: Lazy load if needed

### Browser Compatibility

**Target Browsers:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 13+
- Chrome Mobile: Android 8+

**Polyfills Needed:**
- None (using modern JavaScript features supported in target browsers)

**Fallbacks:**
- CSS Grid: Flexbox fallback for older browsers
- CSS Custom Properties: Sass variables as fallback

### Migration Strategy

**Phase 1: Preparation**
1. Create new CSS file for sidebar layout
2. Create new JavaScript module
3. Test in development environment

**Phase 2: Implementation**
4. Update wcag.php with new HTML structure
5. Integrate JavaScript modules
6. Apply CSS styles

**Phase 3: Testing**
7. Functional testing
8. Accessibility testing
9. Cross-browser testing
10. Performance testing

**Phase 4: Deployment**
11. Deploy to production
12. Monitor for issues
13. Gather user feedback

### Future Enhancements

**Potential Improvements:**
1. Search functionality in sidebar
2. Bookmark/favorite guidelines
3. Print-friendly view
4. Dark mode support
5. Guideline comparison view
6. Progress tracking for learning
7. Offline support with Service Worker
8. Keyboard shortcuts reference

## Conclusion

This design provides a comprehensive blueprint for implementing the sidebar-based layout for the WCAG Guidelines page. The architecture prioritizes accessibility, performance, and maintainability while preserving existing functionality and data structures. The modular JavaScript approach allows for easy testing and future enhancements, while the responsive CSS ensures a great experience across all devices.

