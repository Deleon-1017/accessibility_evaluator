/**
 * Code Editor Utilities - Line Issue Highlighting
 * Provides functions to add, remove, and manage line markers for accessibility issues
 */

// Global variable to track line markers
const lineMarkers = {};

/**
 * Initialize the code editor with issue highlighting capabilities
 * @param {CodeMirror} editor - The CodeMirror editor instance
 */
function initializeEditorIssueTracking(editor) {
    window.editorMarkers = {};
    window.editorIssueMarkers = {};
}

/**
 * Add an issue marker to a specific line
 * @param {CodeMirror} editor - The CodeMirror editor instance
 * @param {number} lineNumber - The line number (0-indexed)
 * @param {string} severity - 'error', 'warning', or 'info'
 * @param {string} message - The issue message
 */
function addLineIssue(editor, lineNumber, severity = 'error', message = '') {
    // Validate inputs
    if (!editor || typeof editor.addLineClass !== 'function') {
        console.error('Invalid editor instance provided to addLineIssue');
        return;
    }
    
    if (typeof lineNumber !== 'number' || lineNumber < 0) {
        console.error('Invalid line number provided to addLineIssue:', lineNumber);
        return;
    }
    
    if (!['error', 'warning', 'info'].includes(severity)) {
        console.error('Invalid severity provided to addLineIssue:', severity);
        return;
    }
    
    if (!window.editorMarkers) {
        window.editorMarkers = {};
    }
    
    // Create marker element
    const markerElement = document.createElement('div');
    markerElement.className = `line-issue-marker line-${severity}`;
    markerElement.title = message;
    markerElement.innerHTML = `
        <span class="issue-icon">
            ${severity === 'error' ? '●' : severity === 'warning' ? '⚠' : 'ⓘ'}
        </span>
        <span class="issue-message">${message}</span>
    `;
    
    // Store marker reference
    if (!window.editorMarkers[lineNumber]) {
        window.editorMarkers[lineNumber] = [];
    }
    
    // Add line class for background highlighting
    editor.addLineClass(lineNumber, 'background', `CodeMirror-line-${severity}`);
    editor.addLineClass(lineNumber, 'wrap', `CodeMirror-line-${severity}`);
    
    // Add line number class
    editor.addLineClass(lineNumber, 'gutter', `line-${severity}`);
    
    // Set line marker widget
    const lineHandle = editor.getLineHandle(lineNumber);
    const marker = editor.setGutterMarker(lineHandle, 'CodeMirror-linenumbers', createMarkerElement(severity, message));
    
    window.editorMarkers[lineNumber].push({
        marker: marker,
        severity: severity,
        message: message
    });
}

/**
 * Create a marker element for the gutter
 * @param {string} severity - 'error', 'warning', or 'info'
 * @param {string} message - The issue message
 * @returns {HTMLElement} The marker element
 */
function createMarkerElement(severity, message) {
    const element = document.createElement('div');
    element.className = `gutter-marker marker-${severity}`;
    element.title = message;
    
    const icon = severity === 'error' ? '●' : severity === 'warning' ? '⚠' : 'ⓘ';
    element.innerHTML = `<span class="marker-icon">${icon}</span>`;
    
    return element;
}

/**
 * Clear all issue markers from a line
 * @param {CodeMirror} editor - The CodeMirror editor instance
 * @param {number} lineNumber - The line number (0-indexed)
 */
function clearLineIssues(editor, lineNumber) {
    if (!window.editorMarkers || !window.editorMarkers[lineNumber]) {
        return;
    }
    
    // Remove line classes
    editor.removeLineClass(lineNumber, 'background', 'CodeMirror-line-error');
    editor.removeLineClass(lineNumber, 'background', 'CodeMirror-line-warning');
    editor.removeLineClass(lineNumber, 'background', 'CodeMirror-line-info');
    editor.removeLineClass(lineNumber, 'wrap', 'CodeMirror-line-error');
    editor.removeLineClass(lineNumber, 'wrap', 'CodeMirror-line-warning');
    editor.removeLineClass(lineNumber, 'wrap', 'CodeMirror-line-info');
    
    // Remove gutter marker
    const lineHandle = editor.getLineHandle(lineNumber);
    editor.clearGutterMarker(lineHandle, 'CodeMirror-linenumbers');
    
    delete window.editorMarkers[lineNumber];
}

/**
 * Clear all issue markers from the editor
 * @param {CodeMirror} editor - The CodeMirror editor instance
 */
function clearAllIssues(editor) {
    if (!window.editorMarkers) return;
    
    Object.keys(window.editorMarkers).forEach(lineNumber => {
        clearLineIssues(editor, parseInt(lineNumber));
    });
    
    window.editorMarkers = {};
}

/**
 * Highlight issues based on scan results
 * @param {CodeMirror} editor - The CodeMirror editor instance
 * @param {Array} issues - Array of issue objects with {line, severity, message}
 */
function highlightIssues(editor, issues) {
    // Validate inputs
    if (!editor || typeof editor.addLineClass !== 'function') {
        console.error('Invalid editor instance provided to highlightIssues');
        return;
    }
    
    if (!Array.isArray(issues)) {
        console.error('Invalid issues array provided to highlightIssues');
        return;
    }
    
    clearAllIssues(editor);
    
    issues.forEach(issue => {
        if (issue.line !== undefined && issue.severity && issue.message) {
            const lineNumber = issue.line - 1; // Convert to 0-indexed
            if (lineNumber >= 0 && lineNumber < editor.lineCount()) {
                addLineIssue(editor, lineNumber, issue.severity, issue.message);
            }
        }
    });
}

/**
 * Scroll editor to a specific line and highlight it
 * @param {CodeMirror} editor - The CodeMirror editor instance
 * @param {number} lineNumber - The line number (1-indexed)
 */
function scrollToLine(editor, lineNumber) {
    const zeroIndexedLine = lineNumber - 1;
    const coords = editor.charCoords({ line: zeroIndexedLine, ch: 0 }, 'local');
    editor.scrollIntoView({ line: zeroIndexedLine, ch: 0 }, 100);
    editor.setCursor(zeroIndexedLine, 0);
}

/**
 * Get all issues for a specific line
 * @param {number} lineNumber - The line number (0-indexed)
 * @returns {Array} Array of issue objects for that line
 */
function getLineIssues(lineNumber) {
    return window.editorMarkers && window.editorMarkers[lineNumber] ? window.editorMarkers[lineNumber] : [];
}

/**
 * Get all issues in the editor
 * @returns {Array} Array of all issue objects
 */
function getAllIssues() {
    if (!window.editorMarkers) return [];
    
    const allIssues = [];
    Object.entries(window.editorMarkers).forEach(([lineNumber, issues]) => {
        allIssues.push({
            line: parseInt(lineNumber) + 1, // Convert to 1-indexed
            issues: issues
        });
    });
    
    return allIssues;
}

/**
 * Count issues by severity
 * @returns {Object} Object with counts: {errors, warnings, infos}
 */
function countIssuesBySeverity() {
    let errors = 0, warnings = 0, infos = 0;
    
    if (window.editorMarkers) {
        Object.values(window.editorMarkers).forEach(lineIssues => {
            lineIssues.forEach(issue => {
                if (issue.severity === 'error') errors++;
                else if (issue.severity === 'warning') warnings++;
                else if (issue.severity === 'info') infos++;
            });
        });
    }
    
    return { errors, warnings, infos };
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeEditorIssueTracking,
        addLineIssue,
        createMarkerElement,
        clearLineIssues,
        clearAllIssues,
        highlightIssues,
        scrollToLine,
        getLineIssues,
        getAllIssues,
        countIssuesBySeverity
    };
}
