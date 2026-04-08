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

if ($results === null) {
    header('Location: index.php');
    exit;
}

// Calculate accessibility score
$totalPossible = 50;
$deductions = min($results['summary']['error_count'] * 5 + $results['summary']['warning_count'] * 2, 45);
$score = max($totalPossible - $deductions, 0);
$percentage = round(($score / $totalPossible) * 100);
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
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .website-info-card {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .website-logo-dash {
            width: 80px;
            height: 80px;
            flex-shrink: 0;
            border-radius: 0.75rem;
            overflow: hidden;
            background: var(--gray-50);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--gray-200);
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
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--gray-900);
            margin: 0 0 0.5rem 0;
        }

        .website-meta {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
        }

        .meta-item {
            font-size: 0.875rem;
            color: var(--gray-600);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .meta-item a {
            color: var(--primary);
            text-decoration: none;
            word-break: break-all;
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
        }

        .score-circle-dash {
            width: 180px;
            height: 180px;
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
            margin-top: 1rem;
        }

        /* KPI Cards Row */
        .kpi-cards-row {
            margin-bottom: 2rem;
        }

        .kpi-card {
            background: white;
            border-radius: 0.875rem;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .kpi-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .kpi-card.kpi-error {
            border-color: #FEE2E2;
        }

        .kpi-card.kpi-error:hover {
            border-color: #FCA5A5;
        }

        .kpi-card.kpi-warning {
            border-color: #FEF3C7;
        }

        .kpi-card.kpi-warning:hover {
            border-color: #FCD34D;
        }

        .kpi-card.kpi-info {
            border-color: #DBEAFE;
        }

        .kpi-card.kpi-info:hover {
            border-color: #93C5FD;
        }

        .kpi-card.kpi-total {
            border-color: #E9D5FF;
        }

        .kpi-card.kpi-total:hover {
            border-color: #C084FC;
        }

        .kpi-icon {
            width: 56px;
            height: 56px;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.75rem;
            flex-shrink: 0;
        }

        .kpi-error .kpi-icon {
            background: #FEE2E2;
            color: #DC2626;
        }

        .kpi-warning .kpi-icon {
            background: #FEF3C7;
            color: #D97706;
        }

        .kpi-info .kpi-icon {
            background: #DBEAFE;
            color: #2563EB;
        }

        .kpi-total .kpi-icon {
            background: #E9D5FF;
            color: #9333EA;
        }

        .kpi-content {
            flex: 1;
        }

        .kpi-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
        }

        .kpi-value {
            font-size: 2rem;
            font-weight: 900;
            color: var(--gray-900);
            line-height: 1;
        }

        /* WCAG Principles Grid */
        .principles-grid {
            margin-bottom: 2rem;
        }

        .principle-card {
            background: white;
            border-radius: 0.875rem;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 2px solid transparent;
            height: 100%;
        }

        .principle-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .principle-card.principle-perceivable {
            border-color: #DBEAFE;
        }

        .principle-card.principle-perceivable:hover {
            border-color: #93C5FD;
        }

        .principle-card.principle-operable {
            border-color: #D1FAE5;
        }

        .principle-card.principle-operable:hover {
            border-color: #6EE7B7;
        }

        .principle-card.principle-understandable {
            border-color: #FEF3C7;
        }

        .principle-card.principle-understandable:hover {
            border-color: #FCD34D;
        }

        .principle-card.principle-robust {
            border-color: #FEE2E2;
        }

        .principle-card.principle-robust:hover {
            border-color: #FCA5A5;
        }

        .principle-icon-dash {
            width: 56px;
            height: 56px;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.75rem;
            flex-shrink: 0;
        }

        .principle-perceivable .principle-icon-dash {
            background: #DBEAFE;
            color: #1E40AF;
        }

        .principle-operable .principle-icon-dash {
            background: #D1FAE5;
            color: #047857;
        }

        .principle-understandable .principle-icon-dash {
            background: #FEF3C7;
            color: #B45309;
        }

        .principle-robust .principle-icon-dash {
            background: #FEE2E2;
            color: #B91C1C;
        }

        .principle-content {
            flex: 1;
        }

        .principle-name {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
        }

        .principle-value {
            font-size: 2rem;
            font-weight: 900;
            color: var(--gray-900);
            line-height: 1;
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
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.875rem 0;
            border-bottom: 1px solid var(--gray-200);
        }

        .summary-stat:last-child {
            border-bottom: none;
        }

        .summary-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--gray-700);
        }

        .summary-value {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--gray-900);
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
        }

        .results-table thead {
            background: #E9ECEF;
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
            background: #6366F1;
            border: none;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 300;
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

        /* Principle Badge Styles */
        .principle-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.375rem 0.875rem;
            border-radius: 1.5rem;
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .principle-perceivable {
            background: #dbeafe;
            color: #1e40af;
        }

        .principle-operable {
            background: #d1fae5;
            color: #065f46;
        }

        .principle-understandable {
            background: #fef3c7;
            color: #92400e;
        }

        .principle-robust {
            background: #fee2e2;
            color: #991b1b;
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
        @media (max-width: 992px) {
            .score-circle-dash {
                width: 160px;
                height: 160px;
            }
        }

        @media (max-width: 768px) {
            .dashboard-hero {
                padding: 1.5rem;
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
                width: 140px;
                height: 140px;
            }

            .kpi-card {
                padding: 1.25rem;
            }

            .kpi-icon {
                width: 48px;
                height: 48px;
                font-size: 1.5rem;
            }

            .kpi-value {
                font-size: 1.75rem;
            }

            .principle-card {
                padding: 1.25rem;
            }

            .principle-icon-dash {
                width: 48px;
                height: 48px;
                font-size: 1.5rem;
            }

            .principle-value {
                font-size: 1.75rem;
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
                width: 120px;
                height: 120px;
            }

            .kpi-card {
                padding: 1rem;
            }

            .kpi-icon {
                width: 44px;
                height: 44px;
                font-size: 1.25rem;
            }

            .kpi-label {
                font-size: 0.75rem;
            }

            .kpi-value {
                font-size: 1.5rem;
            }

            .principle-card {
                padding: 1rem;
            }

            .principle-icon-dash {
                width: 44px;
                height: 44px;
                font-size: 1.25rem;
            }

            .principle-name {
                font-size: 0.75rem;
            }

            .principle-value {
                font-size: 1.5rem;
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
                                <a class="nav-link mx-lg-3" href="wcag.html">WCAG Guidelines</a>
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
            <div class="row align-items-center g-4">
                <!-- Left: Website Info -->
                <div class="col-lg-7">
                    <?php if ($results['source_url']): ?>
                    <div class="website-info-card">
                        <div class="website-logo-dash">
                            <?php
                            $parsedUrl = parse_url($results['source_url']);
                            $domain = $parsedUrl['host'] ?? '';
                            $faviconUrl = 'https://www.google.com/s2/favicons?domain=' . urlencode($domain) . '&sz=128';
                            ?>
                            <img src="<?php echo htmlspecialchars($faviconUrl); ?>" 
                                 alt="Website logo" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <i class="bi bi-globe" style="display: none;"></i>
                        </div>
                        <div class="website-info-text">
                            <h1 class="website-title"><?php 
                                $parsedUrl = parse_url($results['source_url']);
                                $domain = $parsedUrl['host'] ?? 'Website';
                                $domain = preg_replace('/^www\./i', '', $domain);
                                $domain = preg_replace('/\.[a-z]{2,}$/i', '', $domain);
                                $domain = ucfirst($domain);
                                echo htmlspecialchars($domain);
                            ?></h1>
                            <div class="website-meta">
                                <span class="meta-item">
                                    <i class="bi bi-link-45deg"></i>
                                    <a href="<?php echo htmlspecialchars($results['source_url']); ?>" 
                                       target="_blank" 
                                       rel="noopener noreferrer">
                                        <?php echo htmlspecialchars($results['source_url']); ?>
                                    </a>
                                </span>
                                <span class="meta-item">
                                    <i class="bi bi-calendar-check"></i>
                                    <?php echo htmlspecialchars($results['timestamp']); ?>
                                </span>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
                
                <!-- Right: Accessibility Score Circle -->
                <div class="col-lg-5">
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
                    </div>
                </div>
            </div>
        </div>

        <!-- KPI Cards Row -->
        <div class="kpi-cards-row">
            <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                    <div class="kpi-card kpi-error">
                        <div class="kpi-icon">
                            <i class="bi bi-x-circle-fill"></i>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-label">Errors</div>
                            <div class="kpi-value"><?php echo $results['summary']['error_count']; ?></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="kpi-card kpi-warning">
                        <div class="kpi-icon">
                            <i class="bi bi-exclamation-triangle-fill"></i>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-label">Warnings</div>
                            <div class="kpi-value"><?php echo $results['summary']['warning_count']; ?></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="kpi-card kpi-info">
                        <div class="kpi-icon">
                            <i class="bi bi-info-circle-fill"></i>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-label">Info</div>
                            <div class="kpi-value"><?php echo $results['summary']['info_count']; ?></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="kpi-card kpi-total">
                        <div class="kpi-icon">
                            <i class="bi bi-list-check"></i>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-label">Total Issues</div>
                            <div class="kpi-value"><?php echo $results['summary']['error_count'] + $results['summary']['warning_count'] + $results['summary']['info_count']; ?></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- WCAG Principles Grid -->
        <div class="principles-grid">
            <div class="row g-3">
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
                <div class="col-lg-3 col-md-6">
                    <div class="principle-card principle-<?php echo $principleColors[$principle]; ?>">
                        <div class="principle-icon-dash">
                            <i class="bi <?php echo $principleIcons[$principle]; ?>"></i>
                        </div>
                        <div class="principle-content">
                            <div class="principle-name"><?php echo $principle; ?></div>
                            <div class="principle-value"><?php echo $count; ?></div>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
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
                            <div class="summary-stat">
                                <span class="summary-label">Total Issues</span>
                                <span class="summary-value"><?php echo $results['summary']['error_count'] + $results['summary']['warning_count'] + $results['summary']['info_count']; ?></span>
                            </div>
                            <div class="summary-stat">
                                <span class="summary-label text-danger">
                                    <i class="bi bi-x-circle-fill me-1"></i>Errors
                                </span>
                                <span class="summary-value text-danger"><?php echo $results['summary']['error_count']; ?></span>
                            </div>
                            <div class="summary-stat">
                                <span class="summary-label text-warning">
                                    <i class="bi bi-exclamation-triangle-fill me-1"></i>Warnings
                                </span>
                                <span class="summary-value text-warning"><?php echo $results['summary']['warning_count']; ?></span>
                            </div>
                            <div class="summary-stat">
                                <span class="summary-label text-info">
                                    <i class="bi bi-info-circle-fill me-1"></i>Info
                                </span>
                                <span class="summary-value text-info"><?php echo $results['summary']['info_count']; ?></span>
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
                            <a href="wcag.html" class="btn btn-outline-primary w-100">
                                <i class="bi bi-book me-2"></i>
                                View WCAG Guidelines
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Back Button -->
        <div class="back-section">
            <a href="index.php" class="btn-back">
                <i class="bi bi-arrow-left"></i>
                Back to Scanner
            </a>
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
                        <li><a href="wcag.html#level-a" class="text-decoration-none text-muted d-block mb-2">Level A</a></li>
                        <li><a href="wcag.html#level-aa" class="text-decoration-none text-muted d-block mb-2">Level AA</a></li>
                        <li><a href="wcag.html#level-aaa" class="text-decoration-none text-muted d-block mb-2">Level AAA</a></li>
                    </ul>
                </div>
                <div class="col-md-3 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">WCAG 2.1 Principles</h6>
                    <ul class="list-unstyled small">
                        <li><a href="wcag.html#principle-perceivable" class="text-decoration-none text-muted d-block mb-2">Perceivable</a></li>
                        <li><a href="wcag.html#principle-operable" class="text-decoration-none text-muted d-block mb-2">Operable</a></li>
                        <li><a href="wcag.html#principle-understandable" class="text-decoration-none text-muted d-block mb-2">Understandable</a></li>
                        <li><a href="wcag.html#principle-robust" class="text-decoration-none text-muted d-block mb-2">Robust</a></li>
                    </ul>
                </div>
                <div class="col-md-2 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">Product</h6>
                    <ul class="list-unstyled small">
                        <li><a href="index.php" class="text-decoration-none text-muted d-block mb-2">Scanner</a></li>
                        <li><a href="wcag.html" class="text-decoration-none text-muted d-block mb-2">Guidelines</a></li>
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
