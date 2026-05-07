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
    <link rel="stylesheet" href="wcag-modal-redesign.css">
    <link rel="stylesheet" href="wcag-sidebar-layout.css">
    <link rel="stylesheet" href="wcag-landing-redesign.css">
</head>

<body class="wcag-page">
    <!-- Skip to Content Link for Accessibility -->
    <a href="#main-content" class="skip-to-content">Skip to main content</a>

    <header>
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php"><img src="logo.png" alt="Logo" width="60" height="60"
                        class="mx-3 me-3">Web Accessibility Evaluator</a>
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

    <div id="main-content" class="wcag-layout-container" tabindex="-1">
        <!-- WCAG Sidebar Navigation -->
        <aside class="wcag-sidebar" id="wcagSidebar" role="navigation" aria-label="WCAG Guidelines Navigation">
            <!-- Sidebar Header with Toggle -->
            <div class="sidebar-header">
                <h2 class="sidebar-title">Guidelines</h2>
                <button class="sidebar-toggle-btn" id="sidebarCollapseBtn" aria-label="Toggle sidebar width">
                    <i class="bi bi-list"></i>
                </button>
            </div>
            
            <!-- Sidebar Content -->
            <nav class="sidebar-nav" id="sidebarNav">
                <!-- Principle groups and guideline lists will be populated by JavaScript -->
            </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="wcag-main-content" id="wcagMainContent" role="main">
            <!-- Landing Page (Default View) -->
            <div class="landing-page" id="landingPage">
                <!-- Hero Section -->
                <section class="hero-ultra" aria-labelledby="hero-heading">
                    <h1 id="hero-heading" tabindex="-1">WCAG 2.1 Guidelines</h1>
                    <p class="hero-lead">Web Content Accessibility Guidelines (WCAG) 2.1 defines how to make web content more accessible to people with disabilities.</p>
                    <p class="hero-note">These guidelines are organized around four principles: Perceivable, Operable, Understandable, and Robust.</p>
                </section>

                <!-- Conformance Levels Section -->
                <section class="levels-ultra" aria-labelledby="conformance-heading">
                    <h2 id="conformance-heading">Understanding Conformance Levels</h2>
                    <p class="levels-note">WCAG 2.1 defines three levels of conformance</p>
                    
                    <div class="levels-wrap">
                        <!-- Level A -->
                        <article class="level-item item-a">
                            <div class="item-header">
                                <span class="level-mark mark-a">LEVEL A</span>
                            </div>
                            <h3>Essential Foundation</h3>
                            <p>Basic requirements that must be satisfied. Essential for some users to be able to use web content.</p>
                            <ul>
                                <li><i class="bi bi-check-circle-fill"></i>Required for all websites</li>
                                <li><i class="bi bi-check-circle-fill"></i>Minimum legal compliance</li>
                                <li><i class="bi bi-check-circle-fill"></i>Critical barriers removed</li>
                            </ul>
                        </article>

                        <!-- Level AA (Recommended) -->
                        <article class="level-item item-aa is-recommended">
                            <div class="item-header">
                                <span class="level-mark mark-aa">LEVEL AA</span>
                                <span class="rec-label">RECOMMENDED</span>
                            </div>
                            <h3>Industry Standard</h3>
                            <p>Addresses major barriers for disabled users. Required for most accessibility regulations worldwide.</p>
                            <ul>
                                <li><i class="bi bi-check-circle-fill"></i>Target for most organizations</li>
                                <li><i class="bi bi-check-circle-fill"></i>Legal requirement</li>
                                <li><i class="bi bi-check-circle-fill"></i>Comprehensive accessibility</li>
                            </ul>
                        </article>

                        <!-- Level AAA -->
                        <article class="level-item item-aaa">
                            <div class="item-header">
                                <span class="level-mark mark-aaa">LEVEL AAA</span>
                            </div>
                            <h3>Excellence Level</h3>
                            <p>Enhanced accessibility features. The highest level of compliance for specialized applications.</p>
                            <ul>
                                <li><i class="bi bi-check-circle-fill"></i>Enhanced accessibility</li>
                                <li><i class="bi bi-check-circle-fill"></i>Specialized applications</li>
                                <li><i class="bi bi-check-circle-fill"></i>Maximum inclusivity</li>
                            </ul>
                        </article>
                    </div>
                </section>
            </div>

            <!-- Guideline Detail View (Initially Hidden) -->
            <div class="guideline-detail-view" id="guidelineDetailView" style="display: none;" aria-live="polite">
                <!-- Content will be populated dynamically by JavaScript -->
            </div>
        </main>
    </div>

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

    <!-- WCAG Sidebar Application -->
    <script src="wcag-sidebar-app.js"></script>
    <script>
        console.log('[WCAG Sidebar] Initializing sidebar application');
        
        // Remove focus from any focused element on page load to prevent focus rectangle
        window.addEventListener('load', function() {
            // Small delay to ensure all elements are loaded
            setTimeout(function() {
                if (document.activeElement && document.activeElement !== document.body) {
                    document.activeElement.blur();
                    document.body.focus();
                    document.body.blur();
                }
            }, 100);
        });
        
        // Also handle on DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            const mainContent = document.getElementById('main-content');
            const heroHeading = document.getElementById('hero-heading');
            
            // Remove focus from main content
            if (mainContent && document.activeElement === mainContent) {
                mainContent.blur();
            }
            
            // Remove focus from hero heading
            if (heroHeading && document.activeElement === heroHeading) {
                heroHeading.blur();
            }
            
            // Remove focus from any other focused element
            if (document.activeElement && document.activeElement !== document.body) {
                document.activeElement.blur();
            }
        });
        
        // Initialize the WCAG Sidebar Application using WCAGApp controller
        document.addEventListener('DOMContentLoaded', async function() {
            try {
                console.log('[WCAG Sidebar] DOM loaded, starting initialization');
                
                // Create and initialize the WCAGApp controller
                const app = new WCAGApp({
                    apiEndpoint: 'api/get-wcag-guidelines.php',
                    sidebarElementId: 'wcagSidebar',
                    mainContentElementId: 'wcagMainContent',
                    sidebarToggleId: 'sidebarToggle'
                });
                
                // Initialize the application
                await app.init();
                
                console.log('[WCAG Sidebar] Application initialized successfully');
                
            } catch (error) {
                console.error('[WCAG Sidebar] Initialization error:', error);
            }
        });
    </script>
</body>

</html>
