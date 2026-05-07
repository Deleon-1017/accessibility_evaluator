<?php
// results.php - Wireframe-Based Bootstrap 5 Redesign
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

$summary = (isset($results['summary']) && is_array($results['summary'])) ? $results['summary'] : [];
$errorCount = (int)($summary['error_count'] ?? 0);
$warningCount = (int)($summary['warning_count'] ?? 0);
$infoCount = (int)($summary['info_count'] ?? 0);
$totalIssues = $errorCount + $warningCount + $infoCount;

$scanTargetLabel = !empty($results['source_url']) ? 'Live URL Scan' : 'Local File Scan';
$timestampRaw = (string)($results['timestamp'] ?? '');
$scanTimestampDisplay = $timestampRaw !== '' ? $timestampRaw : 'Timestamp not available';
$scanTimestampAttr = $timestampRaw;
if ($timestampRaw !== '') {
    $scanTimestampUnix = strtotime($timestampRaw);
    if ($scanTimestampUnix !== false) {
        $scanTimestampDisplay = date('M j, Y g:i A', $scanTimestampUnix);
        $scanTimestampAttr = date(DATE_ATOM, $scanTimestampUnix);
    }
}

if ($percentage >= 80) {
    $scoreStatusText = 'Strong Foundation';
} elseif ($percentage >= 60) {
    $scoreStatusText = 'Needs Refinement';
} else {
    $scoreStatusText = 'Needs Immediate Attention';
}
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
        /* Modern Dashboard Design */
        :root {
            --primary: #6366F1;
            --success: #10B981;
            --warning: #F59E0B;
            --danger: #EF4444;
            --info: #3B82F6;
            --gray-50: #F9FAFB;
            --gray-100: #F3F4F6;
            --gray-200: #E5E7EB;
            --gray-300: #D1D5DB;
            --gray-600: #4B5563;
            --gray-700: #374151;
            --gray-900: #111827;
        }

        body {
            background: #F5F7FA;
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

        /* Dashboard Hero Header */
        .dashboard-hero {
            background: transparent;
            border: none;
            border-radius: 0;
            padding: 0;
            margin-bottom: 2rem;
            box-shadow: none;
        }

        .hero-info-panel,
        .hero-score-panel {
            height: 100%;
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: 1rem;
            padding: 1.25rem;
        }

        .hero-info-panel {
            display: flex;
            align-items: flex-start;
        }

        .website-info-card {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            width: 100%;
        }

        .website-logo-dash {
            width: 72px;
            height: 72px;
            flex-shrink: 0;
            border-radius: 0.75rem;
            overflow: hidden;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
        }

        .website-logo-dash img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 8px;
        }

        .website-logo-dash i {
            font-size: 2.5rem;
            color: var(--gray-600);
        }

        .website-info-text {
            flex: 1;
        }

        .website-title {
            font-size: 1.625rem;
            font-weight: 700;
            color: var(--gray-900);
            margin: 0 0 0.75rem 0;
            line-height: 1.15;
        }

        .website-meta {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 0.85rem;
        }

        .meta-item {
            font-size: 0.875rem;
            color: var(--gray-600);
            display: flex;
            align-items: center;
            gap: 0.55rem;
            background: transparent;
            border: none;
            border-radius: 0;
            padding: 0;
            line-height: 1.6;
        }

        .meta-item a {
            color: var(--primary);
            text-decoration: none;
            word-break: break-all;
        }

        .meta-item:not(.meta-url) {
            width: fit-content;
            max-width: 100%;
        }

        .meta-item a:hover {
            text-decoration: underline;
        }

        .meta-item i {
            color: var(--gray-500);
        }

        /* Score Dashboard Card */
        .score-dashboard-card {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
        }

        .score-circle-dash {
            width: 170px;
            height: 170px;
            margin: 0 auto;
        }

        .score-svg-dash {
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));
        }

        .score-label-dash {
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--gray-600);
            margin-top: 0.75rem;
        }

        .score-context-dash {
            margin-top: 0.35rem;
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--gray-700);
        }

        /* Dashboard Content */
        .dashboard-content {
            margin-bottom: 2rem;
        }

        .dashboard-card {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .card-header-dash {
            padding: 1.5rem 2rem;
            border-bottom: 2px solid var(--gray-200);
            background: var(--gray-50);
        }

        .card-title-dash {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--gray-900);
            margin: 0;
            display: flex;
            align-items: center;
        }

        .card-body-dash {
            padding: 0;
        }

        /* Dashboard Widgets */
        .dashboard-widget {
            background: white;
            border-radius: 0.875rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .widget-header {
            padding: 1.25rem 1.5rem;
            border-bottom: 2px solid var(--gray-200);
            background: var(--gray-50);
        }

        .widget-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--gray-900);
            margin: 0;
            display: flex;
            align-items: center;
        }

        .widget-body {
            padding: 1.5rem;
        }

        .summary-stat {
            display: grid;
            grid-template-columns: 1fr 3rem 1.25rem;
            align-items: center;
            gap: 0.75rem;
            padding: 0.875rem 0.5rem;
            border-bottom: 1px solid var(--gray-200);
        }

        .summary-stat:last-child {
            border-bottom: none;
        }

        .summary-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--gray-700);
            justify-self: start;
        }

        .summary-value {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--gray-900);
            text-align: right;
            justify-self: end;
        }

        /* Interactive Summary Stats with Dropdown */
        .summary-stat-interactive {
            border-bottom: 1px solid var(--gray-200);
        }

        .summary-stat-interactive:last-child {
            border-bottom: none;
        }

        .summary-stat-header {
            width: 100%;
            padding: 0.875rem 0.5rem;
            cursor: pointer;
            transition: background 0.2s ease;
            border-radius: 0.375rem;
            border: none;
            background: transparent;
            text-align: left;
            display: grid;
            grid-template-columns: 1fr 3rem 1.25rem;
            align-items: center;
            gap: 0.75rem;
        }

        .summary-stat-header:hover {
            background: var(--gray-50);
        }

        .summary-stat-header:focus {
            outline: 2px solid var(--primary);
            outline-offset: 2px;
        }

        .summary-stat-header .summary-label {
            justify-self: start;
        }

        .summary-stat-header .summary-value {
            justify-self: end;
            text-align: right;
        }

        .dropdown-toggle-icon {
            font-size: 0.875rem;
            transition: transform 0.3s ease;
            color: var(--gray-600);
            justify-self: center;
            text-align: center;
        }

        .summary-stat-header[aria-expanded="true"] .dropdown-toggle-icon {
            transform: rotate(180deg);
        }

        .principles-dropdown-content {
            padding: 1rem;
            background: var(--gray-50);
            border-radius: 0.5rem;
            margin: 0.5rem 0 0.875rem 0;
            animation: slideDown 0.3s ease-out;
        }

        .collapse:not(.show) {
            display: none;
        }

        .collapse.show {
            display: block;
        }

        .collapsing {
            height: 0;
            overflow: hidden;
            transition: height 0.35s ease;
        }

        .principles-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--gray-600);
            margin-bottom: 0.75rem;
            letter-spacing: 0.05em;
        }

        .principles-dropdown-content .principle-badge {
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
            display: inline-flex;
        }

        .widget-text {
            font-size: 0.875rem;
            line-height: 1.6;
            color: var(--gray-700);
            margin-bottom: 1rem;
        }

        .insight-tip {
            background: #EFF6FF;
            border-left: 3px solid var(--info);
            padding: 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.8125rem;
            color: var(--gray-700);
            display: flex;
            align-items: flex-start;
        }

        .table-responsive {
            border-radius: 0.5rem;
            overflow: hidden;
            border: 1px solid var(--gray-200);
        }

        .results-table {
            margin-bottom: 0;
            table-layout: fixed;
            width: 100%;
        }

        .results-table thead {
            background: #F9FAFB;
        }

        .results-table th {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--gray-600);
            padding: 1rem 1.25rem;
            border-bottom: 2px solid var(--gray-200);
            vertical-align: middle;
            text-align: left;
        }

        .results-table th:first-child {
            text-align: center;
        }

        .results-table th:nth-child(2) {
            text-align: center;
        }

        .results-table th:nth-child(3) {
            text-align: center;
        }

        .results-table td {
            padding: 1.5rem 1.25rem;
            vertical-align: middle;
            color: var(--gray-700);
            text-align: left;
        }

        .results-table td:first-child {
            text-align: center;
        }

        .results-table td:nth-child(2) {
            text-align: center;
        }

        .results-table td:nth-child(3) {
            text-align: center;
        }

        .results-table tbody tr.issue-row {
            cursor: pointer;
            border-bottom: 1px solid var(--gray-200);
        }

        .results-table tbody tr.issue-row:hover {
            background: transparent !important;
            transform: none !important;
            box-shadow: none !important;
        }

        .results-table tbody tr.issue-row:last-child {
            border-bottom: none;
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

        .results-table code {
            background: #F3F4F6;
            color: #DC2626;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
            font-family: 'Courier New', monospace;
        }

        .expand-icon {
            transition: transform 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: transparent;
            border: none;
            border-radius: 0.375rem;
            font-size: 1rem;
            font-weight: 400;
            color: #6B7280;
            cursor: pointer;
        }

        .expand-icon::before {
            content: '\276F';
            display: inline-block;
            transform: rotate(90deg);
        }

        .expand-icon.rotated::before {
            transform: rotate(-90deg);
        }

        /* Badge Styles */
        .badge-type {
            padding: 0.4rem 0.85rem;
            border-radius: 0.375rem;
            font-size: 0.6875rem;
            font-weight: 700;
            text-transform: uppercase;
            white-space: nowrap;
            display: inline-block;
            min-width: 75px;
            text-align: center;
            letter-spacing: 0.02em;
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

        /* Principle Badge Styles */
        .principle-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.6rem 1.3rem;
            border-radius: 1rem;
            font-weight: 600;
            font-size: 0.6875rem;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            white-space: nowrap;
            min-width: 130px;
            justify-content: center;
        }

        .principle-perceivable {
            background: #DBEAFE;
            color: #1E40AF;
        }

        .principle-operable {
            background: #D1FAE5;
            color: #065F46;
        }

        .principle-understandable {
            background: #FEF3C7;
            color: #92400E;
        }

        .principle-robust {
            background: #FEE2E2;
            color: #991B1B;
        }

        /* Modal Styles */
        .modal-header {
            background: #6366F1;
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

        /* Responsive */
        @media (max-width: 992px) {
            .dashboard-hero {
                padding: 1.25rem;
            }

            .score-circle-dash {
                width: 154px;
                height: 154px;
            }
        }

        @media (max-width: 768px) {
            .dashboard-hero {
                padding: 1rem;
            }

            .hero-info-panel,
            .hero-score-panel {
                padding: 1rem;
            }

            .website-info-card {
                flex-direction: column;
                align-items: flex-start;
            }

            .website-logo-dash {
                width: 70px;
                height: 70px;
            }

            .website-title {
                font-size: 1.5rem;
            }

            .score-circle-dash {
                width: 138px;
                height: 138px;
            }

            .card-header-dash {
                padding: 1.25rem 1.5rem;
            }

            .card-title-dash {
                font-size: 1.125rem;
            }
        }

        @media (max-width: 480px) {
            .results-container {
                padding: 0 0.75rem;
            }

            .dashboard-hero {
                padding: 1.25rem;
            }

            .website-logo-dash {
                width: 60px;
                height: 60px;
            }

            .website-title {
                font-size: 1.25rem;
            }

            .score-circle-dash {
                width: 124px;
                height: 124px;
            }
        }
    </style>
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    
    <!-- Navbar -->
    <header>
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php">
                    <img src="logo.png" alt="Logo" width="60" height="60" class="mx-3 me-3">
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

        <!-- Dashboard Hero Header -->
        <div class="dashboard-hero">
            <div class="row align-items-stretch g-3">
                <!-- Left: Website Info -->
                <div class="col-lg-8">
                    <section class="hero-info-panel" aria-label="Scan target details">
                        <div class="website-info-card">
                            <div class="website-logo-dash">
                                <?php if (!empty($results['source_url'])): ?>
                                    <?php
                                    $parsedUrl = parse_url($results['source_url']);
                                    $domain = $parsedUrl['host'] ?? '';
                                    $faviconUrl = 'https://www.google.com/s2/favicons?domain=' . urlencode($domain) . '&sz=128';
                                    ?>
                                    <img src="<?php echo htmlspecialchars($faviconUrl); ?>" 
                                         alt="Website logo" 
                                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <i class="bi bi-globe" style="display: none;"></i>
                                <?php else: ?>
                                    <i class="bi bi-file-earmark-code"></i>
                                <?php endif; ?>
                            </div>
                            <div class="website-info-text">
                                <h1 class="website-title"><?php 
                                    if (!empty($results['source_url'])) {
                                        $parsedUrl = parse_url($results['source_url']);
                                        $domain = $parsedUrl['host'] ?? 'Website';
                                        $domain = preg_replace('/^www\./i', '', $domain);
                                        $domain = preg_replace('/\.[a-z]{2,}$/i', '', $domain);
                                        $domain = ucfirst($domain);
                                        echo htmlspecialchars($domain);
                                    } else {
                                        echo 'Uploaded HTML Document';
                                    }
                                ?></h1>
                                <div class="website-meta">
                                    <?php if (!empty($results['source_url'])): ?>
                                        <span class="meta-item meta-url">
                                            <i class="bi bi-link-45deg"></i>
                                            <a href="<?php echo htmlspecialchars($results['source_url']); ?>" 
                                               target="_blank" 
                                               rel="noopener noreferrer">
                                                <?php echo htmlspecialchars($results['source_url']); ?>
                                            </a>
                                        </span>
                                    <?php endif; ?>
                                    <span class="meta-item">
                                        <i class="bi bi-broadcast-pin"></i>
                                        <?php echo htmlspecialchars($scanTargetLabel); ?>
                                    </span>
                                    <span class="meta-item">
                                        <i class="bi bi-calendar-check"></i>
                                        <?php if ($scanTimestampAttr !== ''): ?>
                                            <time datetime="<?php echo htmlspecialchars($scanTimestampAttr); ?>">
                                                <?php echo htmlspecialchars($scanTimestampDisplay); ?>
                                            </time>
                                        <?php else: ?>
                                            <?php echo htmlspecialchars($scanTimestampDisplay); ?>
                                        <?php endif; ?>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                
                <!-- Right: Accessibility Score Circle -->
                <div class="col-lg-4">
                    <section class="hero-score-panel" aria-label="Accessibility score summary">
                        <div class="score-dashboard-card">
                            <div class="score-circle-dash">
                                <?php
                                if ($percentage >= 80) {
                                    $scoreColor = '#10B981';
                                } elseif ($percentage >= 60) {
                                    $scoreColor = '#F59E0B';
                                } else {
                                    $scoreColor = '#EF4444';
                                }
                                ?>
                                <svg class="score-svg-dash" viewBox="0 0 200 200">
                                    <circle cx="100" cy="100" r="85" fill="none" stroke="#E5E7EB" stroke-width="16" opacity="0.2"/>
                                    <circle cx="100" cy="100" r="85" fill="none" stroke="<?php echo $scoreColor; ?>" 
                                            stroke-width="16" stroke-linecap="round"
                                            stroke-dasharray="534.07"
                                            stroke-dashoffset="calc(534.07 - (534.07 * <?php echo $percentage; ?> / 100))"
                                            transform="rotate(-90 100 100)"
                                            style="transition: stroke-dashoffset 1.5s ease-in-out;"/>
                                    <text x="100" y="95" text-anchor="middle" dominant-baseline="middle" 
                                          fill="<?php echo $scoreColor; ?>" 
                                          style="font-size: 3.5rem; font-weight: 900;">
                                        <?php echo $percentage; ?>%
                                    </text>
                                </svg>
                            </div>
                            <div class="score-label-dash">Accessibility Score</div>
                            <div class="score-context-dash" style="color: <?php echo $scoreColor; ?>;">
                                <?php echo htmlspecialchars($scoreStatusText); ?>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>



        <!-- Main Dashboard Content: 2-Column Layout -->
        <div class="dashboard-content">
            <div class="row g-4">
                <!-- Left Column: Issues Table -->
                <div class="col-lg-8">
                    <div class="dashboard-card">
                        <div class="card-header-dash">
                            <h2 class="card-title-dash">
                                <i class="bi bi-exclamation-triangle me-2"></i>
                                Accessibility Issues
                            </h2>
                        </div>
                        <div class="card-body-dash">
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
                                                <th scope="col" style="width: 13%;">Type</th>
                                                <th scope="col" style="width: 10%;">WCAG</th>
                                                <?php if (!$results['source_url']): ?>
                                                <th scope="col" style="width: 7%;">Line</th>
                                                <?php endif; ?>
                                                <th scope="col" style="width: 18%;">Principle</th>
                                                <th scope="col">Issue Description</th>
                                                <th scope="col" style="width: 10%;"></th>
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
                                                <td>
                                                    <span class="badge principle-badge principle-<?php echo strtolower($issue['principle']); ?>">
                                                        <?php echo htmlspecialchars($issue['principle']); ?>
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong><?php echo htmlspecialchars($issue['title']); ?></strong>
                                                    <div class="small text-muted mt-1"><?php echo htmlspecialchars($issue['description']); ?></div>
                                                </td>
                                                <td class="text-center">
                                                    <span class="expand-icon"></span>
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
                    </div>
                </div>

                <!-- Right Column: Dashboard Widgets -->
                <div class="col-lg-4">
                    <!-- Scan Summary Widget -->
                    <div class="dashboard-widget mb-4">
                        <div class="widget-header">
                            <h3 class="widget-title">
                                <i class="bi bi-bar-chart-fill me-2"></i>
                                Scan Summary
                            </h3>
                        </div>
                        <div class="widget-body">
                            <?php
                            // Calculate principles affected by each issue type
                            $issueTypePrinciples = [
                                'error' => [],
                                'warning' => [],
                                'info' => []
                            ];
                            
                            foreach ($results['issues'] as $issue) {
                                $type = strtolower($issue['type']);
                                $principle = $issue['principle'];
                                if (!in_array($principle, $issueTypePrinciples[$type])) {
                                    $issueTypePrinciples[$type][] = $principle;
                                }
                            }
                            ?>
                            
                            <div class="summary-stat">
                                <span class="summary-label">Total Issues</span>
                                <span class="summary-value"><?php echo $totalIssues; ?></span>
                                <span></span>
                            </div>
                            
                            <!-- Errors with Dropdown -->
                            <div class="summary-stat-interactive">
                                <button class="summary-stat-header" type="button" data-bs-toggle="collapse" data-bs-target="#errorPrinciples" aria-expanded="false" aria-controls="errorPrinciples">
                                    <span class="summary-label text-danger">
                                        <i class="bi bi-x-circle-fill me-1"></i>Errors
                                    </span>
                                    <span class="summary-value text-danger"><?php echo $errorCount; ?></span>
                                    <i class="bi bi-chevron-down dropdown-toggle-icon"></i>
                                </button>
                                <div class="collapse" id="errorPrinciples">
                                    <div class="principles-dropdown-content">
                                        <div class="principles-label">Affected WCAG Principles:</div>
                                        <?php if (!empty($issueTypePrinciples['error'])): ?>
                                            <?php foreach ($issueTypePrinciples['error'] as $principle): ?>
                                                <span class="principle-badge principle-<?php echo strtolower($principle); ?>">
                                                    <?php echo htmlspecialchars($principle); ?>
                                                </span>
                                            <?php endforeach; ?>
                                        <?php else: ?>
                                            <span class="text-muted small">No errors found</span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Warnings with Dropdown -->
                            <div class="summary-stat-interactive">
                                <button class="summary-stat-header" type="button" data-bs-toggle="collapse" data-bs-target="#warningPrinciples" aria-expanded="false" aria-controls="warningPrinciples">
                                    <span class="summary-label text-warning">
                                        <i class="bi bi-exclamation-triangle-fill me-1"></i>Warnings
                                    </span>
                                    <span class="summary-value text-warning"><?php echo $warningCount; ?></span>
                                    <i class="bi bi-chevron-down dropdown-toggle-icon"></i>
                                </button>
                                <div class="collapse" id="warningPrinciples">
                                    <div class="principles-dropdown-content">
                                        <div class="principles-label">Affected WCAG Principles:</div>
                                        <?php if (!empty($issueTypePrinciples['warning'])): ?>
                                            <?php foreach ($issueTypePrinciples['warning'] as $principle): ?>
                                                <span class="principle-badge principle-<?php echo strtolower($principle); ?>">
                                                    <?php echo htmlspecialchars($principle); ?>
                                                </span>
                                            <?php endforeach; ?>
                                        <?php else: ?>
                                            <span class="text-muted small">No warnings found</span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Info with Dropdown -->
                            <div class="summary-stat-interactive">
                                <button class="summary-stat-header" type="button" data-bs-toggle="collapse" data-bs-target="#infoPrinciples" aria-expanded="false" aria-controls="infoPrinciples">
                                    <span class="summary-label text-info">
                                        <i class="bi bi-info-circle-fill me-1"></i>Info
                                    </span>
                                    <span class="summary-value text-info"><?php echo $infoCount; ?></span>
                                    <i class="bi bi-chevron-down dropdown-toggle-icon"></i>
                                </button>
                                <div class="collapse" id="infoPrinciples">
                                    <div class="principles-dropdown-content">
                                        <div class="principles-label">Affected WCAG Principles:</div>
                                        <?php if (!empty($issueTypePrinciples['info'])): ?>
                                            <?php foreach ($issueTypePrinciples['info'] as $principle): ?>
                                                <span class="principle-badge principle-<?php echo strtolower($principle); ?>">
                                                    <?php echo htmlspecialchars($principle); ?>
                                                </span>
                                            <?php endforeach; ?>
                                        <?php else: ?>
                                            <span class="text-muted small">No info items found</span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Accessibility Insights Widget -->
                    <div class="dashboard-widget mb-4">
                        <div class="widget-header">
                            <h3 class="widget-title">
                                <i class="bi bi-lightbulb-fill me-2"></i>
                                Accessibility Insights
                            </h3>
                        </div>
                        <div class="widget-body">
                            <p class="widget-text">
                                <?php if ($percentage >= 80): ?>
                                    Great job! Your website has a strong accessibility foundation. Focus on resolving the remaining issues to achieve full compliance.
                                <?php elseif ($percentage >= 60): ?>
                                    Your website has moderate accessibility. Address the errors and warnings to improve user experience for people with disabilities.
                                <?php else: ?>
                                    Your website needs significant accessibility improvements. Start by fixing critical errors to ensure basic usability for all users.
                                <?php endif; ?>
                            </p>
                            <div class="insight-tip">
                                <i class="bi bi-info-circle me-2"></i>
                                <small>WCAG 2.1 Level AA compliance requires addressing all errors and most warnings.</small>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions Widget -->
                    <div class="dashboard-widget">
                        <div class="widget-header">
                            <h3 class="widget-title">
                                <i class="bi bi-lightning-fill me-2"></i>
                                Quick Actions
                            </h3>
                        </div>
                        <div class="widget-body">
                            <a href="index.php" class="btn btn-primary w-100 mb-2">
                                <i class="bi bi-arrow-repeat me-2"></i>
                                New Scan
                            </a>
                            <a href="wcag.php" class="btn btn-outline-primary w-100">
                                <i class="bi bi-book me-2"></i>
                                View WCAG Guidelines
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </main>

    <!-- Footer -->
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

            // Enhanced dropdown interactions for Scan Summary
            const dropdownButtons = document.querySelectorAll('.summary-stat-header');
            
            dropdownButtons.forEach(button => {
                // Manual click handler as backup
                button.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('data-bs-target');
                    const collapseElement = document.querySelector(targetId);
                    
                    if (collapseElement) {
                        // Check if Bootstrap is available
                        if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                            // Use Bootstrap's Collapse
                            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement);
                            bsCollapse.toggle();
                        } else {
                            // Fallback: manual toggle
                            const isExpanded = this.getAttribute('aria-expanded') === 'true';
                            
                            if (isExpanded) {
                                collapseElement.classList.remove('show');
                                this.setAttribute('aria-expanded', 'false');
                            } else {
                                collapseElement.classList.add('show');
                                this.setAttribute('aria-expanded', 'true');
                            }
                        }
                    }
                });
                
                // Listen for Bootstrap collapse events
                const targetId = button.getAttribute('data-bs-target');
                const collapseElement = document.querySelector(targetId);
                
                if (collapseElement) {
                    collapseElement.addEventListener('show.bs.collapse', function() {
                        button.setAttribute('aria-expanded', 'true');
                    });
                    
                    collapseElement.addEventListener('hide.bs.collapse', function() {
                        button.setAttribute('aria-expanded', 'false');
                    });
                }
            });
        });
    </script>
</body>
</html>
