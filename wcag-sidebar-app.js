/**
 * WCAG Sidebar Application
 * 
 * This module provides the JavaScript functionality for the WCAG Guidelines
 * sidebar layout, including data management, URL state handling, sidebar
 * navigation, and main content display.
 */

/**
 * WCAGDataManager
 * 
 * Manages WCAG guidelines data fetching, caching, and retrieval.
 * Provides methods for accessing guidelines by ID or grouped by principle.
 */
class WCAGDataManager {
  /**
   * Create a new WCAGDataManager instance
   * @param {string} apiEndpoint - The API endpoint URL for fetching guidelines
   */
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.guidelines = [];
    this.guidelinesMap = new Map();
    this.loading = false;
    this.error = null;
  }
  
  /**
   * Fetch guidelines from the API
   * @returns {Promise<Array>} Array of guideline objects
   * @throws {Error} If the API request fails
   */
  async fetchGuidelines() {
    // Prevent multiple simultaneous fetches
    if (this.loading) {
      return this.guidelines;
    }
    
    this.loading = true;
    this.error = null;
    
    try {
      const response = await fetch(this.apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load guidelines');
      }
      
      this.guidelines = result.data;
      this.buildGuidelinesMap();
      this.loading = false;
      
      return this.guidelines;
    } catch (error) {
      this.error = error.message;
      this.loading = false;
      throw new Error(`Failed to fetch guidelines: ${error.message}`);
    }
  }
  
  /**
   * Build a Map for quick guideline lookup by ID
   * @private
   */
  buildGuidelinesMap() {
    this.guidelinesMap.clear();
    this.guidelines.forEach(guideline => {
      this.guidelinesMap.set(guideline.id, guideline);
    });
  }
  
  /**
   * Get a specific guideline by ID
   * @param {string} guidelineId - The guideline ID (e.g., "1.1.1")
   * @returns {Object|undefined} The guideline object or undefined if not found
   */
  getGuideline(guidelineId) {
    return this.guidelinesMap.get(guidelineId);
  }
  
  /**
   * Get guidelines grouped by principle
   * @returns {Object} Object with principle names as keys and arrays of guidelines as values
   */
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

/**
 * URLStateManager
 * 
 * Manages URL state for shareable links and browser navigation.
 * Handles URL parameter updates and popstate events for back/forward navigation.
 */
class URLStateManager {
  /**
   * Create a new URLStateManager instance
   * @param {Function} onStateChange - Callback function invoked when URL state changes
   */
  constructor(onStateChange) {
    this.onStateChange = onStateChange;
    this.init();
  }
  
  /**
   * Initialize popstate event listener for browser back/forward navigation
   * @private
   */
  init() {
    window.addEventListener('popstate', (event) => {
      const guidelineId = this.getCurrentGuideline();
      if (this.onStateChange) {
        this.onStateChange(guidelineId);
      }
    });
  }
  
  /**
   * Get the current guideline ID from URL parameters
   * @returns {string|null} The guideline ID or null if not present
   */
  getCurrentGuideline() {
    const params = new URLSearchParams(window.location.search);
    return params.get('guideline');
  }
  
  /**
   * Update the URL with a guideline parameter
   * @param {string} guidelineId - The guideline ID to add to the URL
   */
  updateURL(guidelineId) {
    if (guidelineId) {
      const url = `?guideline=${encodeURIComponent(guidelineId)}`;
      window.history.pushState({ guideline: guidelineId }, '', url);
    }
  }
  
  /**
   * Clear the guideline parameter from the URL
   */
  clearURL() {
    window.history.pushState({}, '', window.location.pathname);
  }
}
/**
 * WCAGSidebar
 * 
 * Manages the sidebar navigation component including rendering guidelines,
 * handling expand/collapse of principle groups, and managing active states.
 */
class WCAGSidebar {
  /**
   * Create a new WCAGSidebar instance
   * @param {HTMLElement} sidebarElement - The sidebar DOM element
   * @param {Function} onGuidelineSelect - Callback function invoked when a guideline is selected
   * @param {Function} onPrincipleToggle - Callback function invoked when a principle is expanded/collapsed
   */
  constructor(sidebarElement, onGuidelineSelect, onPrincipleToggle) {
    this.sidebar = sidebarElement;
    this.onGuidelineSelect = onGuidelineSelect;
    this.onPrincipleToggle = onPrincipleToggle;
    this.activeGuideline = null;
    this.expandedPrinciples = new Set(['Perceivable', 'Operable', 'Understandable', 'Robust']); // All expanded by default
    this.init();
  }
  
  /**
   * Initialize event listeners
   * @private
   */
  init() {
    // Event delegation for guideline link clicks
    this.sidebar.addEventListener('click', (event) => {
      // Handle guideline link clicks
      const guidelineLink = event.target.closest('.guideline-link');
      if (guidelineLink) {
        event.preventDefault();
        const guidelineId = guidelineLink.dataset.guidelineId;
        if (guidelineId && this.onGuidelineSelect) {
          this.onGuidelineSelect(guidelineId);
        }
        return;
      }
      
      // Handle principle header clicks
      const principleHeader = event.target.closest('.principle-header');
      if (principleHeader) {
        const principleGroup = principleHeader.closest('.principle-group');
        if (principleGroup) {
          const principleName = principleGroup.dataset.principle;
          this.togglePrinciple(principleName);
        }
      }
    });
    
    // Add keyboard navigation support
    this.sidebar.addEventListener('keydown', (event) => {
      this.handleKeyboardNav(event);
    });
  }
  
  /**
   * Render sidebar with guidelines data
   * @param {Object} guidelinesByPrinciple - Object with principle names as keys and arrays of guidelines as values
   */
  render(guidelinesByPrinciple) {
    const sidebarNav = this.sidebar.querySelector('.sidebar-nav');
    if (!sidebarNav) {
      console.error('Sidebar navigation container not found');
      return;
    }
    
    // Clear existing content
    sidebarNav.innerHTML = '';
    
    // Define principle order and icons
    const principleConfig = {
      'Perceivable': { icon: 'bi-eye', class: 'perceivable' },
      'Operable': { icon: 'bi-hand-index', class: 'operable' },
      'Understandable': { icon: 'bi-lightbulb', class: 'understandable' },
      'Robust': { icon: 'bi-shield-check', class: 'robust' }
    };
    
    // Render each principle group
    Object.keys(principleConfig).forEach(principleName => {
      const guidelines = guidelinesByPrinciple[principleName] || [];
      if (guidelines.length === 0) return;
      
      const config = principleConfig[principleName];
      const isExpanded = this.expandedPrinciples.has(principleName);
      const principleId = `principle-${principleName.toLowerCase()}`;
      
      // Create principle group
      const principleGroup = document.createElement('div');
      principleGroup.className = 'principle-group';
      principleGroup.dataset.principle = principleName;
      
      // Create principle header
      const principleHeader = document.createElement('button');
      principleHeader.className = 'principle-header';
      principleHeader.setAttribute('aria-expanded', isExpanded.toString());
      principleHeader.setAttribute('aria-controls', principleId);
      principleHeader.innerHTML = `
        <span class="principle-icon ${config.class}">
          <i class="${config.icon}"></i>
        </span>
        <span class="principle-name">${principleName}</span>
        <i class="bi bi-chevron-down expand-icon"></i>
      `;
      
      // Create guideline list
      const guidelineList = document.createElement('ul');
      guidelineList.className = 'guideline-list';
      guidelineList.id = principleId;
      guidelineList.setAttribute('role', 'list');
      if (!isExpanded) {
        guidelineList.style.display = 'none';
      }
      
      // Add guidelines to list
      guidelines.forEach(guideline => {
        const listItem = document.createElement('li');
        listItem.className = 'guideline-item';
        
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'guideline-link';
        link.dataset.guidelineId = guideline.id;
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.innerHTML = `
          <span class="guideline-id">${guideline.id}</span>
          <span class="guideline-title">${this.escapeHtml(guideline.title)}</span>
          <span class="level-badge level-${guideline.level}">${guideline.level}</span>
        `;
        
        listItem.appendChild(link);
        guidelineList.appendChild(listItem);
      });
      
      // Assemble principle group
      principleGroup.appendChild(principleHeader);
      principleGroup.appendChild(guidelineList);
      sidebarNav.appendChild(principleGroup);
    });
  }
  
  /**
   * Toggle principle expansion/collapse
   * @param {string} principleName - The name of the principle to toggle
   */
  togglePrinciple(principleName) {
    const principleGroup = this.sidebar.querySelector(`[data-principle="${principleName}"]`);
    if (!principleGroup) return;
    
    const principleHeader = principleGroup.querySelector('.principle-header');
    const guidelineList = principleGroup.querySelector('.guideline-list');
    
    if (!principleHeader || !guidelineList) return;
    
    const isExpanded = this.expandedPrinciples.has(principleName);
    
    if (isExpanded) {
      // Collapse
      this.expandedPrinciples.delete(principleName);
      principleHeader.setAttribute('aria-expanded', 'false');
      guidelineList.style.display = 'none';
      principleGroup.classList.remove('expanded');
      
      // Announce collapse to screen readers
      if (this.onPrincipleToggle) {
        this.onPrincipleToggle(principleName, false);
      }
    } else {
      // Expand
      this.expandedPrinciples.add(principleName);
      principleHeader.setAttribute('aria-expanded', 'true');
      guidelineList.style.display = 'block';
      principleGroup.classList.add('expanded');
      
      // Announce expansion to screen readers
      if (this.onPrincipleToggle) {
        this.onPrincipleToggle(principleName, true);
      }
    }
  }
  
  /**
   * Set active guideline and highlight it in the sidebar
   * @param {string} guidelineId - The guideline ID to set as active
   */
  setActiveGuideline(guidelineId) {
    // Remove active class from previously active guideline
    const previousActive = this.sidebar.querySelector('.guideline-link.active');
    if (previousActive) {
      previousActive.classList.remove('active');
      previousActive.removeAttribute('aria-current');
    }
    
    // Set new active guideline
    this.activeGuideline = guidelineId;
    
    if (guidelineId) {
      const newActive = this.sidebar.querySelector(`[data-guideline-id="${guidelineId}"]`);
      if (newActive) {
        newActive.classList.add('active');
        newActive.setAttribute('aria-current', 'page');
        
        // Ensure the principle containing this guideline is expanded
        const principleGroup = newActive.closest('.principle-group');
        if (principleGroup) {
          const principleName = principleGroup.dataset.principle;
          if (!this.expandedPrinciples.has(principleName)) {
            this.togglePrinciple(principleName);
          }
        }
        
        // Scroll the active guideline into view if needed
        newActive.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }
  
  /**
   * Toggle sidebar visibility (for mobile)
   */
  toggleSidebar() {
    this.sidebar.classList.toggle('sidebar-open');
    const isOpen = this.sidebar.classList.contains('sidebar-open');
    
    // Update toggle button aria-expanded state
    const toggleButton = document.getElementById('sidebarToggle');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', isOpen.toString());
    }
    
    // Manage overlay backdrop
    this.toggleOverlay(isOpen);
    
    // Manage body scroll lock on mobile
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Toggle sidebar width (collapsed/expanded for desktop)
   */
  toggleCollapse() {
    this.sidebar.classList.toggle('collapsed');
    const isCollapsed = this.sidebar.classList.contains('collapsed');
    
    // Toggle layout container class for grid adjustment
    const container = document.querySelector('.wcag-layout-container');
    if (container) {
      container.classList.toggle('sidebar-collapsed');
    }
    
    // Update aria state on collapse button
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    if (collapseBtn) {
      collapseBtn.setAttribute('aria-expanded', (!isCollapsed).toString());
    }
    
    return isCollapsed;
  }
  
  /**
   * Toggle overlay backdrop visibility
   * @param {boolean} show - Whether to show the overlay
   * @private
   */
  toggleOverlay(show) {
    let overlay = document.getElementById('sidebarOverlay');
    
    // Create overlay if it doesn't exist
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sidebarOverlay';
      overlay.className = 'sidebar-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      
      // Close sidebar when overlay is clicked
      overlay.addEventListener('click', () => {
        if (this.sidebar.classList.contains('sidebar-open')) {
          this.toggleSidebar();
        }
      });
      
      document.body.appendChild(overlay);
    }
    
    // Show or hide overlay
    if (show) {
      overlay.classList.add('active');
    } else {
      overlay.classList.remove('active');
    }
  }
  
  /**
   * Handle keyboard navigation within the sidebar
   * @param {KeyboardEvent} event - The keyboard event
   * @private
   */
  handleKeyboardNav(event) {
    const target = event.target;
    
    // Handle Enter and Space keys on guideline links
    if (target.classList.contains('guideline-link')) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const guidelineId = target.dataset.guidelineId;
        if (guidelineId && this.onGuidelineSelect) {
          this.onGuidelineSelect(guidelineId);
        }
        return;
      }
      
      // Handle arrow key navigation within guideline lists
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.navigateGuidelines(target, event.key === 'ArrowDown' ? 1 : -1);
        return;
      }
    }
    
    // Handle Enter and Space keys on principle headers
    if (target.classList.contains('principle-header')) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const principleGroup = target.closest('.principle-group');
        if (principleGroup) {
          const principleName = principleGroup.dataset.principle;
          this.togglePrinciple(principleName);
        }
        return;
      }
    }
    
    // Handle Escape key to close mobile sidebar
    if (event.key === 'Escape') {
      const isOpen = this.sidebar.classList.contains('sidebar-open');
      if (isOpen) {
        event.preventDefault();
        this.toggleSidebar();
        
        // Return focus to toggle button
        const toggleButton = document.getElementById('sidebarToggle');
        if (toggleButton) {
          toggleButton.focus();
        }
      }
    }
  }
  
  /**
   * Navigate between guidelines using arrow keys
   * @param {HTMLElement} currentLink - The currently focused guideline link
   * @param {number} direction - Direction to navigate (1 for down, -1 for up)
   * @private
   */
  navigateGuidelines(currentLink, direction) {
    // Get all visible guideline links
    const allLinks = Array.from(this.sidebar.querySelectorAll('.guideline-link'));
    const visibleLinks = allLinks.filter(link => {
      const guidelineList = link.closest('.guideline-list');
      return guidelineList && guidelineList.style.display !== 'none';
    });
    
    if (visibleLinks.length === 0) return;
    
    // Find current index
    const currentIndex = visibleLinks.indexOf(currentLink);
    if (currentIndex === -1) return;
    
    // Calculate next index with wrapping
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) {
      nextIndex = visibleLinks.length - 1;
    } else if (nextIndex >= visibleLinks.length) {
      nextIndex = 0;
    }
    
    // Focus the next link
    const nextLink = visibleLinks[nextIndex];
    if (nextLink) {
      nextLink.focus();
    }
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   * @private
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * WCAGMainContent
 * 
 * Manages the main content area component including landing page display,
 * guideline detail view rendering, and screen reader announcements.
 */
class WCAGMainContent {
  /**
   * Create a new WCAGMainContent instance
   * @param {HTMLElement} contentElement - The main content DOM element
   */
  constructor(contentElement) {
    this.content = contentElement;
    this.landingPage = document.getElementById('landingPage');
    this.detailView = document.getElementById('guidelineDetailView');
    this.ariaLiveRegion = this.createAriaLiveRegion();
  }
  
  /**
   * Create ARIA live region for screen reader announcements
   * @returns {HTMLElement} The ARIA live region element
   * @private
   */
  createAriaLiveRegion() {
    let liveRegion = document.getElementById('wcagAriaLive');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'wcagAriaLive';
      liveRegion.className = 'visually-hidden';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
    
    return liveRegion;
  }
  
  /**
   * Show the landing page view
   */
  showLandingPage() {
    if (this.landingPage) {
      this.landingPage.style.display = 'block';
    }
    
    if (this.detailView) {
      this.detailView.style.display = 'none';
    }
    
    // Scroll to top
    this.content.scrollTop = 0;
    
    // Manage focus - move focus to the main heading for keyboard users
    const heroHeading = this.landingPage?.querySelector('#hero-heading');
    if (heroHeading) {
      // Make heading focusable temporarily
      heroHeading.setAttribute('tabindex', '-1');
      // Focus the heading
      heroHeading.focus();
      // Remove tabindex after focus to prevent it from being in tab order
      heroHeading.addEventListener('blur', function removeTabindex() {
        heroHeading.removeAttribute('tabindex');
        heroHeading.removeEventListener('blur', removeTabindex);
      }, { once: true });
    }
    
    // Announce to screen readers
    this.announceContentChange('Showing WCAG Guidelines landing page');
  }
  
  /**
   * Show guideline detail view
   * @param {Object} guideline - The guideline object to display
   */
  showGuidelineDetail(guideline) {
    if (!guideline) {
      console.error('No guideline provided to showGuidelineDetail');
      this.showLandingPage();
      return;
    }
    
    // Hide landing page
    if (this.landingPage) {
      this.landingPage.style.display = 'none';
    }
    
    // Render guideline detail content
    this.renderGuidelineDetail(guideline);
    
    // Show detail view
    if (this.detailView) {
      this.detailView.style.display = 'block';
    }
    
    // Scroll to top
    this.content.scrollTop = 0;
    
    // Manage focus - move focus to the detail view heading for keyboard users
    // This ensures keyboard users know the content has changed
    const detailHeading = this.detailView.querySelector('.guideline-detail-title');
    if (detailHeading) {
      // Make heading focusable temporarily
      detailHeading.setAttribute('tabindex', '-1');
      // Focus the heading
      detailHeading.focus();
      // Remove tabindex after focus to prevent it from being in tab order
      detailHeading.addEventListener('blur', function removeTabindex() {
        detailHeading.removeAttribute('tabindex');
        detailHeading.removeEventListener('blur', removeTabindex);
      }, { once: true });
    }
    
    // Announce to screen readers
    this.announceContentChange(`Showing details for WCAG ${guideline.id}: ${guideline.title}`);
  }
  
  /**
   * Render guideline detail content
   * @param {Object} guideline - The guideline object to render
   */
  renderGuidelineDetail(guideline) {
    if (!this.detailView) {
      console.error('Detail view element not found');
      return;
    }
    
    // Build detail HTML using the same format as the modal
    const detailHTML = `
      <div class="guideline-detail-header">
        <h1 class="guideline-detail-title">WCAG ${guideline.id}: ${guideline.title}</h1>
        <div class="guideline-detail-meta">
          <span class="badge principle-badge principle-${guideline.principle.toLowerCase()}">${guideline.principle}</span>
          <span class="level-badge level-${guideline.level}">Level ${guideline.level}</span>
        </div>
      </div>
      
      <div class="guideline-details">
        <!-- Description -->
        <div class="wcag-modal-description">
          <p>${guideline.description}</p>
        </div>

        ${this.renderRedesignedExamples(guideline)}

        ${guideline.techniques && guideline.techniques.length > 0 ? this.renderTechniques(guideline.techniques) : ''}

        ${guideline.examples && guideline.examples.userGroups ? this.renderWhoBenefits(guideline.examples.userGroups) : ''}
      </div>
    `;
    
    this.detailView.innerHTML = detailHTML;
    
    // Attach copy button listeners
    this.attachCopyButtonListeners();
  }
  
  /**
   * Render redesigned examples section
   * @param {Object} guideline - The guideline object
   * @returns {string} HTML string for examples section
   * @private
   */
  renderRedesignedExamples(guideline) {
    if (!guideline.examples || (!guideline.examples.before && !guideline.examples.after)) {
      return '';
    }

    const before = guideline.examples.before;
    const after = guideline.examples.after;

    return `
      <!-- Before and After Comparisons -->
      <h3 class="wcag-modal-section-heading">Before and After Comparisons</h3>
      
      <!-- Code Comparison -->
      <div class="wcag-modal-comparison-grid">
        ${before && before.html ? `
        <div class="wcag-modal-code-box">
          <div class="wcag-modal-code-content">
            ${this.formatCodeWithLineNumbers(before.html)}
          </div>
        </div>
        ` : ''}

        ${after && after.html ? `
        <div class="wcag-modal-code-box">
          <div class="wcag-modal-code-content">
            ${this.formatCodeWithLineNumbers(after.html)}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Output Comparison (if available) -->
      ${this.renderOutputComparison(before, after)}

      <!-- Impact Comparison -->
      <div class="wcag-modal-impact-box full-width">
        <div class="wcag-modal-impact-header">
          <span class="wcag-modal-impact-label">User Experience Impact</span>
        </div>
        <div class="wcag-modal-impact-content-combined">
          ${before && before.context ? `
          <div class="impact-column before">
            <div class="impact-sub-label">Before</div>
            <p class="wcag-modal-impact-text">${this.highlightInaccessible(before.context)}</p>
          </div>
          ` : ''}
          
          ${before && before.context && after && after.context ? '<div class="impact-vertical-divider"></div>' : ''}

          ${after && after.context ? `
          <div class="impact-column after">
            <div class="impact-sub-label">After</div>
            <p class="wcag-modal-impact-text">${this.highlightAccessible(after.context)}</p>
          </div>
          ` : ''}
        </div>
      </div>

      ${this.renderKeySummary(guideline)}
    `;
  }
  
  /**
   * Format code with line numbers
   * @param {string} code - The code to format
   * @returns {string} HTML string with line numbers
   * @private
   */
  formatCodeWithLineNumbers(code) {
    const lines = code.trim().split('\n');
    return lines.map((line, index) => `
      <div class="wcag-modal-code-line">
        <span class="wcag-modal-line-number">${index + 1}</span>
        <span class="wcag-modal-line-code">${this.escapeHtml(line)}</span>
      </div>
    `).join('');
  }
  
  /**
   * Render output comparison section
   * @param {Object} before - Before example object
   * @param {Object} after - After example object
   * @returns {string} HTML string for output comparison
   * @private
   */
  renderOutputComparison(before, after) {
    // Only render if we have HTML to display
    if (!before?.html && !after?.html) {
      return '';
    }

    return `
      <!-- Visual Output Comparison -->
      <div class="wcag-modal-comparison-grid">
        ${before?.html ? `
        <div class="wcag-modal-output-box">
          <div class="wcag-modal-output-header">
            <span class="wcag-modal-output-label">Before: Output</span>
          </div>
          <div class="wcag-modal-output-content">
            <div class="wcag-modal-output-preview">
              ${this.renderVisualPreview(before.html, before.css, before.js, 'before')}
            </div>
          </div>
        </div>
        ` : ''}

        ${after?.html ? `
        <div class="wcag-modal-output-box">
          <div class="wcag-modal-output-header">
            <span class="wcag-modal-output-label">After: Output</span>
          </div>
          <div class="wcag-modal-output-content">
            <div class="wcag-modal-output-preview">
              ${this.renderVisualPreview(after.html, after.css, after.js, 'after')}
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Render visual preview in iframe
   * @param {string} html - HTML code
   * @param {string} css - CSS code
   * @param {string} js - JavaScript code
   * @param {string} type - Type identifier ('before' or 'after')
   * @returns {string} HTML string for iframe preview
   * @private
   */
  renderVisualPreview(html, css, js, type) {
    // Create a unique ID for this preview
    const previewId = `preview-${type}-${Date.now()}`;
    
    // Get the base URL for resolving relative paths
    const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    
    // Build the complete HTML document for the iframe
    const iframeContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="${baseUrl}">
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100px;
        }
        ${css || ''}
    </style>
</head>
<body>
    ${html}
    ${js ? `<script>${js}<\/script>` : ''}
    <script>
      // Auto-resize iframe to fit content
      window.addEventListener('load', function() {
        const height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        window.parent.postMessage({
          type: 'resize-iframe',
          id: '${previewId}',
          height: height
        }, '*');
      });
    <\/script>
</body>
</html>`;

    // Escape for srcdoc attribute
    const escapedContent = iframeContent
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');

    // Return iframe element
    return `
      <iframe 
        id="${previewId}"
        class="wcag-visual-preview-iframe"
        sandbox="allow-same-origin allow-scripts"
        title="${type === 'before' ? 'Before code output preview' : 'After code output preview'}"
        srcdoc="${escapedContent}"
        style="width: 100%; min-height: 150px; border: none; border-radius: 4px; background: white;">
      </iframe>
    `;
  }
  
  /**
   * Highlight inaccessible terms in text
   * @param {string} text - Text to highlight
   * @returns {string} HTML string with highlighted terms
   * @private
   */
  highlightInaccessible(text) {
    // Highlight key problematic terms in red
    return text.replace(/(image|filename|no meaningful information|inaccessible|cannot understand|lost)/gi, 
      '<span class="wcag-modal-impact-highlight">$1</span>');
  }
  
  /**
   * Highlight accessible terms in text
   * @param {string} text - Text to highlight
   * @returns {string} HTML string with highlighted terms
   * @private
   */
  highlightAccessible(text) {
    // Highlight key positive terms in green
    return text.replace(/(descriptive|accessible|clear|meaningful|understand|provides context)/gi, 
      '<span class="wcag-modal-impact-highlight accessible">$1</span>');
  }
  
  /**
   * Render key summary section
   * @param {Object} guideline - The guideline object
   * @returns {string} HTML string for key summary
   * @private
   */
  renderKeySummary(guideline) {
    if (!guideline.explanation && !guideline.examples.keySummary) {
      return '';
    }

    // Generate key summary points from explanation or use provided summary
    const summaryPoints = guideline.examples.keySummary || this.generateSummaryPoints(guideline);

    if (!summaryPoints || summaryPoints.length === 0) {
      return '';
    }

    return `
      <h3 class="wcag-modal-section-heading">Key Summary of Accessible Code</h3>
      <div class="wcag-modal-key-summary">
        <ul class="wcag-modal-summary-list">
          ${summaryPoints.map(point => `<li class="wcag-modal-summary-item">${point}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  /**
   * Generate summary points for a guideline
   * @param {Object} guideline - The guideline object
   * @returns {Array<string>} Array of summary points
   * @private
   */
  generateSummaryPoints(guideline) {
    // Default summary points based on guideline ID
    const summaries = {
      '1.1.1': [
        'Use descriptive alt text that conveys the purpose of the image',
        'For decorative images, use empty alt attribute (alt="")',
        'Avoid redundant phrases like "image of" or "picture of"',
        'Keep alt text concise but meaningful (typically under 150 characters)',
        'For complex images, provide longer descriptions using aria-describedby'
      ]
    };

    return summaries[guideline.id] || [];
  }
  
  /**
   * Render techniques section
   * @param {Array<string>} techniques - Array of technique codes
   * @returns {string} HTML string for techniques section
   * @private
   */
  renderTechniques(techniques) {
    // Split techniques into two columns
    const half = Math.ceil(techniques.length / 2);
    const leftColumn = techniques.slice(0, half);
    const rightColumn = techniques.slice(half);

    return `
      <h3 class="wcag-modal-section-heading">Techniques</h3>
      <div class="wcag-modal-techniques">
        <div class="wcag-modal-techniques-grid">
          <ul class="wcag-modal-summary-list">
            ${leftColumn.map(tech => `<li class="wcag-modal-technique-item">${tech}</li>`).join('')}
          </ul>
          ${rightColumn.length > 0 ? `
          <ul class="wcag-modal-summary-list">
            ${rightColumn.map(tech => `<li class="wcag-modal-technique-item">${tech}</li>`).join('')}
          </ul>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  /**
   * Render who benefits section
   * @param {Array<string>} userGroups - Array of user group names
   * @returns {string} HTML string for who benefits section
   * @private
   */
  renderWhoBenefits(userGroups) {
    if (!userGroups || userGroups.length === 0) {
      return '';
    }

    return `
      <div class="wcag-modal-benefits">
        <h4 class="wcag-modal-benefits-heading">Who Benefits from This</h4>
        <div class="wcag-modal-benefits-tags">
          ${userGroups.map(group => `<span class="wcag-modal-benefit-tag">${group}</span>`).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * Attach copy button event listeners
   * @private
   */
  attachCopyButtonListeners() {
    const copyButtons = this.detailView.querySelectorAll('.wcag-modal-copy-btn');
    copyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-copy-target');
        const codeElement = document.getElementById(targetId);
        
        if (codeElement) {
          const codeText = Array.from(codeElement.querySelectorAll('.wcag-modal-line-code'))
            .map(line => line.textContent)
            .join('\n');
          
          navigator.clipboard.writeText(codeText).then(() => {
            const copyText = this.querySelector('.copy-text');
            const originalText = copyText.textContent;
            
            this.classList.add('copied');
            copyText.textContent = 'Copied!';
            
            setTimeout(() => {
              this.classList.remove('copied');
              copyText.textContent = originalText;
            }, 2000);
          });
        }
      });
    });
  }
  
  /**
   * Announce content change to screen readers
   * @param {string} message - The message to announce
   */
  announceContentChange(message) {
    if (!this.ariaLiveRegion) {
      return;
    }
    
    // Clear previous message
    this.ariaLiveRegion.textContent = '';
    
    // Set new message after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      this.ariaLiveRegion.textContent = message;
      
      // Clear message after announcement
      setTimeout(() => {
        this.ariaLiveRegion.textContent = '';
      }, 1000);
    }, 100);
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   * @private
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * WCAGApp
 * 
 * Main application controller that coordinates all components and manages
 * the application lifecycle. Handles initialization, data loading, and
 * event coordination between sidebar, main content, and URL state.
 */
class WCAGApp {
  /**
   * Create a new WCAGApp instance
   * @param {Object} config - Configuration object
   * @param {string} config.apiEndpoint - API endpoint for fetching guidelines
   * @param {string} config.sidebarElementId - ID of the sidebar element
   * @param {string} config.mainContentElementId - ID of the main content element
   * @param {string} config.sidebarToggleId - ID of the sidebar toggle button
   */
  constructor(config) {
    this.config = {
      apiEndpoint: config.apiEndpoint || 'api/get-wcag-guidelines.php',
      sidebarElementId: config.sidebarElementId || 'wcagSidebar',
      mainContentElementId: config.mainContentElementId || 'wcagMainContent',
      sidebarToggleId: config.sidebarToggleId || 'sidebarToggle'
    };
    
    // Component instances
    this.dataManager = null;
    this.urlStateManager = null;
    this.sidebar = null;
    this.mainContent = null;
    
    // State
    this.initialized = false;
    this.loading = false;
  }
  
  /**
   * Initialize the application
   * @returns {Promise<void>}
   */
  async init() {
    if (this.initialized) {
      console.warn('[WCAGApp] Application already initialized');
      return;
    }
    
    try {
      console.log('[WCAGApp] Starting initialization');
      
      // Initialize data manager
      this.dataManager = new WCAGDataManager(this.config.apiEndpoint);
      console.log('[WCAGApp] Data manager created');
      
      // Initialize main content component
      const mainContentElement = document.getElementById(this.config.mainContentElementId);
      if (!mainContentElement) {
        throw new Error(`Main content element #${this.config.mainContentElementId} not found`);
      }
      this.mainContent = new WCAGMainContent(mainContentElement);
      console.log('[WCAGApp] Main content component created');
      
      // Initialize sidebar component
      const sidebarElement = document.getElementById(this.config.sidebarElementId);
      if (!sidebarElement) {
        throw new Error(`Sidebar element #${this.config.sidebarElementId} not found`);
      }
      this.sidebar = new WCAGSidebar(
        sidebarElement, 
        this.handleGuidelineSelect.bind(this),
        this.handlePrincipleToggle.bind(this)
      );
      console.log('[WCAGApp] Sidebar component created');
      
      // Initialize URL state manager
      this.urlStateManager = new URLStateManager(this.handleURLStateChange.bind(this));
      console.log('[WCAGApp] URL state manager created');
      
      // Setup sidebar toggle button
      this.setupSidebarToggle();
      
      // Setup iframe auto-resize listener
      this.setupIframeResizeListener();
      
      // Load initial data
      await this.loadData();
      
      // Handle initial URL state
      this.handleInitialState();
      
      this.initialized = true;
      console.log('[WCAGApp] Initialization complete');
      
    } catch (error) {
      console.error('[WCAGApp] Initialization error:', error);
      this.showError(error.message);
      throw error;
    }
  }
  
  /**
   * Load guidelines data from API
   * @returns {Promise<void>}
   * @private
   */
  async loadData() {
    if (this.loading) {
      console.warn('[WCAGApp] Data loading already in progress');
      return;
    }
    
    this.loading = true;
    
    try {
      console.log('[WCAGApp] Fetching guidelines...');
      
      // Show loading state
      this.showLoading();
      
      // Fetch guidelines
      const guidelines = await this.dataManager.fetchGuidelines();
      console.log('[WCAGApp] Guidelines fetched:', guidelines.length);
      
      // Render sidebar with guidelines
      const guidelinesByPrinciple = this.dataManager.getGuidelinesByPrinciple();
      this.sidebar.render(guidelinesByPrinciple);
      console.log('[WCAGApp] Sidebar rendered');
      
      // Hide loading state
      this.hideLoading();
      
      this.loading = false;
      
    } catch (error) {
      console.error('[WCAGApp] Error loading data:', error);
      this.loading = false;
      this.showError(`Failed to load guidelines: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Handle initial page state based on URL parameters
   * @private
   */
  handleInitialState() {
    const initialGuideline = this.urlStateManager.getCurrentGuideline();
    
    if (initialGuideline) {
      console.log('[WCAGApp] Initial guideline from URL:', initialGuideline);
      
      // Display guideline details
      const guideline = this.dataManager.getGuideline(initialGuideline);
      if (guideline) {
        // Set active guideline in sidebar
        this.sidebar.setActiveGuideline(initialGuideline);
        this.mainContent.showGuidelineDetail(guideline);
      } else {
        // Invalid guideline ID - show error notification and landing page
        console.warn('[WCAGApp] Invalid guideline ID from URL:', initialGuideline);
        this.showInvalidGuidelineNotification(initialGuideline);
        this.mainContent.showLandingPage();
        this.urlStateManager.clearURL();
      }
    } else {
      console.log('[WCAGApp] No initial guideline, showing landing page');
      this.mainContent.showLandingPage();
    }
  }
  
  /**
   * Show notification for invalid guideline ID
   * @param {string} guidelineId - The invalid guideline ID
   * @private
   */
  showInvalidGuidelineNotification(guidelineId) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'wcag-notification alert alert-warning';
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle me-2"></i>
        <div class="flex-grow-1">
          <strong>Guideline Not Found</strong>
          <p class="mb-0">The guideline "${this.escapeHtml(guidelineId)}" does not exist. Please select a guideline from the sidebar.</p>
        </div>
        <button type="button" class="btn-close" aria-label="Close notification"></button>
      </div>
    `;
    
    // Insert notification at the top of main content
    const mainContentElement = document.getElementById(this.config.mainContentElementId);
    if (mainContentElement) {
      mainContentElement.insertBefore(notification, mainContentElement.firstChild);
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 5000);
      
      // Add close button functionality
      const closeButton = notification.querySelector('.btn-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.3s ease';
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        });
      }
    }
  }
  
  /**
   * Handle guideline selection from sidebar
   * @param {string} guidelineId - The selected guideline ID
   * @private
   */
  handleGuidelineSelect(guidelineId) {
    console.log('[WCAGApp] Guideline selected:', guidelineId);
    
    // Update sidebar active state
    this.sidebar.setActiveGuideline(guidelineId);
    
    // Update URL
    this.urlStateManager.updateURL(guidelineId);
    
    // Display guideline details
    const guideline = this.dataManager.getGuideline(guidelineId);
    if (guideline) {
      this.mainContent.showGuidelineDetail(guideline);
    } else {
      console.error('[WCAGApp] Guideline not found:', guidelineId);
      this.mainContent.showLandingPage();
    }
    
    // Close mobile sidebar after selection
    if (window.innerWidth < 768 && this.sidebar.sidebar.classList.contains('sidebar-open')) {
      this.sidebar.toggleSidebar();
    }
  }
  
  /**
   * Handle principle expansion/collapse from sidebar
   * @param {string} principleName - The principle name that was toggled
   * @param {boolean} isExpanded - Whether the principle is now expanded
   * @private
   */
  handlePrincipleToggle(principleName, isExpanded) {
    const action = isExpanded ? 'expanded' : 'collapsed';
    this.mainContent.announceContentChange(`${principleName} principle ${action}`);
  }
  
  /**
   * Handle URL state changes (browser back/forward navigation)
   * @param {string|null} guidelineId - The guideline ID from URL
   * @private
   */
  handleURLStateChange(guidelineId) {
    console.log('[WCAGApp] URL state changed:', guidelineId);
    
    if (guidelineId) {
      // Set active guideline in sidebar
      this.sidebar.setActiveGuideline(guidelineId);
      
      // Display guideline details
      const guideline = this.dataManager.getGuideline(guidelineId);
      if (guideline) {
        this.mainContent.showGuidelineDetail(guideline);
      } else {
        console.warn('[WCAGApp] Guideline not found:', guidelineId);
        this.mainContent.showLandingPage();
        this.sidebar.setActiveGuideline(null);
      }
    } else {
      // No guideline selected, show landing page
      this.sidebar.setActiveGuideline(null);
      this.mainContent.showLandingPage();
    }
  }
  
  /**
   * Setup sidebar toggle button event listener
   * @private
   */
  setupSidebarToggle() {
    // 1. Mobile Sidebar Toggle (Offcanvas)
    const mobileToggleButton = document.getElementById(this.config.sidebarToggleId);
    if (mobileToggleButton) {
      mobileToggleButton.addEventListener('click', () => {
        this.sidebar.toggleSidebar();
      });
      console.log('[WCAGApp] Mobile sidebar toggle configured');
    }
    
    // 2. Desktop Sidebar Collapse Toggle
    const collapseButton = document.getElementById('sidebarCollapseBtn');
    if (collapseButton) {
      collapseButton.addEventListener('click', () => {
        const isCollapsed = this.sidebar.toggleCollapse();
        this.mainContent.announceContentChange(`Sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`);
      });
      console.log('[WCAGApp] Desktop sidebar collapse toggle configured');
    }
  }
  
  /**
   * Setup iframe auto-resize listener
   * Listens for resize messages from iframes and adjusts their height
   * @private
   */
  setupIframeResizeListener() {
    window.addEventListener('message', (event) => {
      // Check if this is a resize message
      if (event.data && event.data.type === 'resize-iframe') {
        const iframe = document.getElementById(event.data.id);
        if (iframe) {
          // Set the iframe height to match its content
          iframe.style.height = event.data.height + 'px';
          console.log(`[WCAGApp] Resized iframe ${event.data.id} to ${event.data.height}px`);
        }
      }
    });
    console.log('[WCAGApp] Iframe resize listener configured');
  }
  
  /**
   * Show loading state
   * @private
   */
  showLoading() {
    console.log('[WCAGApp] Showing loading state');
    
    // Create or get loading indicator element
    let loadingIndicator = document.getElementById('wcagLoadingIndicator');
    
    if (!loadingIndicator) {
      loadingIndicator = document.createElement('div');
      loadingIndicator.id = 'wcagLoadingIndicator';
      loadingIndicator.className = 'wcag-loading-indicator';
      loadingIndicator.setAttribute('role', 'status');
      loadingIndicator.setAttribute('aria-live', 'polite');
      loadingIndicator.innerHTML = `
        <div class="loading-content">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading guidelines...</span>
          </div>
          <p class="loading-text">Loading WCAG guidelines...</p>
        </div>
      `;
      
      // Insert at the beginning of main content
      const mainContentElement = document.getElementById(this.config.mainContentElementId);
      if (mainContentElement) {
        mainContentElement.insertBefore(loadingIndicator, mainContentElement.firstChild);
      }
    }
    
    // Show the loading indicator
    loadingIndicator.style.display = 'flex';
    
    // Hide landing page and detail view while loading
    if (this.mainContent) {
      if (this.mainContent.landingPage) {
        this.mainContent.landingPage.style.display = 'none';
      }
      if (this.mainContent.detailView) {
        this.mainContent.detailView.style.display = 'none';
      }
    }
  }
  
  /**
   * Hide loading state
   * @private
   */
  hideLoading() {
    console.log('[WCAGApp] Hiding loading state');
    
    const loadingIndicator = document.getElementById('wcagLoadingIndicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }
  
  /**
   * Show error message
   * @param {string} message - Error message to display
   * @private
   */
  showError(message) {
    console.error('[WCAGApp] Error:', message);
    
    // Hide loading indicator
    this.hideLoading();
    
    // Create or get error container
    let errorContainer = document.getElementById('wcagErrorContainer');
    
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'wcagErrorContainer';
      errorContainer.className = 'wcag-error-container';
      
      const mainContentElement = document.getElementById(this.config.mainContentElementId);
      if (mainContentElement) {
        mainContentElement.insertBefore(errorContainer, mainContentElement.firstChild);
      }
    }
    
    // Display error with retry functionality
    errorContainer.innerHTML = `
      <div class="error-state" role="alert">
        <div class="error-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3 class="error-title">Error Loading Guidelines</h3>
        <p class="error-message">${this.escapeHtml(message)}</p>
        <div class="error-actions">
          <button class="btn btn-primary retry-button" id="wcagRetryButton">
            <i class="bi bi-arrow-clockwise"></i> Retry
          </button>
        </div>
      </div>
    `;
    
    // Show error container
    errorContainer.style.display = 'block';
    
    // Hide landing page and detail view
    if (this.mainContent) {
      if (this.mainContent.landingPage) {
        this.mainContent.landingPage.style.display = 'none';
      }
      if (this.mainContent.detailView) {
        this.mainContent.detailView.style.display = 'none';
      }
    }
    
    // Attach retry button event listener
    const retryButton = document.getElementById('wcagRetryButton');
    if (retryButton) {
      retryButton.addEventListener('click', async () => {
        console.log('[WCAGApp] Retry button clicked');
        errorContainer.style.display = 'none';
        await this.loadData();
        
        // After successful retry, handle initial state
        if (!this.dataManager.error) {
          this.handleInitialState();
        }
      });
    }
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   * @private
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
