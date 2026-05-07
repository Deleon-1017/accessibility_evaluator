<?php
// Start session to store form data
session_start();

// Include security helper
require_once __DIR__ . '/security-helper.php';

// Initialize secure session
initSecureSession();

// Generate CSRF token
$csrfToken = generateCsrfToken();

// Clear previous results
if (isset($_SESSION['scan_results'])) {
    unset($_SESSION['scan_results']);
}

// Display error if exists
$error = '';
if (isset($_SESSION['scan_error'])) {
    $error = $_SESSION['scan_error'];
    unset($_SESSION['scan_error']);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Accessibility Evaluator</title>
    <link rel="icon" type="image/png" href="logo.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+q2scQbITxI" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- CodeMirror CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/default.min.css">
    <link rel="stylesheet" href="style.css?v=<?php echo filemtime('style.css'); ?>">
</head>
<body>
    <header>
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php"><img src="logo.png" alt="Logo" width="60" height="60" class="mx-3 me-3">Web Accessibility Evaluator</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Web Accessibility Evaluator</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li class="nav-item">
                                <a class="nav-link mx-lg-3 active" aria-current="page" href="index.php">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link mx-lg-3" href="wcag.php">WCAG Guidelines</a>
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
    
    <section class="hero-intro">
        <div class="container">
            <div class="row align-items-center g-4">
                <div class="col-12 col-md-7">
                    <h1 class="hero-title mb-5">Build Inclusive Websites with Confidence</h1>
                    <p class="hero-description mb-0 my-3">Scan your pages against WCAG 2.1 standards and receive clear, actionable recommendations to improve usability for everyone, including people who rely on assistive technologies. Identify common accessibility issues early, understand why they matter, and apply practical fixes that strengthen navigation, readability, keyboard access, and overall user experience across devices.</p>
                </div>
                <div class="col-12 col-md-5 text-center text-md-end">
                    <img id="head-image" src="accessibility.gif" alt="Accessibility illustration">
                </div>
            </div>
        </div>
    </section>
    
    <main class="pt-5 mt-3">
        <div class="container">
            <?php if (!empty($error)): ?>
                <div class="alert alert-danger" role="alert">
                    <?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?>
                </div>
            <?php
endif; ?>
            <h2 class="text-center">Accessibility Scanner</h2>
            <p class="text-center mt-4 mb-4">Choose your evaluation method below.</p>

            <!-- Tab Navigation -->
            <ul class="nav nav-tabs justify-content-center mb-4" id="scannerTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="url-tab" data-bs-toggle="tab" data-bs-target="#url-panel" type="button" role="tab" aria-controls="url-panel" aria-selected="true">
                        <i class="bi bi-link-45deg me-2"></i>Website URL
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="html-tab" data-bs-toggle="tab" data-bs-target="#html-panel" type="button" role="tab" aria-controls="html-panel" aria-selected="false">
                        <i class="bi bi-code-slash me-2"></i>HTML Code
                    </button>
                </li>
            </ul>
            
            <!-- Tab Content -->
            <div class="tab-content" id="scannerTabContent">
                <!-- Website URL Panel -->
                <div class="tab-pane fade show active" id="url-panel" role="tabpanel" aria-labelledby="url-tab" tabindex="0">
                    <form action="scan.php" method="POST" id="url-form">
                        <input type="hidden" name="scan_type" value="url">
                        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8'); ?>">
                        <div class="mx-auto">
                            <label for="website-url" class="form-label fw-semibold">
                                Website URL
                            </label>
                            <div class="input-group mb-2">
                                <span class="input-group-text">
                                    <i class="bi bi-globe"></i>
                                </span>
                                <input type="url" id="website-url" name="website_url" class="form-control" placeholder="https://example.com" aria-describedby="urlHelp" required />
                            </div>
                            <div id="urlHelp" class="form-text mb-4">
                                Enter the full URL starting with https://
                            </div>
                            <button type="submit" class="btn btn-primary w-100 py-2">
                                <i class="bi bi-search me-2"></i>Scan Website
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- HTML Code Panel -->
                <div class="tab-pane fade" id="html-panel" role="tabpanel" aria-labelledby="html-tab" tabindex="0">
                    <form action="scan.php" method="POST" id="html-form">
                        <input type="hidden" name="scan_type" value="html">
                        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8'); ?>">
                        <input type="hidden" id="html-code-input" name="html_code">
                        <div class="mx-auto">
                            <label for="html-editor" class="form-label fw-semibold">
                                HTML Source Code
                            </label>
                            <div class="position-relative mb-4">
                                <div id="html-editor" class="html-editor-container"></div>
                                <i class="bi bi-file-earmark-code position-absolute top-0 end-0 m-3 text-muted editor-icon"></i>
                            </div>
                            <button type="submit" class="btn btn-success w-100 py-2">
                                <i class="bi bi-play-circle me-2"></i>Analyze HTML
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>

    <main class="pt-5 mt-5 mb-5">
        <div class="container">
            <h2 class="text-center mb-5">WCAG 2.1 Principles</h2>
            <div class="row row-cols-1 rows-cols-sm-2 row-cols-md-4 g-4">
                <div class="col d-flex">
                    <div class="card h-100 w-100">
                    <div class="card-top perceivable"></div>
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title h6 fw-bold text-uppercase"><span class="icon-container perceivable me-2"><i class="bi bi-eye me-2"></i></span>Perceivable</h3>
                        <hr class="my-2"/>
                        <p class="card-text text-muted flex-grow-1">Information and user interface components must be presentable to users in ways they can perceive.</p>
                    </div>
                    </div>
                </div>
                <div class="col d-flex">
                    <div class="card h-100 w-100">
                    <div class="card-top operable"></div>
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title h6 fw-bold text-uppercase"><span class="icon-container operable me-2"><i class="bi bi-mouse me-2"></i></span>Operable</h3>
                        <hr class="my-2"/>
                        <p class="card-text text-muted flex-grow-1">User interface components and navigation must be operable.</p>
                    </div>
                    </div>
                </div>
                <div class="col d-flex">
                    <div class="card h-100 w-100">
                    <div class="card-top understandable"></div>
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title h6 fw-bold text-uppercase"><span class="icon-container understandable me-2"><i class="bi bi-lightbulb me-2"></i></span>Understandable</h3>
                        <hr class="my-2"/>
                        <p class="card-text text-muted flex-grow-1">Information and the operation of user interface must be understandable.</p>
                    </div>
                    </div>
                </div>
                <div class="col d-flex">
                    <div class="card h-100 w-100">
                    <div class="card-top robust"></div>
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title h6 fw-bold text-uppercase"><span class="icon-container robust me-2"><i class="bi bi-cpu me-2"></i></span>Robust</h3>
                        <hr class="my-2"/>
                        <p class="card-text text-muted flex-grow-1">Content must be robust enough to be interpreted reliably by a wide variety of user agents.</p>
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
                        <li><a href="wcag.php?level=A" class="text-decoration-none text-muted d-block mb-2">Level A</a></li>
                        <li><a href="wcag.php?level=AA" class="text-decoration-none text-muted d-block mb-2">Level AA</a></li>
                        <li><a href="wcag.php?level=AAA" class="text-decoration-none text-muted d-block mb-2">Level AAA</a></li>
                    </ul>
                </div>
                <div class="col-md-3 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">WCAG 2.1 Principles</h6>
                    <ul class="list-unstyled small">
                        <li><a href="wcag.php?principle=Perceivable" class="text-decoration-none text-muted d-block mb-2">Perceivable</a></li>
                        <li><a href="wcag.php?principle=Operable" class="text-decoration-none text-muted d-block mb-2">Operable</a></li>
                        <li><a href="wcag.php?principle=Understandable" class="text-decoration-none text-muted d-block mb-2">Understandable</a></li>
                        <li><a href="wcag.php?principle=Robust" class="text-decoration-none text-muted d-block mb-2">Robust</a></li>
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
                        Copyright &copy; <?php echo date('Y'); ?> All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    </footer>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/xml/xml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/htmlmixed/htmlmixed.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/lint/lint.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/lint/lint.min.css">
    <script src="code-editor-utils.js"></script>
    
    <script>
    let htmlEditor;
    
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize CodeMirror editor
        htmlEditor = CodeMirror(document.getElementById('html-editor'), {
            lineNumbers: true,
            mode: 'htmlmixed',
            lineWrapping: true,
            indentUnit: 4,
            indentWithTabs: false,
            theme: 'default',
            viewportMargin: Infinity,
            placeholder: 'Paste your HTML code here to analyze for accessibility issues.'
        });
        
        // Form validation
        const urlForm = document.getElementById('url-form');
        const htmlForm = document.getElementById('html-form');

        // Ensure tabs toggle even if Bootstrap's data API doesn't initialize
        const tabButtons = document.querySelectorAll('#scannerTab [data-bs-toggle="tab"]');
        const tabPanels = document.querySelectorAll('#scannerTabContent .tab-pane');
        if (tabButtons.length && tabPanels.length) {
            if (window.bootstrap && window.bootstrap.Tab) {
                tabButtons.forEach((button) => {
                    const tabInstance = window.bootstrap.Tab.getOrCreateInstance(button);
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        tabInstance.show();
                        // Refresh CodeMirror when tab is shown
                        setTimeout(() => {
                            if (htmlEditor) htmlEditor.refresh();
                        }, 100);
                    });
                });
            } else {
                tabButtons.forEach((button) => {
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        tabButtons.forEach((btn) => {
                            btn.classList.remove('active');
                            btn.setAttribute('aria-selected', 'false');
                        });
                        tabPanels.forEach((panel) => {
                            panel.classList.remove('show', 'active');
                        });
                        const targetSelector = button.getAttribute('data-bs-target');
                        const targetPanel = targetSelector ? document.querySelector(targetSelector) : null;
                        button.classList.add('active');
                        button.setAttribute('aria-selected', 'true');
                        if (targetPanel) {
                            targetPanel.classList.add('show', 'active');
                            // Refresh CodeMirror when tab is shown
                            setTimeout(() => {
                                if (htmlEditor) htmlEditor.refresh();
                            }, 100);
                        }
                    });
                });
            }
        }
        
        if (urlForm) {
            urlForm.addEventListener('submit', function(e) {
                const urlInput = document.getElementById('website-url');
                const url = urlInput.value.trim();
                
                if (!url) {
                    e.preventDefault();
                    alert('Please enter a website URL');
                    urlInput.focus();
                    return;
                }
                
                try {
                    new URL(url);
                } catch (error) {
                    e.preventDefault();
                    alert('Please enter a valid URL (e.g., https://example.com)');
                    urlInput.focus();
                }
            });
        }
        
        if (htmlForm) {
            htmlForm.addEventListener('submit', function(e) {
                const htmlCode = htmlEditor.getValue().trim();
                const hiddenInput = document.getElementById('html-code-input');
                
                if (!htmlCode) {
                    e.preventDefault();
                    alert('Please enter HTML code to analyze');
                    htmlEditor.focus();
                    return;
                }
                
                // Set the hidden input value for form submission
                hiddenInput.value = htmlCode;
            });
        }
    });
    </script>
</body>
</html>

