<?php
// results-redesign.php - Wireframe-Based Bootstrap 5 Redesign
session_start();

// Include security helper
require_once __DIR__ . '/security-helper.php';

// Initialize secure session
initSecureSession();

// Check if results exist
$results = null;
if (isset($_SESSION['scan_results']) && is_array($_SESSION['scan_results'])) {
    $results = $_SESSION['scan_results'];
} else {
    $scanId = sanitizeInput($_GET['scan_id'] ?? '');
    if ($scanId !== '' && preg_match('/^[a-zA-Z0-9._-]+$/', $scanId)) {
        // Try loading from database first
        try {
            require_once __DIR__ . '/scan-results-db.php';
            require_once __DIR__ . '/config/database.php';
            
            $db = getDatabaseConnection();
            $scanDB = new ScanResultsDB($db);
            $results = $scanDB->getScanResults($scanId);
            
            if ($results) {
                $_SESSION['scan_results'] = $results;
            }
        } catch (Exception $e) {
            error_log("Failed to load scan from database: " . $e->getMessage());
            
            // Fallback to JSON file
            $reportFile = __DIR__ . '/reports/' . $scanId . '.json';
            if (is_file($reportFile)) {
                $reportJson = file_get_contents($reportFile);
                $decoded = json_decode($reportJson, true);
                if (is_array($decoded)) {
                    $results = $decoded;
                    $_SESSION['scan_results'] = $results;
                }
            }
        }
    }
}

if ($results === null) {
    header('Location: index.php');
    exit;
}

// Use the accessibility score already calculated in scan.php
$score = isset($results['score']) ? $results['score'] : 0;
$percentage = round($score);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Scan Results - Web Accessibility Evaluator</title>
    <link rel="icon" type="image/png" href="logo.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="style.css">
    <style>
        /* Wireframe-Based Results Page Design */
        :root {
            --primary: #6366F1;
            --success: #10B981;
            --warning: #F59E0B;
            --danger: #EF4444;
            --info: #3B82F6;
            --gray-50: #F9FAFB;
            --gray-100: #F3F4F6;
            --gray-200: #E5E7EB;
            --gray-600: #4B5563;
            --gray-700: #374151;
            --gray-900: #111827;
        }

        body {
            background: var(--gray-50);
            padding-top: 80px;
        }

        /* Skip Link */
        .skip-link {
            position: absolute;
            left: -9999px;
            top: 0;
            z-index: 999;
            padding: 1rem 1.5rem;
            background: var(--primary);
            color: white;
            text-decoration: none;
            border-radius: 0 0 0.5rem 0;
            font-weight: 600;
        }

        .skip-link:focus {
            left: 0;
        }

        /* Main Container */
        .results-container {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        /* Website Info Section - Outside Container */
        .website-info-section {
            background: transparent;
            padding: 0;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            padding-top: 2rem;
        }

        .website-info {
            display: flex;
            align-items: flex-start;
            gap: 2rem;
            margin-bottom: 0;
        }

        /* Top Section - Clean Design */
        .top-section {
            background: transparent;
            border-radius: 0;
            padding: 3rem 2.5rem;
            margin-bottom: 2.5rem;
            box-shadow: none;
            border: none;
        }

        .website-placeholder {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
            border-radius: 1.125rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 3px solid var(--gray-300);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }

        .website-placeholder:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0,0,0,0.12);
        }

        .website-placeholder i {
            font-size: 3rem;
            color: var(--gray-500);
        }

        .website-details {
            flex: 1;
        }

        .website-details h1 {
            font-size: 2rem;
            font-weight: 800;
            color: var(--gray-900);
            margin-bottom: 1.25rem;
            border-bottom: 4px solid var(--gray-900);
            padding-bottom: 0.75rem;
            letter-spacing: -0.03em;
            line-height: 1.2;
        }

        .website-details p {
            margin: 0;
            padding: 0.875rem 0;
            color: var(--gray-700);
            font-size: 0.9375rem;
            border-bottom: 2px solid var(--gray-200);
            line-height: 1.6;
            transition: all 0.2s ease;
        }

        .website-details p:hover {
            background: var(--gray-50);
            padding-left: 0.5rem;
            margin-left: -0.5rem;
            border-radius: 0.25rem;
        }

        .website-details p strong {
            color: var(--gray-900);
            font-weight: 700;
            margin-right: 0.625rem;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }

        .website-details p:last-child {
            border-bottom: 2px solid var(--gray-200);
        }

        .website-details a {
            color: var(--primary);
            text-decoration: none;
            transition: all 0.2s ease;
            font-weight: 500;
        }

        .website-details a:hover {
            color: #4F46E5;
            text-decoration: underline;
            text-decoration-thickness: 2px;
            text-underline-offset: 3px;
        }

        /* WCAG Principles Row - Compact Version for 3-Column Layout */
        .principles-row-compact {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .principles-row {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .principle-box {
            background: white;
            border: 2px solid var(--gray-200);
            border-radius: 1rem;
            padding: 1rem 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
            display: flex;
            align-items: center;
            gap: 1rem;
            width: 100%;
        }

        .principle-box.perceivable {
            border-color: #BFDBFE;
            background: linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%);
        }

        .principle-box.operable {
            border-color: #A7F3D0;
            background: linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%);
        }

        .principle-box.understandable {
            border-color: #FDE68A;
            background: linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 100%);
        }

        .principle-box.robust {
            border-color: #FECACA;
            background: linear-gradient(135deg, #FFFFFF 0%, #FEF2F2 100%);
        }

        .principle-icon-small {
            width: 56px;
            height: 56px;
            background: var(--gray-50);
            border: 2px solid var(--gray-200);
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--gray-700);
            flex-shrink: 0;
        }

        .principle-box.perceivable .principle-icon-small {
            background: #DBEAFE;
            border-color: #93C5FD;
            color: #1E40AF;
        }

        .principle-box.operable .principle-icon-small {
            background: #D1FAE5;
            border-color: #6EE7B7;
            color: #047857;
        }

        .principle-box.understandable .principle-icon-small {
            background: #FEF3C7;
            border-color: #FCD34D;
            color: #B45309;
        }

        .principle-box.robust .principle-icon-small {
            background: #FEE2E2;
            border-color: #FCA5A5;
            color: #B91C1C;
        }

        .principle-label {
            font-size: 0.8125rem;
            font-weight: 800;
            color: var(--gray-700);
            text-transform: uppercase;
            letter-spacing: 0.075em;
            flex: 1;
            text-align: left;
        }

        .principle-count {
            font-size: 2rem;
            font-weight: 900;
            color: var(--gray-900);
            line-height: 1;
            min-width: 45px;
            text-align: right;
        }

        /* Right Side: Score Dashboard - Clean Design */
        .score-dashboard-card {
            background: transparent;
            border: none;
            border-radius: 0;
            padding: 0;
            height: 100%;
            box-shadow: none;
        }

        /* Score Hero - Prominent Display */
        .score-hero {
            padding: 2rem 0;
        }

        /* SVG Progress Circle - Larger and More Prominent */
        .score-circle-container {
            width: 240px;
            height: 240px;
            margin: 0 auto;
            position: relative;
        }

        .score-circle-svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
            filter: drop-shadow(0 12px 32px rgba(0,0,0,0.15));
        }

        .score-circle-bg {
            opacity: 0.2;
        }

        .score-circle-progress {
            stroke-dasharray: 534.07;
            stroke-dashoffset: calc(534.07 - (534.07 * var(--percentage) / 100));
            transition: stroke-dashoffset 1.5s ease-in-out;
        }

        .score-value-svg {
            font-size: 4.5rem;
            font-weight: 900;
            letter-spacing: -0.05em;
            transform: rotate(90deg);
            transform-origin: center;
        }

        .score-label-bottom {
            font-size: 0.875rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--gray-600);
            margin-top: 1.75rem;
            line-height: 1.4;
        }

        /* Metrics Groups */
        .metrics-group {
            height: 100%;
        }

        /* Issue Counts Stack - Clean Cards */
        .issue-counts-stack {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .count-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: white;
            padding: 1.125rem 1.5rem;
            border-radius: 0.875rem;
            border: 2px solid var(--gray-200);
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }

        .count-icon-placeholder {
            width: 52px;
            height: 52px;
            background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
            border: 3px solid var(--gray-300);
            border-radius: 0.625rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .count-icon-placeholder.error-icon {
            background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
            border-color: #F87171;
        }

        .count-icon-placeholder.warning-icon {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border-color: #FBBF24;
        }

        .count-icon-placeholder.info-icon {
            background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
            border-color: #60A5FA;
        }

        .count-label-right {
            font-size: 0.8125rem;
            font-weight: 800;
            color: var(--gray-700);
            text-transform: uppercase;
            letter-spacing: 0.075em;
            flex: 1;
        }

        .count-value-right {
            font-size: 2rem;
            font-weight: 900;
            color: var(--gray-900);
            min-width: 45px;
            text-align: right;
            letter-spacing: -0.02em;
        }

        /* Results Table Section */
        .results-table-section {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .results-table-section h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 1.5rem;
        }

        .table-responsive {
            border-radius: 0.5rem;
            overflow: hidden;
            border: 1px solid var(--gray-200);
        }

        .results-table {
            margin-bottom: 0;
            table-layout: fixed;
        }

        .results-table thead {
            background: linear-gradient(180deg, #F8F9FA 0%, #E9ECEF 100%);
        }

        .results-table th {
            font-size: 0.8125rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--gray-700);
            padding: 1rem;
            border-bottom: 2px solid var(--gray-200);
        }

        .results-table td {
            padding: 1rem;
            vertical-align: middle;
            color: var(--gray-700);
        }

        .results-table tbody tr.issue-row {
            transition: background 0.2s ease;
            cursor: pointer;
        }

        .results-table tbody tr.issue-row:hover {
            background: #F0F7FF;
        }

        /* Expandable Row Details */
        .issue-details-row {
            display: none;
            background: #F8F9FA;
        }

        .issue-details-row.show {
            display: table-row;
        }

        .issue-details-row td {
            padding: 0 !important;
            border-top: none !important;
        }

        .issue-details-content {
            padding: 1.5rem;
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .detail-section {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: 0.5rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
        }

        .detail-section:last-child {
            margin-bottom: 0;
        }

        .detail-section-title {
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--gray-600);
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .detail-section-content {
            color: var(--gray-700);
            line-height: 1.6;
        }

        .code-snippet {
            background: #F8F9FA;
            border: 1px solid var(--gray-200);
            border-radius: 0.375rem;
            padding: 1rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            overflow-x: auto;
            margin: 0;
        }

        .expand-icon {
            transition: transform 0.3s ease, background 0.2s ease, border-color 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
            border: none;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            color: white;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
        }

        .issue-row:hover .expand-icon {
            box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
            transform: translateY(-1px);
        }

        .expand-icon.rotated {
            transform: rotate(180deg);
        }

        .issue-row:hover .expand-icon.rotated {
            transform: rotate(180deg) translateY(1px);
        }

        /* Badge Styles */
        .badge-type {
            padding: 0.375rem 0.875rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-error {
            background: #FEE2E2;
            color: #991B1B;
        }

        .badge-warning {
            background: #FEF3C7;
            color: #92400E;
        }

        .badge-info {
            background: #DBEAFE;
            color: #1E40AF;
        }

        /* Modal Styles */
        .modal-header {
            background: linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%);
            color: white;
        }

        .modal-header .btn-close {
            filter: brightness(0) invert(1);
        }

        .detail-box {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 0.5rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
        }

        .detail-box-title {
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--gray-600);
            margin-bottom: 0.75rem;
        }

        .code-snippet {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: 0.375rem;
            padding: 1rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            overflow-x: auto;
        }

        /* Back Button */
        .back-section {
            text-align: center;
            padding: 2rem 0;
        }

        .btn-back {
            display: inline-flex;
            align-items: center;
            gap: 0.625rem;
            padding: 1rem 2.5rem;
            background: white;
            color: var(--gray-700);
            border: 2px solid var(--gray-300);
            border-radius: 0.5rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .btn-back:hover {
            background: var(--gray-50);
            border-color: var(--primary);
            color: var(--primary);
            transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .top-section {
                padding: 1.5rem;
            }

            .website-info {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .website-placeholder {
                width: 120px;
                height: 120px;
            }

            .website-placeholder i {
                font-size: 3rem;
            }

            .score-hero {
                padding: 1.5rem 0;
            }

            .score-circle-container {
                width: 200px;
                height: 200px;
            }

            .score-value-svg {
                font-size: 3.75rem;
            }

            .principles-row-compact,
            .principles-row {
                gap: 0.625rem;
            }

            .principle-box {
                padding: 0.875rem 1.25rem;
            }

            .principle-icon-small {
                width: 48px;
                height: 48px;
                font-size: 1.25rem;
            }

            .principle-label {
                font-size: 0.75rem;
            }

            .principle-count {
                font-size: 1.75rem;
            }

            .count-icon-placeholder {
                width: 40px;
                height: 40px;
                font-size: 1.25rem;
            }
        }

        @media (max-width: 480px) {
            .score-circle-container {
                width: 180px;
                height: 180px;
            }

            .score-value-svg {
                font-size: 3.25rem;
            }

            .principle-box {
                padding: 0.75rem 1rem;
            }

            .principle-icon-small {
                width: 44px;
                height: 44px;
                font-size: 1.125rem;
            }

            .principle-label {
                font-size: 0.6875rem;
            }

            .principle-count {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    
    <!-- Navbar (Preserved from original) -->
    <header>
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php">
                    <img src="logo.png" alt="Logo" width="60" height="60" class="mx-5 me-3">
                    Web Accessibility Evaluator
                </a>
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
                                <a class="nav-link mx-lg-3" aria-current="page" href="index.php">Home</a>
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

    <main id="main-content" class="results-container">

        <!-- Top Section: Score Dashboard -->
        <div class="top-section">
            <div class="row">
                <!-- Main Score - Centered and Prominent -->
                <div class="col-12">
                    <div class="score-hero text-center mb-4">
                        <div class="score-circle-container">
                            <?php
                            // Determine color based on score
                            if ($percentage >= 80) {
                                $scoreColor = '#10B981'; // Green
                            } elseif ($percentage >= 60) {
                                $scoreColor = '#F59E0B'; // Orange
                            } else {
                                $scoreColor = '#EF4444'; // Red
                            }
                            ?>
                            <svg class="score-circle-svg" viewBox="0 0 200 200">
                                <!-- Background circle -->
                                <circle
                                    class="score-circle-bg"
                                    cx="100"
                                    cy="100"
                                    r="85"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    stroke-width="16"
                                />
                                <!-- Progress circle -->
                                <circle
                                    class="score-circle-progress"
                                    cx="100"
                                    cy="100"
                                    r="85"
                                    fill="none"
                                    stroke="<?php echo $scoreColor; ?>"
                                    stroke-width="16"
                                    stroke-linecap="round"
                                    style="--percentage: <?php echo $percentage; ?>;"
                                />
                                <!-- Score text -->
                                <text x="100" y="95" class="score-value-svg" text-anchor="middle" dominant-baseline="middle" fill="<?php echo $scoreColor; ?>">
                                    <?php echo $percentage; ?>%
                                </text>
                            </svg>
                        </div>
                        <div class="score-label-bottom">ACCESSIBILITY SCORE</div>
                    </div>
                </div>
            </div>

            <!-- Supporting Metrics - Two Columns -->
            <div class="row g-4">
                <!-- Left Column: Issue Counts -->
                <div class="col-md-6">
                    <div class="metrics-group">
                        <div class="issue-counts-stack">
                            <div class="count-row">
                                <div class="count-icon-placeholder error-icon">
                                    <i class="bi bi-x-circle-fill text-danger"></i>
                                </div>
                                <span class="count-label-right">ERRORS</span>
                                <span class="count-value-right"><?php echo $results['summary']['error_count']; ?></span>
                            </div>
                            <div class="count-row">
                                <div class="count-icon-placeholder warning-icon">
                                    <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                                </div>
                                <span class="count-label-right">WARNINGS</span>
                                <span class="count-value-right"><?php echo $results['summary']['warning_count']; ?></span>
                            </div>
                            <div class="count-row">
                                <div class="count-icon-placeholder info-icon">
                                    <i class="bi bi-info-circle-fill text-info"></i>
                                </div>
                                <span class="count-label-right">INFO</span>
                                <span class="count-value-right"><?php echo $results['summary']['info_count']; ?></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: WCAG Principles -->
                <div class="col-md-6">
                    <div class="metrics-group">
                        <div class="principles-row-compact">
                            <?php 
                            $principleIcons = [
                                'Perceivable' => 'bi-eye',
                                'Operable' => 'bi-mouse',
                                'Understandable' => 'bi-lightbulb',
                                'Robust' => 'bi-cpu'
                            ];
                            $principleColors = [
                                'Perceivable' => 'perceivable',
                                'Operable' => 'operable',
                                'Understandable' => 'understandable',
                                'Robust' => 'robust'
                            ];
                            foreach ($results['summary']['principles'] as $principle => $count): 
                            ?>
                            <div class="principle-box <?php echo $principleColors[$principle]; ?>">
                                <div class="principle-icon-small">
                                    <i class="bi <?php echo $principleIcons[$principle]; ?>"></i>
                                </div>
                                <div class="principle-label"><?php echo strtoupper($principle); ?></div>
                                <div class="principle-count"><?php echo $count; ?></div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Table Section -->
        <div class="results-table-section">
            <h2>Accessibility Issues</h2>
            
            <?php if (empty($results['issues'])): ?>
                <div class="alert alert-success" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    <strong>No Issues Found!</strong> Your page meets basic accessibility guidelines.
                </div>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table results-table table-hover">
                        <caption class="visually-hidden">Detailed listing of all detected accessibility issues</caption>
                        <thead>
                            <tr>
                                <th scope="col" style="width: 10%;">Type</th>
                                <th scope="col" style="width: 12%;">WCAG</th>
                                <?php if (!$results['source_url']): ?>
                                <th scope="col" style="width: 8%;">Line</th>
                                <?php endif; ?>
                                <th scope="col" style="width: 15%;">Principle</th>
                                <th scope="col">Issue Description</th>
                                <th scope="col" style="width: 5%;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($results['issues'] as $index => $issue): ?>
                            <tr class="issue-row" data-issue-index="<?php echo $index; ?>" role="button" tabindex="0" aria-expanded="false" aria-controls="details-<?php echo $index; ?>">
                                <td>
                                    <span class="badge-type badge-<?php echo $issue['type']; ?>">
                                        <?php echo ucfirst($issue['type']); ?>
                                    </span>
                                </td>
                                <td><code><?php echo htmlspecialchars($issue['code']); ?></code></td>
                                <?php if (!$results['source_url']): ?>
                                <td>
                                    <?php if (!empty($issue['line'])): ?>
                                        <span class="badge bg-secondary"><?php echo intval($issue['line']); ?></span>
                                    <?php else: ?>
                                        <span class="text-muted">N/A</span>
                                    <?php endif; ?>
                                </td>
                                <?php endif; ?>
                                <td><?php echo htmlspecialchars($issue['principle']); ?></td>
                                <td>
                                    <strong><?php echo htmlspecialchars($issue['title']); ?></strong>
                                    <div class="small text-muted mt-1"><?php echo htmlspecialchars($issue['description']); ?></div>
                                </td>
                                <td class="text-center">
                                    <span class="expand-icon">▼</span>
                                </td>
                            </tr>
                            <tr class="issue-details-row" id="details-<?php echo $index; ?>">
                                <td colspan="<?php echo $results['source_url'] ? '5' : '6'; ?>">
                                    <div class="issue-details-content">
                                        <div class="row g-3">
                                            <?php if (!empty($issue['element'])): ?>
                                            <div class="col-md-6">
                                                <div class="detail-section">
                                                    <div class="detail-section-title">
                                                        <i class="bi bi-code"></i> HTML ELEMENT
                                                    </div>
                                                    <div class="detail-section-content">
                                                        <pre class="code-snippet"><code><?php echo htmlspecialchars($issue['element']); ?></code></pre>
                                                    </div>
                                                </div>
                                            </div>
                                            <?php endif; ?>
                                            
                                            <div class="col-md-6">
                                                <div class="detail-section">
                                                    <div class="detail-section-title">
                                                        <i class="bi bi-info-circle"></i> DESCRIPTION
                                                    </div>
                                                    <div class="detail-section-content">
                                                        <?php echo htmlspecialchars($issue['description']); ?>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="col-12">
                                                <div class="detail-section">
                                                    <div class="detail-section-title">
                                                        <i class="bi bi-lightbulb"></i> HOW TO FIX
                                                    </div>
                                                    <div class="detail-section-content">
                                                        <?php echo htmlspecialchars($issue['recommendation']); ?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>

        <!-- Back Button -->
        <div class="back-section">
            <a href="index.php" class="btn-back">
                <i class="bi bi-arrow-left"></i>
                Back to Scanner
            </a>
        </div>
    </main>

    <!-- Footer (Preserved from original) -->
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
                        <li><a href="wcag.php#level-a" class="text-decoration-none text-muted d-block mb-2">Level A</a></li>
                        <li><a href="wcag.php#level-aa" class="text-decoration-none text-muted d-block mb-2">Level AA</a></li>
                        <li><a href="wcag.php#level-aaa" class="text-decoration-none text-muted d-block mb-2">Level AAA</a></li>
                    </ul>
                </div>
                <div class="col-md-3 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">WCAG 2.1 Principles</h6>
                    <ul class="list-unstyled small">
                        <li><a href="wcag.php#principle-perceivable" class="text-decoration-none text-muted d-block mb-2">Perceivable</a></li>
                        <li><a href="wcag.php#principle-operable" class="text-decoration-none text-muted d-block mb-2">Operable</a></li>
                        <li><a href="wcag.php#principle-understandable" class="text-decoration-none text-muted d-block mb-2">Understandable</a></li>
                        <li><a href="wcag.php#principle-robust" class="text-decoration-none text-muted d-block mb-2">Robust</a></li>
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
                    <p class="small text-muted">This tool is for educational purposes.</p>
                    <p class="small text-muted mb-1">Copyright &copy; <?php echo date('Y'); ?> All Rights Reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Modals for Issue Details -->
    <?php foreach ($results['issues'] as $index => $issue): ?>
    <div class="modal fade" id="issueModal<?php echo $index; ?>" tabindex="-1" aria-labelledby="issueModalLabel<?php echo $index; ?>" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="issueModalLabel<?php echo $index; ?>">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <?php echo htmlspecialchars($issue['title']); ?>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="detail-box">
                        <div class="detail-box-title">
                            <i class="bi bi-info-circle me-2"></i>Description
                        </div>
                        <p><?php echo htmlspecialchars($issue['description']); ?></p>
                    </div>

                    <?php if (!empty($issue['element'])): ?>
                    <div class="detail-box">
                        <div class="detail-box-title">
                            <i class="bi bi-code me-2"></i>HTML Element
                        </div>
                        <pre class="code-snippet"><code><?php echo htmlspecialchars($issue['element']); ?></code></pre>
                    </div>
                    <?php endif; ?>

                    <?php if (!$results['source_url'] && !empty($issue['line'])): ?>
                    <div class="detail-box">
                        <div class="detail-box-title">
                            <i class="bi bi-file-code me-2"></i>Location
                        </div>
                        <p>Line <?php echo intval($issue['line']); ?> in your HTML code</p>
                    </div>
                    <?php endif; ?>

                    <div class="detail-box">
                        <div class="detail-box-title">
                            <i class="bi bi-lightbulb me-2"></i>How to Fix
                        </div>
                        <p><?php echo htmlspecialchars($issue['recommendation']); ?></p>
                    </div>

                    <div class="row mt-3">
                        <div class="col-md-6">
                            <p><strong>WCAG Reference:</strong> <code><?php echo htmlspecialchars($issue['code']); ?></code></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Principle:</strong> <?php echo htmlspecialchars($issue['principle']); ?></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <?php endforeach; ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+q2scQbITxI" crossorigin="anonymous"></script>
    <script>
        // Toggle issue details dropdown
        document.addEventListener('DOMContentLoaded', function() {
            const issueRows = document.querySelectorAll('.issue-row');
            
            issueRows.forEach(row => {
                row.addEventListener('click', function() {
                    const index = this.getAttribute('data-issue-index');
                    const detailsRow = document.getElementById('details-' + index);
                    const expandIcon = this.querySelector('.expand-icon');
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    
                    // Toggle the details row
                    detailsRow.classList.toggle('show');
                    
                    // Rotate the expand icon
                    expandIcon.classList.toggle('rotated');
                    
                    // Update aria-expanded
                    this.setAttribute('aria-expanded', !isExpanded);
                });
                
                // Keyboard accessibility
                row.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        });
    </script>
</body>
</html>
