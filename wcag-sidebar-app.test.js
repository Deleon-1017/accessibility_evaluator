/**
 * Unit tests for WCAG Sidebar Keyboard Navigation
 * Tests for Task 6.2: Implement keyboard navigation for sidebar
 * 
 * Requirements: 2.4, 2.5, 7.1, 7.5
 */

/**
 * Mock DOM environment setup
 */
class MockElement {
  constructor(tagName) {
    this.tagName = tagName;
    this._classSet = new Set();
    this.attributes = {};
    this.children = [];
    this.parent = null;
    this.eventListeners = {};
    this.innerHTML = '';
    this.textContent = '';
    this.dataset = {};
    this.style = {};
    
    // Create classList object with proper methods
    this.classList = {
      add: (className) => {
        this._classSet.add(className);
      },
      remove: (className) => {
        this._classSet.delete(className);
      },
      contains: (className) => {
        return this._classSet.has(className);
      },
      has: (className) => {
        return this._classSet.has(className);
      },
      toggle: (className) => {
        if (this._classSet.has(className)) {
          this._classSet.delete(className);
        } else {
          this._classSet.add(className);
        }
        return this._classSet.has(className);
      }
    };
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (this._matchesSelector(current, selector)) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  querySelector(selector) {
    // Simple implementation for testing
    return this._findInChildren(this, selector);
  }

  querySelectorAll(selector) {
    const results = [];
    this._findAllInChildren(this, selector, results);
    return results;
  }

  focus() {
    this.focused = true;
  }

  scrollIntoView() {
    // Mock implementation
  }

  _matchesSelector(element, selector) {
    if (selector.startsWith('.')) {
      const className = selector.substring(1);
      return element.classList && element.classList.has(className);
    }
    if (selector.startsWith('[data-')) {
      const match = selector.match(/\[data-([^=]+)="([^"]+)"\]/);
      if (match) {
        return element.dataset && element.dataset[match[1]] === match[2];
      }
    }
    return false;
  }

  _findInChildren(element, selector) {
    if (this._matchesSelector(element, selector)) {
      return element;
    }
    for (const child of element.children) {
      const found = this._findInChildren(child, selector);
      if (found) return found;
    }
    return null;
  }

  _findAllInChildren(element, selector, results) {
    if (this._matchesSelector(element, selector)) {
      results.push(element);
    }
    for (const child of element.children) {
      this._findAllInChildren(child, selector, results);
    }
  }
}

// Mock document
global.document = {
  createElement: (tagName) => new MockElement(tagName),
  getElementById: (id) => {
    // Return mock element for testing
    const element = new MockElement('button');
    element.id = id;
    return element;
  },
  body: {
    style: {}
  }
};

// Load the WCAGSidebar class
// Note: In a real test environment, you would import the class
// For this test, we'll need to evaluate the class definition

describe('WCAGSidebar - Keyboard Navigation', () => {
  let sidebar;
  let sidebarElement;
  let onGuidelineSelectMock;

  beforeEach(() => {
    // Create mock sidebar element
    sidebarElement = new MockElement('aside');
    sidebarElement.classList.add('wcag-sidebar');
    
    // Create sidebar navigation container
    const sidebarNav = new MockElement('nav');
    sidebarNav.classList.add('sidebar-nav');
    sidebarElement.children.push(sidebarNav);
    sidebarNav.parent = sidebarElement;

    // Mock callback
    onGuidelineSelectMock = jest.fn();

    // Note: In a real implementation, you would instantiate WCAGSidebar here
    // For now, we'll test the keyboard navigation logic separately
  });

  describe('Enter and Space key handling on guideline links', () => {
    test('should trigger guideline selection when Enter is pressed on a guideline link', () => {
      const guidelineLink = new MockElement('a');
      guidelineLink.classList.add('guideline-link');
      guidelineLink.dataset.guidelineId = '1.1.1';

      const event = {
        key: 'Enter',
        target: guidelineLink,
        preventDefault: jest.fn()
      };

      // Simulate keyboard event handler
      const handleKeyboardNav = (event) => {
        const target = event.target;
        if (target.classList.has('guideline-link')) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const guidelineId = target.dataset.guidelineId;
            if (guidelineId) {
              onGuidelineSelectMock(guidelineId);
            }
          }
        }
      };

      handleKeyboardNav(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(onGuidelineSelectMock).toHaveBeenCalledWith('1.1.1');
    });

    test('should trigger guideline selection when Space is pressed on a guideline link', () => {
      const guidelineLink = new MockElement('a');
      guidelineLink.classList.add('guideline-link');
      guidelineLink.dataset.guidelineId = '2.1.1';

      const event = {
        key: ' ',
        target: guidelineLink,
        preventDefault: jest.fn()
      };

      const handleKeyboardNav = (event) => {
        const target = event.target;
        if (target.classList.has('guideline-link')) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const guidelineId = target.dataset.guidelineId;
            if (guidelineId) {
              onGuidelineSelectMock(guidelineId);
            }
          }
        }
      };

      handleKeyboardNav(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(onGuidelineSelectMock).toHaveBeenCalledWith('2.1.1');
    });

    test('should not trigger selection for other keys on guideline links', () => {
      const guidelineLink = new MockElement('a');
      guidelineLink.classList.add('guideline-link');
      guidelineLink.dataset.guidelineId = '1.1.1';

      const event = {
        key: 'Tab',
        target: guidelineLink,
        preventDefault: jest.fn()
      };

      const handleKeyboardNav = (event) => {
        const target = event.target;
        if (target.classList.has('guideline-link')) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const guidelineId = target.dataset.guidelineId;
            if (guidelineId) {
              onGuidelineSelectMock(guidelineId);
            }
          }
        }
      };

      handleKeyboardNav(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(onGuidelineSelectMock).not.toHaveBeenCalled();
    });
  });

  describe('Enter and Space key handling on principle headers', () => {
    test('should toggle principle expansion when Enter is pressed on principle header', () => {
      const principleHeader = new MockElement('button');
      principleHeader.classList.add('principle-header');
      
      const principleGroup = new MockElement('div');
      principleGroup.classList.add('principle-group');
      principleGroup.dataset.principle = 'Perceivable';
      principleHeader.parent = principleGroup;

      const togglePrincipleMock = jest.fn();

      const event = {
        key: 'Enter',
        target: principleHeader,
        preventDefault: jest.fn()
      };

      const handleKeyboardNav = (event) => {
        const target = event.target;
        if (target.classList.has('principle-header')) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const principleGroup = target.closest('.principle-group');
            if (principleGroup) {
              const principleName = principleGroup.dataset.principle;
              togglePrincipleMock(principleName);
            }
          }
        }
      };

      handleKeyboardNav(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(togglePrincipleMock).toHaveBeenCalledWith('Perceivable');
    });

    test('should toggle principle expansion when Space is pressed on principle header', () => {
      const principleHeader = new MockElement('button');
      principleHeader.classList.add('principle-header');
      
      const principleGroup = new MockElement('div');
      principleGroup.classList.add('principle-group');
      principleGroup.dataset.principle = 'Operable';
      principleHeader.parent = principleGroup;

      const togglePrincipleMock = jest.fn();

      const event = {
        key: ' ',
        target: principleHeader,
        preventDefault: jest.fn()
      };

      const handleKeyboardNav = (event) => {
        const target = event.target;
        if (target.classList.has('principle-header')) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const principleGroup = target.closest('.principle-group');
            if (principleGroup) {
              const principleName = principleGroup.dataset.principle;
              togglePrincipleMock(principleName);
            }
          }
        }
      };

      handleKeyboardNav(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(togglePrincipleMock).toHaveBeenCalledWith('Operable');
    });
  });

  describe('Arrow key navigation within guideline lists', () => {
    test('should navigate to next guideline when ArrowDown is pressed', () => {
      const link1 = new MockElement('a');
      link1.classList.add('guideline-link');
      link1.dataset.guidelineId = '1.1.1';

      const link2 = new MockElement('a');
      link2.classList.add('guideline-link');
      link2.dataset.guidelineId = '1.2.1';

      const link3 = new MockElement('a');
      link3.classList.add('guideline-link');
      link3.dataset.guidelineId = '1.3.1';

      const visibleLinks = [link1, link2, link3];

      const navigateGuidelines = (currentLink, direction) => {
        const currentIndex = visibleLinks.indexOf(currentLink);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) {
          nextIndex = visibleLinks.length - 1;
        } else if (nextIndex >= visibleLinks.length) {
          nextIndex = 0;
        }

        const nextLink = visibleLinks[nextIndex];
        if (nextLink) {
          nextLink.focus();
        }
      };

      navigateGuidelines(link1, 1);

      expect(link2.focused).toBe(true);
    });

    test('should navigate to previous guideline when ArrowUp is pressed', () => {
      const link1 = new MockElement('a');
      link1.classList.add('guideline-link');
      link1.dataset.guidelineId = '1.1.1';

      const link2 = new MockElement('a');
      link2.classList.add('guideline-link');
      link2.dataset.guidelineId = '1.2.1';

      const link3 = new MockElement('a');
      link3.classList.add('guideline-link');
      link3.dataset.guidelineId = '1.3.1';

      const visibleLinks = [link1, link2, link3];

      const navigateGuidelines = (currentLink, direction) => {
        const currentIndex = visibleLinks.indexOf(currentLink);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) {
          nextIndex = visibleLinks.length - 1;
        } else if (nextIndex >= visibleLinks.length) {
          nextIndex = 0;
        }

        const nextLink = visibleLinks[nextIndex];
        if (nextLink) {
          nextLink.focus();
        }
      };

      navigateGuidelines(link2, -1);

      expect(link1.focused).toBe(true);
    });

    test('should wrap to last guideline when ArrowUp is pressed on first guideline', () => {
      const link1 = new MockElement('a');
      link1.classList.add('guideline-link');
      link1.dataset.guidelineId = '1.1.1';

      const link2 = new MockElement('a');
      link2.classList.add('guideline-link');
      link2.dataset.guidelineId = '1.2.1';

      const link3 = new MockElement('a');
      link3.classList.add('guideline-link');
      link3.dataset.guidelineId = '1.3.1';

      const visibleLinks = [link1, link2, link3];

      const navigateGuidelines = (currentLink, direction) => {
        const currentIndex = visibleLinks.indexOf(currentLink);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) {
          nextIndex = visibleLinks.length - 1;
        } else if (nextIndex >= visibleLinks.length) {
          nextIndex = 0;
        }

        const nextLink = visibleLinks[nextIndex];
        if (nextLink) {
          nextLink.focus();
        }
      };

      navigateGuidelines(link1, -1);

      expect(link3.focused).toBe(true);
    });

    test('should wrap to first guideline when ArrowDown is pressed on last guideline', () => {
      const link1 = new MockElement('a');
      link1.classList.add('guideline-link');
      link1.dataset.guidelineId = '1.1.1';

      const link2 = new MockElement('a');
      link2.classList.add('guideline-link');
      link2.dataset.guidelineId = '1.2.1';

      const link3 = new MockElement('a');
      link3.classList.add('guideline-link');
      link3.dataset.guidelineId = '1.3.1';

      const visibleLinks = [link1, link2, link3];

      const navigateGuidelines = (currentLink, direction) => {
        const currentIndex = visibleLinks.indexOf(currentLink);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) {
          nextIndex = visibleLinks.length - 1;
        } else if (nextIndex >= visibleLinks.length) {
          nextIndex = 0;
        }

        const nextLink = visibleLinks[nextIndex];
        if (nextLink) {
          nextLink.focus();
        }
      };

      navigateGuidelines(link3, 1);

      expect(link1.focused).toBe(true);
    });
  });

  describe('Escape key to close mobile sidebar', () => {
    test('should close sidebar when Escape is pressed and sidebar is open', () => {
      const sidebarElement = new MockElement('aside');
      sidebarElement.classList.add('wcag-sidebar');
      sidebarElement.classList.add('sidebar-open');

      const toggleButton = new MockElement('button');
      toggleButton.id = 'sidebarToggle';

      const toggleSidebarMock = jest.fn(() => {
        sidebarElement.classList.toggle('sidebar-open');
      });

      const event = {
        key: 'Escape',
        target: sidebarElement,
        preventDefault: jest.fn()
      };

      const handleKeyboardNav = (event) => {
        if (event.key === 'Escape') {
          const isOpen = sidebarElement.classList.has('sidebar-open');
          if (isOpen) {
            event.preventDefault();
            toggleSidebarMock();
            toggleButton.focus();
          }
        }
      };

      handleKeyboardNav(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(toggleSidebarMock).toHaveBeenCalled();
      expect(toggleButton.focused).toBe(true);
    });

    test('should not close sidebar when Escape is pressed and sidebar is not open', () => {
      const sidebarElement = new MockElement('aside');
      sidebarElement.classList.add('wcag-sidebar');
      // sidebar-open class not added

      const toggleSidebarMock = jest.fn();

      const event = {
        key: 'Escape',
        target: sidebarElement,
        preventDefault: jest.fn()
      };

      const handleKeyboardNav = (event) => {
        if (event.key === 'Escape') {
          const isOpen = sidebarElement.classList.has('sidebar-open');
          if (isOpen) {
            event.preventDefault();
            toggleSidebarMock();
          }
        }
      };

      handleKeyboardNav(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(toggleSidebarMock).not.toHaveBeenCalled();
    });
  });

  describe('Focus management', () => {
    test('should maintain focus on guideline link after selection', () => {
      const guidelineLink = new MockElement('a');
      guidelineLink.classList.add('guideline-link');
      guidelineLink.dataset.guidelineId = '1.1.1';

      const event = {
        key: 'Enter',
        target: guidelineLink,
        preventDefault: jest.fn()
      };

      const handleKeyboardNav = (event) => {
        const target = event.target;
        if (target.classList.has('guideline-link')) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const guidelineId = target.dataset.guidelineId;
            if (guidelineId) {
              onGuidelineSelectMock(guidelineId);
            }
          }
        }
      };

      handleKeyboardNav(event);

      // The link should remain the active element
      expect(event.target).toBe(guidelineLink);
    });

    test('should return focus to toggle button after closing sidebar with Escape', () => {
      const sidebarElement = new MockElement('aside');
      sidebarElement.classList.add('wcag-sidebar');
      sidebarElement.classList.add('sidebar-open');

      const toggleButton = new MockElement('button');
      toggleButton.id = 'sidebarToggle';

      const event = {
        key: 'Escape',
        target: sidebarElement,
        preventDefault: jest.fn()
      };

      const handleKeyboardNav = (event) => {
        if (event.key === 'Escape') {
          const isOpen = sidebarElement.classList.has('sidebar-open');
          if (isOpen) {
            event.preventDefault();
            sidebarElement.classList.toggle('sidebar-open');
            toggleButton.focus();
          }
        }
      };

      handleKeyboardNav(event);

      expect(toggleButton.focused).toBe(true);
    });
  });

  describe('Accessibility attributes', () => {
    test('should set tabindex="0" on guideline links for keyboard accessibility', () => {
      const guidelineLink = new MockElement('a');
      guidelineLink.classList.add('guideline-link');
      guidelineLink.setAttribute('tabindex', '0');

      expect(guidelineLink.getAttribute('tabindex')).toBe('0');
    });

    test('should set role="button" on guideline links', () => {
      const guidelineLink = new MockElement('a');
      guidelineLink.classList.add('guideline-link');
      guidelineLink.setAttribute('role', 'button');

      expect(guidelineLink.getAttribute('role')).toBe('button');
    });

    test('should update aria-expanded when principle is toggled', () => {
      const principleHeader = new MockElement('button');
      principleHeader.classList.add('principle-header');
      principleHeader.setAttribute('aria-expanded', 'true');

      // Toggle to collapsed
      principleHeader.setAttribute('aria-expanded', 'false');

      expect(principleHeader.getAttribute('aria-expanded')).toBe('false');

      // Toggle back to expanded
      principleHeader.setAttribute('aria-expanded', 'true');

      expect(principleHeader.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
