<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WCAG 2.1 Guidelines | Web Accessibility Evaluator</title>
    <link rel="icon" type="image/png" href="logo.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
        crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css?v=20260326poppins">
</head>

<body class="wcag-page">

    <!-- Skip to Content Link for Accessibility -->
    <a href="#main-content" class="skip-to-content">Skip to main content</a>

    <header>
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php"><img src="logo.png" alt="Logo" width="60" height="60"
                        class="mx-5 me-3">Web Accessibility Evaluator</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Web Accessibility Evaluator</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li class="nav-item">
                                <a class="nav-link mx-lg-3" href="index.php">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link mx-lg-3 active" aria-current="page" href="wcag.php">WCAG
                                    Guidelines</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link mx-lg-3" href="contact.html">Contact</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link mx-lg-3" href="about.html">About</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <main id="main-content" class="wcag-guidelines pt-5 mt-5">
        <div class="container-fluid px-4 px-lg-5">
            <!-- Hero Section -->
            <div class="wcag-hero">
                <div class="row align-items-center">
                    <div class="col-lg-8">
                        <h1>WCAG 2.1 Guidelines</h1>
                        <p class="lead">Web Content Accessibility Guidelines (WCAG) 2.1 defines how to make web content
                            more
                            accessible to people with disabilities.</p>
                        <p class="text-muted">These guidelines are organized around four principles: Perceivable,
                            Operable, Understandable, and Robust.</p>
                    </div>
                    <div class="col-lg-4">
                        <div class="filter-guidelines-card">
                            <h2>Filter Guidelines</h2>
                            <div class="mb-3">
                                <label for="levelFilter" class="form-label">Conformance Level</label>
                                <select id="levelFilter" class="form-select" aria-label="Filter by conformance level">
                                    <option value="all">All Levels</option>
                                    <option value="A">Level A</option>
                                    <option value="AA">Level AA</option>
                                    <option value="AAA">Level AAA</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="principleFilter" class="form-label">Principle</label>
                                <select id="principleFilter" class="form-select" aria-label="Filter by principle">
                                    <option value="all">All Principles</option>
                                    <option value="Perceivable">Perceivable</option>
                                    <option value="Operable">Operable</option>
                                    <option value="Understandable">Understandable</option>
                                    <option value="Robust">Robust</option>
                                </select>
                            </div>
                            <button id="resetFilters" class="btn btn-outline-primary w-100">
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Info Bar -->
            <div class="results-info-bar">
                <div class="results-info-content">
                    <div class="result-count">
                        <span class="count-number" id="resultCount">0</span>
                    </div>
                    <div class="result-text">
                        <p class="result-label">Guidelines Available</p>
                        <p class="result-hint">Select any guideline below to explore examples</p>
                    </div>
                </div>
            </div>

            <!-- Loading Indicator -->
            <div id="loadingIndicator" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading guidelines...</span>
                </div>
                <p class="mt-3 text-muted">Loading WCAG guidelines from database...</p>
            </div>

            <!-- Error Message -->
            <div id="errorMessage" class="alert alert-danger d-none" role="alert">
                <h4 class="alert-heading">Error Loading Guidelines</h4>
                <p id="errorText"></p>
            </div>

            <!-- Guidelines Table -->
            <div class="guidelines-table-wrapper" id="guidelinesTableWrapper" style="display: none;">
                <table class="wcag-guidelines-table" id="wcagTable">
                    <thead>
                        <tr>
                            <th scope="col">Principle</th>
                            <th scope="col">Level</th>
                            <th scope="col">Success Criteria</th>
                            <th scope="col">Description</th>
                            <th scope="col">Techniques</th>
                        </tr>
                    </thead>
                    <tbody id="wcagTableBody">
                        <!-- Table rows will be populated by JavaScript -->
                    </tbody>
                </table>
            </div>

            <!-- Conformance Levels Section -->
            <div class="conformance-levels-section">
                <div class="text-center mb-5">
                    <h2>Understanding Conformance Levels</h2>
                    <p>WCAG 2.1 defines three levels of conformance</p>
                </div>
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="conformance-card level-a-card">
                            <div class="conformance-header">
                                <div>
                                    <span class="level-badge level-A">Level A</span>
                                </div>
                            </div>
                            <div class="conformance-body">
                                <h3>Essential Foundation</h3>
                                <p>Basic requirements that must be satisfied. Essential for some users to be able to use
                                    web content.</p>
                                <ul class="conformance-features">
                                    <li><i class="bi bi-check-circle-fill text-primary me-2"></i>Required for all
                                        websites</li>
                                    <li><i class="bi bi-check-circle-fill text-primary me-2"></i>Minimum legal
                                        compliance</li>
                                    <li><i class="bi bi-check-circle-fill text-primary me-2"></i>Critical barriers
                                        removed</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="conformance-card level-aa-card featured">
                            <div class="recommended-badge">Recommended</div>
                            <div class="conformance-header">
                                <div>
                                    <span class="level-badge level-AA">Level AA</span>
                                </div>
                            </div>
                            <div class="conformance-body">
                                <h3>Industry Standard</h3>
                                <p>Addresses major barriers for disabled users. Required for most accessibility
                                    regulations worldwide.</p>
                                <ul class="conformance-features">
                                    <li><i class="bi bi-check-circle-fill text-success me-2"></i>Target for most
                                        organizations</li>
                                    <li><i class="bi bi-check-circle-fill text-success me-2"></i>Legal requirement</li>
                                    <li><i class="bi bi-check-circle-fill text-success me-2"></i>Comprehensive
                                        accessibility</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="conformance-card level-aaa-card">
                            <div class="conformance-header">
                                <div>
                                    <span class="level-badge level-AAA">Level AAA</span>
                                </div>
                            </div>
                            <div class="conformance-body">
                                <h3>Excellence Level</h3>
                                <p>Enhanced accessibility features. The highest level of compliance for specialized
                                    applications.</p>
                                <ul class="conformance-features">
                                    <li><i class="bi bi-check-circle-fill text-warning me-2"></i>Enhanced accessibility
                                    </li>
                                    <li><i class="bi bi-check-circle-fill text-warning me-2"></i>Specialized
                                        applications</li>
                                    <li><i class="bi bi-check-circle-fill text-warning me-2"></i>Maximum inclusivity
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="bg-white shadow-mt-auto">
        <div class="container py-5">
            <div class="row">
                <div class="col-md-4 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">About</h6>
                    <p class="small text-muted">Web Accessibility Evaluator helps you check your website's compliance with WCAG 2.1 guidelines. Get actionable insights to improve accessibility for all users.</p>
                </div>
                <div class="col-md-3 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">WCAG 2.1 Guidelines</h6>
                    <ul class="list-unstyled small">
                        <li><a href="wcag.php?level=A" class="text-decoration-none text-muted d-block mb-2">Level A</a>
                        </li>
                        <li><a href="wcag.php?level=AA" class="text-decoration-none text-muted d-block mb-2">Level
                                AA</a></li>
                        <li><a href="wcag.php?level=AAA" class="text-decoration-none text-muted d-block mb-2">Level
                                AAA</a></li>
                    </ul>
                </div>
                <div class="col-md-3 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">WCAG 2.1 Principles</h6>
                    <ul class="list-unstyled small">
                        <li><a href="wcag.php?principle=Perceivable"
                                class="text-decoration-none text-muted d-block mb-2">Perceivable</a></li>
                        <li><a href="wcag.php?principle=Operable"
                                class="text-decoration-none text-muted d-block mb-2">Operable</a></li>
                        <li><a href="wcag.php?principle=Understandable"
                                class="text-decoration-none text-muted d-block mb-2">Understandable</a></li>
                        <li><a href="wcag.php?principle=Robust"
                                class="text-decoration-none text-muted d-block mb-2">Robust</a></li>
                    </ul>
                </div>
                <div class="col-md-2 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">Product</h6>
                    <ul class="list-unstyled small">
                        <li><a href="index.php" class="text-decoration-none text-muted d-block mb-2">Scanner</a></li>
                        <li><a href="wcag.php" class="text-decoration-none text-muted d-block mb-2">Guidelines</a></li>
                    </ul>
                </div>
                <hr class="border-secondary-subtle">
                <div class="text-center">
                    <p class="small text-muted">
                        This tool is for educational purposes.
                    </p>
                    <p class="small text-muted mb-1">
                        Copyright &copy; 2026 All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Modal for Guideline Details -->
    <div class="modal fade" id="guidelineModal" tabindex="-1" aria-labelledby="guidelineModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title h5 mb-0" id="guidelineModalLabel">WCAG Guideline Details</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="guidelineModalBody">
                    <!-- Content will be inserted by JavaScript -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- WCAG Script - Modified to fetch from database -->
    <script>
        console.log('[WCAG] Script loaded');
        
        // Global variable to store guidelines data
        let wcagGuidelines = [];
        
        // Fetch guidelines from database on page load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[WCAG] DOM Content Loaded, starting fetch');
            fetchWcagGuidelines();
        });
        
        async function fetchWcagGuidelines() {
            console.log('[WCAG] fetchWcagGuidelines called');
            
            const loadingIndicator = document.getElementById('loadingIndicator');
            const errorMessage = document.getElementById('errorMessage');
            const tableWrapper = document.getElementById('guidelinesTableWrapper');
            
            console.log('[WCAG] Elements found:', {
                loadingIndicator: !!loadingIndicator,
                errorMessage: !!errorMessage,
                tableWrapper: !!tableWrapper
            });
            
            try {
                // Get filter parameters from URL if present
                const urlParams = new URLSearchParams(window.location.search);
                const level = urlParams.get('level');
                const principle = urlParams.get('principle');
                
                // Build API URL with filters
                let apiUrl = 'api/get-wcag-guidelines.php';
                const params = [];
                if (level) params.push(`level=${encodeURIComponent(level)}`);
                if (principle) params.push(`principle=${encodeURIComponent(principle)}`);
                if (params.length > 0) {
                    apiUrl += '?' + params.join('&');
                }
                
                console.log('[WCAG] Fetching from:', apiUrl);
                const response = await fetch(apiUrl);
                console.log('[WCAG] Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                console.log('[WCAG] Result:', {
                    success: result.success,
                    count: result.count,
                    dataLength: result.data ? result.data.length : 0
                });
                
                if (!result.success) {
                    throw new Error(result.error || 'Failed to load guidelines');
                }
                
                wcagGuidelines = result.data;
                console.log('[WCAG] Guidelines stored:', wcagGuidelines.length);
                
                // Hide loading, show table
                loadingIndicator.style.display = 'none';
                tableWrapper.style.display = 'block';
                console.log('[WCAG] UI updated: loading hidden, table shown');
                
                // Set filter values from URL
                if (level) document.getElementById('levelFilter').value = level;
                if (principle) document.getElementById('principleFilter').value = principle;
                
                // Trigger custom event to notify that data is loaded
                console.log('[WCAG] Dispatching wcagDataLoaded event');
                const event = new CustomEvent('wcagDataLoaded');
                window.dispatchEvent(event);
                console.log('[WCAG] Event dispatched successfully');
                
                // Also try direct call as fallback
                setTimeout(() => {
                    console.log('[WCAG] Timeout fallback - checking if table was rendered');
                    const tbody = document.getElementById('wcagTableBody');
                    if (tbody && tbody.children.length === 0) {
                        console.warn('[WCAG] Table not rendered, trying direct approach');
                        // Dispatch again
                        window.dispatchEvent(new CustomEvent('wcagDataLoaded'));
                    }
                }, 1000);
                
            } catch (error) {
                console.error('[WCAG] Error fetching WCAG guidelines:', error);
                console.error('[WCAG] Error details:', error.stack);
                loadingIndicator.style.display = 'none';
                errorMessage.classList.remove('d-none');
                document.getElementById('errorText').textContent = error.message;
            }
        }
    </script>

    <!-- WCAG Table Script -->
    <script>
        console.log('[WCAG] About to load wcag-script.js');
        console.log('[WCAG] Bootstrap available:', typeof bootstrap !== 'undefined');
    </script>
    <script src="wcag-script.js?v=20260409debug"></script>
    <script>
        console.log('[WCAG] wcag-script.js should be loaded now');
    </script>
</body>

</html>
