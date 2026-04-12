<?php
/**
 * Scan Results Database Handler
 * Manages storing and retrieving accessibility scan results from database
 */

class ScanResultsDB
{
    private $conn;

    public function __construct($dbConnection)
    {
        $this->conn = $dbConnection;
    }

    /**
     * Save scan results to database
     * @param array $results The scan results array
     * @return bool Success status
     */
    public function saveScanResults($results)
    {
        try {
            $this->conn->beginTransaction();

            // Use the score already calculated in scan.php
            $score = isset($results['score']) ? $results['score'] : 0;

            // Insert scan results
            $stmt = $this->conn->prepare("
                INSERT INTO scan_results (
                    scan_id, scan_type, source_url, html_content, timestamp,
                    total_issues, error_count, warning_count, info_count,
                    perceivable_count, operable_count, understandable_count, robust_count,
                    accessibility_score
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $results['scan_id'],
                $results['scan_type'],
                $results['source_url'] ?? null,
                $results['html_content'] ?? null,
                $results['timestamp'],
                $results['summary']['total_issues'],
                $results['summary']['error_count'],
                $results['summary']['warning_count'],
                $results['summary']['info_count'],
                $results['summary']['principles']['Perceivable'],
                $results['summary']['principles']['Operable'],
                $results['summary']['principles']['Understandable'],
                $results['summary']['principles']['Robust'],
                $score
            ]);

            // Insert issues
            if (!empty($results['issues'])) {
                $issueStmt = $this->conn->prepare("
                    INSERT INTO scan_issues (
                        scan_id, code, principle, type, title, description,
                        element, selector, recommendation, severity, line_number, context
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");

                foreach ($results['issues'] as $issue) {
                    $issueStmt->execute([
                        $results['scan_id'],
                        $issue['code'],
                        $issue['principle'],
                        $issue['type'],
                        $issue['title'],
                        $issue['description'] ?? null,
                        $issue['element'] ?? null,
                        $issue['selector'] ?? null,
                        $issue['recommendation'] ?? null,
                        $issue['severity'],
                        $issue['line'] ?? null,
                        $issue['context'] ?? null
                    ]);
                }
            }

            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            $this->conn->rollBack();
            error_log("Error saving scan results: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get scan results by scan ID
     * @param string $scanId The scan ID
     * @return array|null The scan results or null if not found
     */
    public function getScanResults($scanId)
    {
        try {
            // Get scan metadata
            $stmt = $this->conn->prepare("SELECT * FROM scan_results WHERE scan_id = ?");
            $stmt->execute([$scanId]);
            $scan = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$scan) {
                return null;
            }

            // Get issues
            $issueStmt = $this->conn->prepare("
                SELECT * FROM scan_issues WHERE scan_id = ? ORDER BY id
            ");
            $issueStmt->execute([$scanId]);
            $issues = $issueStmt->fetchAll(PDO::FETCH_ASSOC);

            // Format as original structure
            return [
                'scan_id' => $scan['scan_id'],
                'scan_type' => $scan['scan_type'],
                'source_url' => $scan['source_url'],
                'html_content' => $scan['html_content'],
                'timestamp' => $scan['timestamp'],
                'issues' => array_map(function($issue) {
                    return [
                        'code' => $issue['code'],
                        'principle' => $issue['principle'],
                        'type' => $issue['type'],
                        'title' => $issue['title'],
                        'description' => $issue['description'],
                        'element' => $issue['element'],
                        'selector' => $issue['selector'],
                        'recommendation' => $issue['recommendation'],
                        'severity' => $issue['severity'],
                        'line' => $issue['line_number'],
                        'context' => $issue['context']
                    ];
                }, $issues),
                'summary' => [
                    'total_issues' => (int)$scan['total_issues'],
                    'error_count' => (int)$scan['error_count'],
                    'warning_count' => (int)$scan['warning_count'],
                    'info_count' => (int)$scan['info_count'],
                    'principles' => [
                        'Perceivable' => (int)$scan['perceivable_count'],
                        'Operable' => (int)$scan['operable_count'],
                        'Understandable' => (int)$scan['understandable_count'],
                        'Robust' => (int)$scan['robust_count']
                    ]
                ]
            ];

        } catch (Exception $e) {
            error_log("Error retrieving scan results: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get recent scans with pagination
     * @param int $limit Number of results
     * @param int $offset Offset for pagination
     * @return array List of scan summaries
     */
    public function getRecentScans($limit = 20, $offset = 0)
    {
        try {
            $stmt = $this->conn->prepare("
                SELECT scan_id, scan_type, source_url, timestamp,
                       total_issues, error_count, warning_count, info_count,
                       accessibility_score
                FROM scan_results
                ORDER BY timestamp DESC
                LIMIT ? OFFSET ?
            ");
            $stmt->execute([$limit, $offset]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (Exception $e) {
            error_log("Error retrieving recent scans: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Delete old scan results
     * @param int $daysOld Delete scans older than this many days
     * @return int Number of deleted scans
     */
    public function deleteOldScans($daysOld = 30)
    {
        try {
            $stmt = $this->conn->prepare("
                DELETE FROM scan_results
                WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
            ");
            $stmt->execute([$daysOld]);
            return $stmt->rowCount();

        } catch (Exception $e) {
            error_log("Error deleting old scans: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get statistics for all scans
     * @return array Statistics summary
     */
    public function getStatistics()
    {
        try {
            $stmt = $this->conn->query("
                SELECT 
                    COUNT(*) as total_scans,
                    AVG(accessibility_score) as avg_score,
                    SUM(total_issues) as total_issues,
                    SUM(error_count) as total_errors,
                    SUM(warning_count) as total_warnings
                FROM scan_results
            ");
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (Exception $e) {
            error_log("Error retrieving statistics: " . $e->getMessage());
            return null;
        }
    }
}
