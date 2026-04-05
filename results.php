<?php
// results.php
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
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Scan Results - Web Accessibility Evaluator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+q2scQbITxI" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <style>
        /* Wireframe-Based Results Page - Clean & Structured */
        :root {
            --primary: #6366F1;
            --primary-dark: #4F46E5;
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

        .results-page {
            background: #F9FAFB;
            min-height: 100vh;
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
            outline: 3px solid var(--primary);
            outline-offset: 2px;
        }

        /* Main Container */
        .results-container {
            max-width: 1400px;
            margin: 6rem auto 2rem;
            padding: 2rem 1rem;
        }

        /* Top Section - Website Info + Score */
        .top-section {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .website-info {
            display: flex;
            align-items: flex-start;
            gap: 1.5rem;
        }

        .website-placeholder {
            width: 120px;
            height: 120px;
            background: var(--gray-100);
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 2px solid var(--gray-200);
        }

        .website-placeholder i {
            font-size: 3rem;
            color: var(--gray-600);
        }

        .website-details h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 0.5rem;
        }

        .website-details p {
            margin: 0.25rem 0;
            color: var(--gray-600);
            font-size: 0.9375rem;
        }

        .website-details a {
            color: var(--primary);
            text-decoration: none;
        }

        .website-details a:hover {
            text-decoration: underline;
        }

        /* Score Dashboard - Right Side */
        .score-dashboard {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
        }

        .score-circle {
            width: 160px;
            height: 160px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .score-value {
            font-size: 3rem;
            font-weight: 800;
            color: white;
            line-height: 1;
        }

        .score-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(255,255,255,0.9);
            margin-top: 0.5rem;
        }

        .issue-counts {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .count-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            background: var(--gray-50);
            border-radius: 0.5rem;
            border-left: 4px solid;
        }

        .count-item.errors {
            border-left-color: var(--danger);
        }

        .count-item.warnings {
            border-left-color: var(--warning);
        }

        .count-item.info {
            border-left-color: var(--info);
        }

        .count-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--gray-700);
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }

        .count-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gray-900);
        }

        /* WCAG Principles - Horizontal Cards */
        .principles-section {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .principles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }

        .principle-card {
            text-align: center;
            padding: 1.5rem;
            background: var(--gray-50);
            border-radius: 0.75rem;
            border: 2px solid var(--gray-200);
            transition: all 0.3s ease;
        }

        .principle-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .principle-card.perceivable {
            border-color: #3B82F6;
        }

        .principle-card.operable {
            border-color: #10B981;
        }

        .principle-card.understandable {
            border-color: #F59E0B;
        }

        .principle-card.robust {
            border-color: #EF4444;
        }

        .principle-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 1rem;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }

        .principle-card.perceivable .principle-icon {
            background: #EFF6FF;
            color: #3B82F6;
        }

        .principle-card.operable .principle-icon {
            background: #ECFDF5;
            color: #10B981;
        }

        .principle-card.understandable .principle-icon {
            background: #FFFBEB;
            color: #F59E0B;
        }

        .principle-card.robust .principle-icon {
            background: #FEF2F2;
            color: #EF4444;
        }

        .principle-name {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--gray-700);
            text-transform: uppercase;
            letter-spacing: 0.025em;
            margin-bottom: 0.5rem;
        }

        .principle-count {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gray-900);
        }

        /* Unified Issues Section - Full Width */
        .issues-section {
            background: white;
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-md);
            overflow: hidden;
            border: 1px solid var(--gray-200);
            margin-bottom: 2.5rem;
        }

        .issues-header {
            padding: 2rem;
            border-bottom: 2px solid var(--gray-100);
            background: linear-gradient(to bottom, #FAFBFC 0%, #FFFFFF 100%);
        }

        .issues-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gray-900);
            margin-bottom: 0.625rem;
            letter-spacing: -0.01em;
        }

        .issues-subtitle {
            font-size: 0.9375rem;
            color: var(--gray-600);
            font-weight: 500;
            margin-bottom: 1.25rem;
        }

        .issues-stats {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1.25rem;
        }

        .stat-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--gray-700);
        }

        .stat-pill i {
            font-size: 1rem;
        }

        .stat-pill.stat-total {
            background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
            border-color: var(--info);
            color: var(--info);
        }

        .stat-pill.stat-error {
            background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
            border-color: var(--danger);
            color: var(--danger);
        }

        .stat-pill.stat-warning {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border-color: var(--warning);
            color: var(--warning);
        }

        .stat-pill.stat-info {
            background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
            border-color: var(--info);
            color: var(--info);
        }

        /* Filter Pills - Modern Tab Style */
        .filter-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.625rem;
            margin-top: 1.25rem;
        }

        .filter-pill {
            padding: 0.625rem 1.25rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            border: 2px solid var(--gray-200);
            background: white;
            color: var(--gray-700);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .filter-pill::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(99, 102, 241, 0.1);
            transform: translate(-50%, -50%);
            transition: width 0.4s, height 0.4s;
        }

        .filter-pill:hover::before {
            width: 200px;
            height: 200px;
        }

        .filter-pill:hover {
            border-color: var(--primary);
            color: var(--primary);
            transform: translateY(-2px);
            box-shadow: var(--shadow-sm);
        }

        .filter-pill.active {
            background: var(--primary);
            border-color: var(--primary);
            color: white;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .filter-pill.filter-error.active {
            background: var(--danger);
            border-color: var(--danger);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .filter-pill.filter-warning.active {
            background: var(--warning);
            border-color: var(--warning);
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .filter-pill.filter-info.active {
            background: var(--info);
            border-color: var(--info);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Enhanced Table Design */
        .issues-table-wrapper {
            overflow-x: auto;
        }

        .issues-table {
            width: 100%;
            border-collapse: collapse;
        }

        .issues-table thead {
            background: linear-gradient(180deg, #F8F9FA 0%, #E9ECEF 100%);
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .issues-table th {
            padding: 1.25rem 1rem;
            text-align: left;
            font-size: 0.8125rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--gray-700);
            border-bottom: 2px solid var(--gray-300);
            white-space: nowrap;
        }

        .issues-table td {
            padding: 1.25rem 1rem;
            border-bottom: 1px solid var(--gray-200);
            font-size: 0.875rem;
            color: var(--gray-700);
            vertical-align: top;
        }

        .issues-table tbody tr {
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .issues-table tbody tr:hover {
            background: linear-gradient(to right, #F0F7FF 0%, #FFFFFF 100%);
            box-shadow: inset 4px 0 0 var(--primary);
        }

        .issues-table tbody tr.active {
            background: linear-gradient(to right, #F0F7FF 0%, #FFFFFF 100%);
            box-shadow: inset 4px 0 0 var(--primary);
        }

        .issues-table tbody tr:nth-child(odd) {
            background: #FFFFFF;
        }

        .issues-table tbody tr:nth-child(even) {
            background: #FCFDFF;
        }

        .issues-table tbody tr:hover:nth-child(odd),
        .issues-table tbody tr:hover:nth-child(even) {
            background: linear-gradient(to right, #F0F7FF 0%, #FFFFFF 100%);
        }

        /* Expandable Row Details */
        .issue-row-details {
            display: none;
        }

        .issue-row-details.active {
            display: table-row;
        }

        .issue-row-details td {
            padding: 1.5rem;
            background: linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%);
            border-bottom: 2px solid var(--gray-200);
        }

        .detail-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.25rem;
        }

        @media (min-width: 768px) {
            .detail-grid {
                grid-template-columns: 1fr 1fr;
            }
        }

        .detail-box {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-lg);
            padding: 1.25rem;
        }

        .detail-box-title {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--gray-600);
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.375rem;
        }

        .detail-box-content {
            font-size: 0.875rem;
            line-height: 1.6;
            color: var(--gray-700);
        }

        .detail-box.recommendation {
            grid-column: 1 / -1;
            background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
            border-color: var(--success);
        }

        .detail-box.recommendation .detail-box-title {
            color: var(--success);
        }

        /* Expand/Collapse Icon */
        .expand-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--gray-100);
            color: var(--gray-600);
            transition: all 0.3s ease;
            font-size: 0.875rem;
        }

        .issues-table tbody tr:hover .expand-icon {
            background: var(--primary);
            color: white;
        }

        .issues-table tbody tr.active .expand-icon {
            background: var(--primary);
            color: white;
            transform: rotate(180deg);
        }

        /* Filter Status */
        .filter-status {
            padding: 0.875rem 1.25rem;
            background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
            border-left: 4px solid var(--info);
            border-radius: var(--radius);
            font-size: 0.875rem;
            color: var(--gray-700);
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 1.5rem 2rem;
        }

        .filter-status::before {
            content: '\f05a';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            color: var(--info);
            font-size: 1rem;
        }

        /* Badge Styles */
        .badge-modern {
            padding: 0.3125rem 0.875rem;
            border-radius: var(--radius);
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            display: inline-block;
        }

        .badge-error {
            background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
            color: #991B1B;
            border: 1px solid #FCA5A5;
        }

        .badge-warning {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            color: #92400E;
            border: 1px solid #FCD34D;
        }

        .badge-info {
            background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
            color: #1E40AF;
            border: 1px solid #93C5FD;
        }

        .badge-wcag {
            background: var(--gray-100);
            color: var(--gray-700);
            border: 1px solid var(--gray-300);
        }

        .badge-principle {
            background: var(--gray-100);
            color: var(--gray-700);
        }

        .severity-badge {
            padding: 0.3125rem 0.875rem;
            border-radius: var(--radius);
            font-size: 0.75rem;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }

        .severity-high {
            background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
            color: #991B1B;
            border: 1px solid #FCA5A5;
        }

        .severity-medium {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            color: #92400E;
            border: 1px solid #FCD34D;
        }

        .severity-low {
            background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
            color: #1E40AF;
            border: 1px solid #93C5FD;
        }

        .line-badge {
            background: linear-gradient(135deg, #EEF3FB 0%, #DCE7F7 100%);
            color: #23395D;
            border: 1px solid #B9C7DF;
            padding: 0.3125rem 0.875rem;
            border-radius: var(--radius);
            font-size: 0.75rem;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
        }

        .code-snippet {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: var(--radius);
            padding: 1rem;
            font-family: 'Courier New', 'Consolas', monospace;
            font-size: 0.8125rem;
            color: var(--gray-700);
            overflow-x: auto;
            white-space: pre-wrap;
            word-break: break-word;
        }

        /* No Issues State */
        .no-issues-state {
            text-align: center;
            padding: 4rem 2rem;
        }

        .no-issues-state i {
            font-size: 4rem;
            color: var(--success);
            margin-bottom: 1.5rem;
        }

        .no-issues-state h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--success);
            margin-bottom: 0.75rem;
        }

        .no-issues-state p {
            font-size: 1rem;
            color: var(--gray-600);
        }

        /* Preview Panel - Right Column (60%) - Browser-like */
        .preview-panel {
            background: white;
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-md);
            overflow: hidden;
            height: fit-content;
            position: sticky;
            top: 1.5rem;
            border: 1px solid var(--gray-200);
        }

        .preview-header {
            padding: 1.5rem 2rem;
            border-bottom: 2px solid var(--gray-100);
            background: linear-gradient(to bottom, #FAFBFC 0%, #FFFFFF 100%);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .preview-title {
            font-size: 1.375rem;
            font-weight: 700;
            color: var(--gray-900);
            letter-spacing: -0.01em;
        }

        .preview-badge {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            padding: 0.375rem 1rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .preview-body {
            padding: 2rem;
        }

        .preview-wrapper {
            border-radius: var(--radius-lg);
            overflow: hidden;
            border: 2px solid var(--gray-200);
            background: white;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
            position: relative;
        }

        .preview-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 32px;
            background: linear-gradient(to bottom, var(--gray-100) 0%, var(--gray-50) 100%);
            border-bottom: 1px solid var(--gray-200);
            z-index: 1;
        }

        #previewFrame {
            width: 100%;
            height: 650px;
            border: none;
            display: block;
            margin-top: 32px;
        }

        .preview-tip {
            margin-top: 1.5rem;
            padding: 1rem 1.25rem;
            background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
            border-left: 4px solid var(--info);
            border-radius: var(--radius-lg);
            font-size: 0.875rem;
            color: var(--gray-700);
            line-height: 1.6;
            position: relative;
            padding-left: 3.5rem;
        }

        .preview-tip::before {
            content: '\f0eb';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            left: 1.25rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.5rem;
            color: var(--info);
        }

        .preview-tip strong {
            font-weight: 600;
            color: var(--gray-900);
        }

        /* Highlight Animation */
        .highlight-element {
            outline: 3px solid #EF4444 !important;
            background-color: rgba(239, 68, 68, 0.1) !important;
            transition: all 0.3s ease;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { 
                opacity: 1;
                transform: scale(1);
            }
            50% { 
                opacity: 0.8;
                transform: scale(1.02);
            }
        }

        /* Back Button - Centered */
        .back-section {
            text-align: center;
            padding: 2.5rem 0;
        }

        .btn-back {
            display: inline-flex;
            align-items: center;
            gap: 0.625rem;
            padding: 1rem 2.5rem;
            background: white;
            color: var(--gray-700);
            border: 2px solid var(--gray-300);
            border-radius: var(--radius-lg);
            font-weight: 600;
            font-size: 1rem;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--shadow-sm);
        }

        .btn-back:hover {
            background: var(--gray-50);
            border-color: var(--primary);
            color: var(--primary);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        .btn-back:active {
            transform: translateY(0);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .results-info-bar {
                margin-top: 4rem;
                padding: 1rem 0;
            }

            .info-item {
                font-size: 0.8125rem;
                flex-direction: column;
                align-items: flex-start;
                gap: 0.375rem;
            }

            .score-dashboard {
                padding: 2rem 1.5rem;
            }

            .score-main {
                gap: 2rem;
            }

            .score-circle {
                width: 140px;
                height: 140px;
            }

            .score-value {
                font-size: 2.75rem;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }

            .stat-card {
                padding: 1.25rem;
            }

            .stat-icon {
                font-size: 2rem;
            }

            .stat-value {
                font-size: 2rem;
            }

            .principles-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }

            .principle-card {
                padding: 1.25rem;
            }

            .principle-icon {
                width: 56px;
                height: 56px;
                font-size: 1.5rem;
            }

            .principle-count {
                font-size: 1.875rem;
            }

            .content-layout {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            .preview-panel {
                position: static;
            }

            #previewFrame {
                height: 450px;
            }

            .panel-header,
            .preview-header,
            .report-header {
                padding: 1.25rem;
            }

            .panel-title,
            .preview-title,
            .report-title {
                font-size: 1.125rem;
            }

            .issue-list {
                padding: 1rem;
            }

            .issue-card {
                padding: 1rem;
            }

            .preview-body {
                padding: 1.25rem;
            }

            .filter-pills {
                gap: 0.5rem;
            }

            .filter-pill {
                padding: 0.5rem 1rem;
                font-size: 0.8125rem;
            }
        }

        @media (max-width: 480px) {
            .results-container {
                padding: 1.5rem 1rem;
            }

            .score-dashboard {
                padding: 1.5rem 1rem;
            }

            .score-circle {
                width: 120px;
                height: 120px;
            }

            .score-value {
                font-size: 2.25rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .btn-back {
                padding: 0.875rem 2rem;
                font-size: 0.9375rem;
            }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation: none !important;
                transition: none !important;
            }
        }

        /* Print Styles */
        @media print {
            .results-info-bar,
            .filter-pills,
            .preview-panel,
            .back-section,
            header,
            footer {
                display: none !important;
            }

            .content-layout {
                grid-template-columns: 1fr;
            }

            .issue-details {
                display: block !important;
            }

            .score-dashboard {
                background: white !important;
                color: black !important;
                border: 2px solid var(--gray-300);
            }

            .score-circle {
                border-color: var(--gray-300) !important;
                background: white !important;
            }

            .stat-card {
                border: 1px solid var(--gray-300);
                background: white !important;
            }
        }

        /* Enhanced Severity Badges with Icons */
    </style>
</head>
<body class="results-page">
    <a class="skip-link" href="#resultsMain">Skip to results content</a>
    <header>
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php"><img src="logo.png" alt="Logo" width="60" height="60" class="mx-5 me-3">Web Accessibility Evaluator</a>
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
    
    <main id="resultsMain" class="container results-shell" tabindex="-1">
        <!-- Page Header - Clean Top Bar -->
        <div class="results-info-bar">
            <div class="container">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="info-item">
                            <i class="bi bi-calendar" aria-hidden="true"></i>
                            <span><strong>Scanned:</strong> <?php echo htmlspecialchars($results['timestamp']); ?></span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <?php if ($results['source_url']): ?>
                            <div class="info-item">
                                <i class="bi bi-link-45deg" aria-hidden="true"></i>
                                <span><strong>URL:</strong> <a href="<?php echo htmlspecialchars($results['source_url']); ?>" target="_blank" rel="noopener noreferrer"><?php echo htmlspecialchars($results['source_url']); ?></a></span>
                            </div>
                        <?php else: ?>
                            <div class="info-item">
                                <i class="bi bi-code-slash" aria-hidden="true"></i>
                                <span><strong>Mode:</strong> HTML Code Analysis</span>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <div class="results-container">
        <div class="results-container">
        
        <!-- Accessibility Score Dashboard - Hero Section -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="score-dashboard">
                    <?php
                    $totalPossible = 50;
                    $deductions = min($results['summary']['error_count'] * 5 + $results['summary']['warning_count'] * 2, 45);
                    $score = max($totalPossible - $deductions, 0);
                    $percentage = ($score / $totalPossible) * 100;
                    ?>
                    <div class="score-main">
                        <div class="score-circle-wrapper">
                            <div class="score-circle">
                                <div class="score-value"><?php echo round($percentage); ?>%</div>
                                <div class="score-label">Accessibility Score</div>
                            </div>
                        </div>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="bi bi-exclamation-circle-fill"></i>
                                </div>
                                <div class="stat-value"><?php echo $results['summary']['total_issues']; ?></div>
                                <div class="stat-label">Total Issues</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="bi bi-x-circle-fill"></i>
                                </div>
                                <div class="stat-value"><?php echo $results['summary']['error_count']; ?></div>
                                <div class="stat-label">Errors</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="bi bi-exclamation-triangle-fill"></i>
                                </div>
                                <div class="stat-value"><?php echo $results['summary']['warning_count']; ?></div>
                                <div class="stat-label">Warnings</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="bi bi-info-circle-fill"></i>
                                </div>
                                <div class="stat-value"><?php echo $results['summary']['info_count']; ?></div>
                                <div class="stat-label">Info</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- WCAG Principles Breakdown - Horizontal Cards -->
        <div class="principles-grid">
            <?php foreach ($results['summary']['principles'] as $principle => $count): ?>
            <div class="principle-card <?php echo strtolower($principle); ?>">
                <div class="principle-icon">
                    <i class="bi 
                        <?php 
                        switch($principle) {
                            case 'Perceivable': echo 'bi-eye-fill'; break;
                            case 'Operable': echo 'bi-mouse-fill'; break;
                            case 'Understandable': echo 'bi-lightbulb-fill'; break;
                            case 'Robust': echo 'bi-cpu-fill'; break;
                        }
                        ?>">
                    </i>
                </div>
                <div class="principle-content">
                    <div class="principle-count"><?php echo $count; ?></div>
                    <div class="principle-name"><?php echo $principle; ?></div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        
        <!-- Unified Issues Section with Table -->
        <div class="issues-section">
            <div class="issues-header">
                <h2 class="issues-title">Accessibility Issues Report</h2>
                <p class="issues-subtitle">Click any row to expand details and view recommendations</p>
                
                <!-- Stats Pills -->
                <div class="issues-stats">
                    <div class="stat-pill stat-total">
                        <i class="bi bi-exclamation-circle-fill"></i>
                        <span><?php echo $results['summary']['total_issues']; ?> Total Issues</span>
                    </div>
                    <div class="stat-pill stat-error">
                        <i class="bi bi-x-circle-fill"></i>
                        <span><?php echo $results['summary']['error_count']; ?> Errors</span>
                    </div>
                    <div class="stat-pill stat-warning">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <span><?php echo $results['summary']['warning_count']; ?> Warnings</span>
                    </div>
                    <div class="stat-pill stat-info">
                        <i class="bi bi-info-circle-fill"></i>
                        <span><?php echo $results['summary']['info_count']; ?> Info</span>
                    </div>
                </div>
                
                <!-- Filter Pills -->
                <div class="filter-pills" role="group" aria-label="Filter issues">
                    <button type="button" class="filter-pill active" data-filter="all" aria-pressed="true">
                        All (<?php echo $results['summary']['total_issues']; ?>)
                    </button>
                    <button type="button" class="filter-pill filter-error" data-filter="error" aria-pressed="false">
                        Errors (<?php echo $results['summary']['error_count']; ?>)
                    </button>
                    <button type="button" class="filter-pill filter-warning" data-filter="warning" aria-pressed="false">
                        Warnings (<?php echo $results['summary']['warning_count']; ?>)
                    </button>
                    <button type="button" class="filter-pill filter-info" data-filter="info" aria-pressed="false">
                        Info (<?php echo $results['summary']['info_count']; ?>)
                    </button>
                </div>
            </div>
            
            <p class="filter-status" id="filterStatus" aria-live="polite"></p>
            
            <?php if (empty($results['issues'])): ?>
                <div class="no-issues-state">
                    <i class="bi bi-check-circle-fill"></i>
                    <h3>No Issues Found!</h3>
                    <p>Great job! Your page meets basic accessibility guidelines.</p>
                </div>
            <?php else: ?>
                <div class="issues-table-wrapper">
                    <table class="issues-table">
                        <caption class="visually-hidden">Detailed listing of all detected accessibility issues including WCAG reference, principle, recommendation, and severity.</caption>
                        <thead>
                            <tr>
                                <th scope="col" style="width: 5%;"></th>
                                <th scope="col" style="width: 12%;">Type</th>
                                <th scope="col" style="width: 12%;">WCAG</th>
                                <?php if (!$results['source_url']): ?>
                                <th scope="col" style="width: 10%;">Line</th>
                                <?php endif; ?>
                                <th scope="col" style="width: 15%;">Principle</th>
                                <th scope="col" style="width: <?php echo $results['source_url'] ? '44%' : '34%'; ?>;">Issue</th>
                                <th scope="col" style="width: 12%;">Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($results['issues'] as $index => $issue): ?>
                            <tr class="issue-row" 
                                data-index="<?php echo $index; ?>"
                                data-type="<?php echo $issue['type']; ?>"
                                id="issue-<?php echo $index; ?>"
                                role="button"
                                tabindex="0"
                                aria-expanded="false"
                                aria-controls="issue-details-<?php echo $index; ?>">
                                <td>
                                    <span class="expand-icon">
                                        <i class="bi bi-chevron-down"></i>
                                    </span>
                                </td>
                                <td>
                                    <span class="badge-modern <?php 
                                        echo $issue['type'] === 'error' ? 'badge-error' : 
                                             ($issue['type'] === 'warning' ? 'badge-warning' : 'badge-info'); 
                                    ?>">
                                        <?php echo ucfirst($issue['type']); ?>
                                    </span>
                                </td>
                                <td><code><?php echo $issue['code']; ?></code></td>
                                <?php if (!$results['source_url']): ?>
                                <td>
                                    <?php if (!empty($issue['line'])): ?>
                                        <span class="line-badge">
                                            <i class="bi bi-code-slash"></i><?php echo intval($issue['line']); ?>
                                        </span>
                                    <?php else: ?>
                                        <span class="text-muted">N/A</span>
                                    <?php endif; ?>
                                </td>
                                <?php endif; ?>
                                <td>
                                    <span class="badge-modern badge-principle">
                                        <?php echo $issue['principle']; ?>
                                    </span>
                                </td>
                                <td>
                                    <strong><?php echo htmlspecialchars($issue['title']); ?></strong>
                                    <div class="small text-muted mt-1"><?php echo htmlspecialchars($issue['description']); ?></div>
                                </td>
                                <td>
                                    <span class="severity-badge severity-<?php echo $issue['severity']; ?>">
                                        <i class="bi bi-<?php 
                                            echo $issue['severity'] === 'high' ? 'exclamation-triangle-fill' : 
                                                 ($issue['severity'] === 'medium' ? 'exclamation-circle-fill' : 'info-circle-fill'); 
                                        ?>"></i>
                                        <?php echo ucfirst($issue['severity']); ?>
                                    </span>
                                </td>
                            </tr>
                            <tr class="issue-row-details" id="issue-details-<?php echo $index; ?>" data-type="<?php echo $issue['type']; ?>">
                                <td colspan="<?php echo $results['source_url'] ? '6' : '7'; ?>">
                                    <div class="detail-grid">
                                        <?php if (!empty($issue['element'])): ?>
                                        <div class="detail-box">
                                            <div class="detail-box-title">
                                                <i class="bi bi-code"></i>HTML Element
                                            </div>
                                            <div class="detail-box-content">
                                                <pre class="code-snippet"><code><?php echo htmlspecialchars($issue['element']); ?></code></pre>
                                            </div>
                                        </div>
                                        <?php endif; ?>
                                        
                                        <?php if (!$results['source_url'] && !empty($issue['line'])): ?>
                                        <div class="detail-box">
                                            <div class="detail-box-title">
                                                <i class="bi bi-file-code"></i>Location
                                            </div>
                                            <div class="detail-box-content">
                                                <span class="line-badge">
                                                    <i class="bi bi-code-slash"></i>Line <?php echo intval($issue['line']); ?>
                                                </span>
                                                <p class="small text-muted mt-2 mb-0">This issue was found at line <?php echo intval($issue['line']); ?> in your HTML code.</p>
                                            </div>
                                        </div>
                                        <?php endif; ?>
                                        
                                        <div class="detail-box">
                                            <div class="detail-box-title">
                                                <i class="bi bi-info-circle"></i>Description
                                            </div>
                                            <div class="detail-box-content">
                                                <?php echo htmlspecialchars($issue['description']); ?>
                                            </div>
                                        </div>
                                        
                                        <div class="detail-box recommendation">
                                            <div class="detail-box-title">
                                                <i class="bi bi-lightbulb"></i>How to Fix
                                            </div>
                                            <div class="detail-box-content">
                                                <?php echo htmlspecialchars($issue['recommendation']); ?>
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

        <!-- Preview Panel (Always Displayed at Bottom) -->
        <?php if (!empty($results['issues'])): ?>
        <div class="preview-panel">
            <div class="preview-header">
                <h2 class="preview-title">Page Preview</h2>
                <span class="preview-badge">
                    <i class="bi bi-eye"></i>Live
                </span>
            </div>
            <div class="preview-body">
                <div class="preview-wrapper">
                    <?php if ($results['source_url']): ?>
                        <iframe id="previewFrame" 
                                src="<?php echo htmlspecialchars($results['source_url']); ?>" 
                                frameborder="0"
                                title="Website preview"
                                data-preview="url"></iframe>
                    <?php else: ?>
                        <iframe id="previewFrame"
                                srcdoc="<?php echo htmlspecialchars($results['html_content'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8', false); ?>"
                                sandbox="allow-same-origin"
                                frameborder="0"
                                title="HTML preview"
                                data-preview="inline"></iframe>
                    <?php endif; ?>
                </div>
                <div class="preview-tip">
                    <strong>Tip:</strong> Click on any issue row in the table above to highlight the corresponding element in this preview.
                </div>
            </div>
        </div>
        <?php endif; ?>
        
        <!-- Back Button -->
        <div class="back-section">
            <a href="index.php" class="btn-back">
                <i class="bi bi-arrow-left"></i>Back to Scanner
            </a>
        </div>
        
        </div><!-- End results-container -->
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
    
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const filterStatus = document.getElementById('filterStatus');
        const issueRows = document.querySelectorAll('.issue-row');
        const issueDetailRows = document.querySelectorAll('.issue-row-details');
        const filterButtons = document.querySelectorAll('.filter-pill');

        function updateFilterStatus(activeFilter) {
            const visibleRows = Array.from(issueRows).filter(row => row.style.display !== 'none');
            const filterLabel = activeFilter === 'all' ? 'all issue types' : activeFilter + ' issues';

            if (filterStatus) {
                filterStatus.textContent = visibleRows.length + ' issue(s) shown for ' + filterLabel + '.';
            }
        }

        // Filter issues
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                
                // Filter table rows
                issueRows.forEach((row, index) => {
                    const detailRow = issueDetailRows[index];
                    if (filter === 'all') {
                        row.style.display = '';
                        if (detailRow) detailRow.style.display = '';
                    } else {
                        if (row.dataset.type === filter) {
                            row.style.display = '';
                            if (detailRow) detailRow.style.display = '';
                        } else {
                            row.style.display = 'none';
                            if (detailRow) {
                                detailRow.style.display = 'none';
                                detailRow.classList.remove('active');
                            }
                            row.classList.remove('active');
                            row.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                updateFilterStatus(filter);
            });
        });
        
        // Toggle row details when clicking on row
        issueRows.forEach((row, index) => {
            row.addEventListener('click', function(e) {
                const detailRow = issueDetailRows[index];
                const isExpanded = this.classList.contains('active');
                
                // Close all other rows
                issueRows.forEach((r, i) => {
                    if (r !== this) {
                        r.classList.remove('active');
                        r.setAttribute('aria-expanded', 'false');
                        if (issueDetailRows[i]) {
                            issueDetailRows[i].classList.remove('active');
                        }
                    }
                });
                
                // Toggle current row
                if (isExpanded) {
                    this.classList.remove('active');
                    this.setAttribute('aria-expanded', 'false');
                    if (detailRow) {
                        detailRow.classList.remove('active');
                    }
                } else {
                    this.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                    if (detailRow) {
                        detailRow.classList.add('active');
                    }
                    
                    // Scroll into view
                    this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Highlight element in preview
                    const issueIndex = this.dataset.index;
                    highlightElement(issueIndex);
                }
            });

            row.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.click();
                }
            });
        });
        
        function getInlinePreviewDocument() {
            const previewFrame = document.getElementById('previewFrame');
            if (!previewFrame || previewFrame.dataset.preview !== 'inline') {
                return null;
            }

            try {
                return previewFrame.contentDocument || previewFrame.contentWindow.document;
            } catch (error) {
                return null;
            }
        }

        function ensureHighlightStyles(previewDoc) {
            if (!previewDoc || previewDoc.getElementById('issue-highlight-style')) {
                return;
            }

            const style = previewDoc.createElement('style');
            style.id = 'issue-highlight-style';
            style.textContent = '.highlight-element { outline: 3px solid #EF4444 !important; background-color: rgba(239, 68, 68, 0.1) !important; transition: all 0.3s ease; animation: pulse 2s ease-in-out infinite; } @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.02); } }';
            (previewDoc.head || previewDoc.documentElement).appendChild(style);
        }

        function highlightElement(index) {
            const previewDoc = getInlinePreviewDocument();
            if (!previewDoc || !previewDoc.body) {
                return;
            }

            ensureHighlightStyles(previewDoc);

            // Remove previous highlights
            previewDoc.querySelectorAll('.highlight-element').forEach(el => {
                el.classList.remove('highlight-element');
            });
            
            // In a real implementation, you would have a mapping between
            // issues and DOM elements. This is a simplified version.
            const elements = previewDoc.body.querySelectorAll('*');
            if (elements.length > index) {
                elements[index].classList.add('highlight-element');
                elements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        updateFilterStatus('all');
    });
    </script>
</body>
</html>


