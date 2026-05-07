/**
 * ============================================================================
 * DEPRECATED: This file is no longer used by wcag.php
 * ============================================================================
 * 
 * This file has been replaced by wcag-sidebar-app.js which implements the new
 * sidebar-based layout for the WCAG Guidelines page.
 * 
 * The old table rendering and filtering code below has been commented out.
 * Modal rendering functionality has been migrated to wcag-sidebar-app.js.
 * 
 * This file is preserved for reference only.
 * 
 * Date deprecated: 2024
 * Replaced by: wcag-sidebar-app.js
 * ============================================================================
 */

/*
// ============================================================================
// OLD TABLE RENDERING CODE (DEPRECATED - NO LONGER IN USE)
// ============================================================================

// WCAG Table Rendering and Filtering Script
console.log('[WCAG-SCRIPT] File loaded - top of file');

document.addEventListener('DOMContentLoaded', function() {
    console.log('[WCAG-SCRIPT] DOM Content Loaded');
    
    const tableBody = document.getElementById('wcagTableBody');
    const levelFilter = document.getElementById('levelFilter');
    const principleFilter = document.getElementById('principleFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const resultCount = document.getElementById('resultCount');
    
    console.log('[WCAG-SCRIPT] Bootstrap check:', typeof bootstrap);
    
    if (typeof bootstrap === 'undefined') {
        console.error('[WCAG-SCRIPT] Bootstrap is not loaded!');
        return;
    }
    
    const guidelineModal = new bootstrap.Modal(document.getElementById('guidelineModal'));
    const guidelineModalBody = document.getElementById('guidelineModalBody');
    const guidelineModalLabel = document.getElementById('guidelineModalLabel');

    console.log('[WCAG-SCRIPT] Elements found:', {
        tableBody: !!tableBody,
        levelFilter: !!levelFilter,
        principleFilter: !!principleFilter,
        resetFiltersBtn: !!resetFiltersBtn,
        resultCount: !!resultCount
    });

    // Event listeners for filters
    levelFilter.addEventListener('change', renderTable);
    principleFilter.addEventListener('change', renderTable);
    resetFiltersBtn.addEventListener('click', resetFilters);

    // Wait for data to be loaded before rendering
    console.log('[WCAG-SCRIPT] Adding wcagDataLoaded event listener');
    window.addEventListener('wcagDataLoaded', function() {
        console.log('[WCAG-SCRIPT] wcagDataLoaded event received');
        console.log('[WCAG-SCRIPT] wcagGuidelines length:', wcagGuidelines.length);
        renderTable();
    });

    function renderTable() {
        console.log('[WCAG-SCRIPT] renderTable called');
        console.log('[WCAG-SCRIPT] wcagGuidelines:', wcagGuidelines);
        
        const selectedLevel = levelFilter.value;
        const selectedPrinciple = principleFilter.value;

        console.log('[WCAG-SCRIPT] Filters:', { selectedLevel, selectedPrinciple });

        // Filter guidelines
        const filteredGuidelines = wcagGuidelines.filter(guideline => {
            const levelMatch = selectedLevel === 'all' || guideline.level === selectedLevel;
            const principleMatch = selectedPrinciple === 'all' || guideline.principle === selectedPrinciple;
            return levelMatch && principleMatch;
        });

        console.log('[WCAG-SCRIPT] Filtered guidelines:', filteredGuidelines.length);

        // Update result count with animation
        const currentCount = parseInt(resultCount.textContent) || 0;
        const targetCount = filteredGuidelines.length;
        animateCount(currentCount, targetCount, 500);

        // Clear table with fade out
        tableBody.style.opacity = '0';
        
        setTimeout(() => {
            tableBody.innerHTML = '';

            // Populate table
            filteredGuidelines.forEach((guideline, index) => {
                const row = document.createElement('tr');
                row.style.cursor = 'pointer';
                row.style.opacity = '0';
                row.style.transform = 'translateY(20px)';
                row.setAttribute('data-guideline-id', guideline.id);
                row.setAttribute('role', 'button');
                row.setAttribute('tabindex', '0');
                row.setAttribute('aria-label', `View details for ${guideline.id} ${guideline.title}`);
                
                // Add click and keyboard event to open modal
                row.addEventListener('click', function() {
                    showGuidelineDetails(guideline);
                });
                
                row.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        showGuidelineDetails(guideline);
                    }
                });

                // Principle cell
                const principleCell = document.createElement('td');
                const principleBadge = document.createElement('span');
                principleBadge.className = `badge principle-badge principle-${guideline.principle.toLowerCase()}`;
                principleBadge.textContent = guideline.principle;
                principleCell.appendChild(principleBadge);
                row.appendChild(principleCell);

                // Level cell
                const levelCell = document.createElement('td');
                const levelBadge = document.createElement('span');
                levelBadge.className = `level-badge level-${guideline.level}`;
                levelBadge.textContent = `Level ${guideline.level}`;
                levelCell.appendChild(levelBadge);
                row.appendChild(levelCell);

                // Success Criteria cell
                const criteriaCell = document.createElement('td');
                criteriaCell.innerHTML = `<strong>${guideline.id}</strong> ${guideline.title}`;
                row.appendChild(criteriaCell);

                // Description cell
                const descCell = document.createElement('td');
                descCell.textContent = guideline.description;
                row.appendChild(descCell);

                // Techniques cell
                const techCell = document.createElement('td');
                if (guideline.techniques && guideline.techniques.length > 0) {
                    guideline.techniques.forEach((tech, index) => {
                        const techBadge = document.createElement('span');
                        techBadge.className = 'badge bg-secondary me-1 mb-1';
                        techBadge.textContent = tech;
                        techCell.appendChild(techBadge);
                    });
                }
                row.appendChild(techCell);

                tableBody.appendChild(row);
                
                // Animate row in
                setTimeout(() => {
                    row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    row.style.opacity = '1';
                    row.style.transform = 'translateY(0)';
                }, index * 30);
            });
            
            tableBody.style.transition = 'opacity 0.3s ease';
            tableBody.style.opacity = '1';
        }, 200);
    }

    function animateCount(start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            resultCount.textContent = Math.round(current);
        }, 16);
    }

    // ============================================================================
    // MODAL RENDERING FUNCTIONS (MIGRATED TO wcag-sidebar-app.js)
    // ============================================================================

    function showGuidelineDetails(guideline) {
        // Set modal title with criteria name
        guidelineModalLabel.textContent = `WCAG ${guideline.id}: ${guideline.title}`;

        // Build modal content with redesigned structure
        let modalContent = `
            <div class="guideline-details">
                <!-- Description -->
                <div class="wcag-modal-description">
                    <p>${guideline.description}</p>
                </div>

                ${renderRedesignedExamples(guideline)}

                ${guideline.techniques && guideline.techniques.length > 0 ? renderTechniques(guideline.techniques) : ''}

                ${guideline.examples && guideline.examples.userGroups ? renderWhoBenefits(guideline.examples.userGroups) : ''}
            </div>
        `;

        guidelineModalBody.innerHTML = modalContent;
        
        // Add copy button functionality
        attachCopyButtonListeners();
        
        // Add smooth scroll to top of modal
        guidelineModalBody.scrollTop = 0;
        
        guidelineModal.show();
        
        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        announcement.textContent = `Opened details for ${guideline.id} ${guideline.title}`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    function renderRedesignedExamples(guideline) {
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
                    <div class="wcag-modal-code-header">
                        <span class="wcag-modal-code-label">Before: Code</span>
                    </div>
                    <div class="wcag-modal-code-content">
                        ${formatCodeWithLineNumbers(before.html)}
                    </div>
                </div>
                ` : ''}

                ${after && after.html ? `
                <div class="wcag-modal-code-box">
                    <div class="wcag-modal-code-header">
                        <span class="wcag-modal-code-label">After: Code</span>
                        <button class="wcag-modal-copy-btn" data-copy-target="after-code" aria-label="Copy code">
                            <span>📋</span>
                            <span class="copy-text">Copy</span>
                        </button>
                    </div>
                    <div class="wcag-modal-code-content" id="after-code">
                        ${formatCodeWithLineNumbers(after.html)}
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Output Comparison (if available) -->
            ${renderOutputComparison(before, after)}

            <!-- Impact Comparison -->
            <div class="wcag-modal-impact-box full-width">
                <div class="wcag-modal-impact-header">
                    <span class="wcag-modal-impact-label">User Experience Impact</span>
                </div>
                <div class="wcag-modal-impact-content-combined">
                    ${before && before.context ? `
                    <div class="impact-column before">
                        <div class="impact-sub-label">Before</div>
                        <p class="wcag-modal-impact-text">${highlightInaccessible(before.context)}</p>
                    </div>
                    ` : ''}
                    
                    ${before && before.context && after && after.context ? '<div class="impact-vertical-divider"></div>' : ''}

                    ${after && after.context ? `
                    <div class="impact-column after">
                        <div class="impact-sub-label">After</div>
                        <p class="wcag-modal-impact-text">${highlightAccessible(after.context)}</p>
                    </div>
                    ` : ''}
                </div>
            </div>

            ${renderKeySummary(guideline)}
        `;
    }

    function formatCodeWithLineNumbers(code) {
        const lines = code.trim().split('\n');
        return lines.map((line, index) => `
            <div class="wcag-modal-code-line">
                <span class="wcag-modal-line-number">${index + 1}</span>
                <span class="wcag-modal-line-code">${escapeHtml(line)}</span>
            </div>
        `).join('');
    }

    function renderOutputComparison(before, after) {
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
                            ${renderVisualPreview(before.html, before.css, before.js, 'before')}
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
                            ${renderVisualPreview(after.html, after.css, after.js, 'after')}
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    function renderVisualPreview(html, css, js, type) {
        // Create a unique ID for this preview
        const previewId = `preview-${type}-${Date.now()}`;
        
        // Build the complete HTML document for the iframe
        const iframeContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

    function highlightInaccessible(text) {
        // Highlight key problematic terms in red
        return text.replace(/(image|filename|no meaningful information|inaccessible|cannot understand|lost)/gi, 
            '<span class="wcag-modal-impact-highlight">$1</span>');
    }

    function highlightAccessible(text) {
        // Highlight key positive terms in green
        return text.replace(/(descriptive|accessible|clear|meaningful|understand|provides context)/gi, 
            '<span class="wcag-modal-impact-highlight accessible">$1</span>');
    }

    function renderKeySummary(guideline) {
        if (!guideline.explanation && !guideline.examples.keySummary) {
            return '';
        }

        // Generate key summary points from explanation or use provided summary
        const summaryPoints = guideline.examples.keySummary || generateSummaryPoints(guideline);

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

    function generateSummaryPoints(guideline) {
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

    function renderTechniques(techniques) {
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

    function renderWhoBenefits(userGroups) {
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

    function attachCopyButtonListeners() {
        const copyButtons = document.querySelectorAll('.wcag-modal-copy-btn');
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

    function renderExamples(guideline) {
        if (!guideline.examples) return '';

        return `
            <div class="examples-section mb-4">
                <h3 class="h5 mb-4 d-flex align-items-center">
                    <i class="bi bi-code-square me-2 text-success"></i>
                    <span>Before & After Examples</span>
                </h3>
                
                ${guideline.examples.before ? `
                <div class="example-card">
                    <div class="example-header bg-danger text-white">
                        <i class="bi bi-x-circle-fill me-2"></i>
                        <span>Before (Inaccessible)</span>
                    </div>
                    <div class="example-body">
                        ${guideline.examples.before.context ? `
                        <div class="alert alert-danger border-danger mb-3">
                            <strong><i class="bi bi-exclamation-triangle-fill me-2"></i>Problem:</strong> ${guideline.examples.before.context}
                        </div>
                        ` : ''}
                        ${guideline.examples.before.html ? `
                        <div class="code-section">
                            <div class="code-header"><i class="bi bi-filetype-html me-2"></i>HTML</div>
                            <pre><code class="language-html">${escapeHtml(guideline.examples.before.html)}</code></pre>
                        </div>
                        ` : ''}
                        ${guideline.examples.before.css ? `
                        <div class="code-section">
                            <div class="code-header"><i class="bi bi-filetype-css me-2"></i>CSS</div>
                            <pre><code class="language-css">${escapeHtml(guideline.examples.before.css)}</code></pre>
                        </div>
                        ` : ''}
                        ${guideline.examples.before.js ? `
                        <div class="code-section">
                            <div class="code-header"><i class="bi bi-filetype-js me-2"></i>JavaScript</div>
                            <pre><code class="language-javascript">${escapeHtml(guideline.examples.before.js)}</code></pre>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                ${guideline.examples.after ? `
                <div class="example-card">
                    <div class="example-header bg-success text-white">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        <span>After (Accessible)</span>
                    </div>
                    <div class="example-body">
                        ${guideline.examples.after.context ? `
                        <div class="alert alert-success border-success mb-3">
                            <strong><i class="bi bi-check-circle-fill me-2"></i>Solution:</strong> ${guideline.examples.after.context}
                        </div>
                        ` : ''}
                        ${guideline.examples.after.html ? `
                        <div class="code-section">
                            <div class="code-header"><i class="bi bi-filetype-html me-2"></i>HTML</div>
                            <pre><code class="language-html">${escapeHtml(guideline.examples.after.html)}</code></pre>
                        </div>
                        ` : ''}
                        ${guideline.examples.after.css ? `
                        <div class="code-section">
                            <div class="code-header"><i class="bi bi-filetype-css me-2"></i>CSS</div>
                            <pre><code class="language-css">${escapeHtml(guideline.examples.after.css)}</code></pre>
                        </div>
                        ` : ''}
                        ${guideline.examples.after.js ? `
                        <div class="code-section">
                            <div class="code-header"><i class="bi bi-filetype-js me-2"></i>JavaScript</div>
                            <pre><code class="language-javascript">${escapeHtml(guideline.examples.after.js)}</code></pre>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                ${guideline.examples.userGroups && guideline.examples.userGroups.length > 0 ? `
                <div class="mt-4 p-3 bg-light rounded">
                    <h4 class="h6 mb-3 d-flex align-items-center">
                        <i class="bi bi-people-fill me-2 text-info"></i>
                        <span>Who Benefits from This</span>
                    </h4>
                    <div class="d-flex flex-wrap gap-2">
                        ${guideline.examples.userGroups.map(group => `<span class="badge bg-info text-dark">${group}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    function renderBasicExamples(guideline) {
        if (!guideline.before && !guideline.after) return '';

        return `
            <div class="examples-section">
                <h3 class="h6 mb-3"><i class="bi bi-code-square me-2"></i>Code Examples</h3>
                
                ${guideline.before ? `
                <div class="example-card mb-3">
                    <div class="example-header bg-danger text-white">
                        <i class="bi bi-x-circle me-2"></i>Before (Inaccessible)
                    </div>
                    <div class="example-body">
                        <pre><code class="language-html">${escapeHtml(guideline.before)}</code></pre>
                    </div>
                </div>
                ` : ''}

                ${guideline.after ? `
                <div class="example-card mb-3">
                    <div class="example-header bg-success text-white">
                        <i class="bi bi-check-circle me-2"></i>After (Accessible)
                    </div>
                    <div class="example-body">
                        <pre><code class="language-html">${escapeHtml(guideline.after)}</code></pre>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function resetFilters() {
        levelFilter.value = 'all';
        principleFilter.value = 'all';
        renderTable();
    }
});

// ============================================================================
// END OF DEPRECATED CODE
// ============================================================================
*/
