<?php
$config = include __DIR__ . '/../../config/db-config.php';
if ($config === 1) { $config = include __DIR__ . '/../../config/db-config.php'; }
$db = $config['default'];

try {
    $dsn = "mysql:host={$db['host']};dbname={$db['database']};charset={$db['charset']}";
    $pdo = new PDO($dsn, $db['username'], $db['password'], $db['options']);
    
    // Update before state
    $before_html = '<div class="ticket-shell">
  <div class="ticket-header">
    <h3>Support Queue Filters</h3>
    <span class="queue-count">23 open tickets</span>
  </div>

  <p class="toolbar-label">Filter tickets by status:</p>
  <div class="status-toolbar" aria-label="Ticket status filters">
    <div class="status-chip active" data-filter="all">All Tickets</div>
    <div class="status-chip" data-filter="open">Open</div>
    <div class="status-chip" data-filter="pending">Pending</div>
    <div class="status-chip" data-filter="resolved">Resolved</div>
  </div>
</div>';
    
    $stmt = $pdo->prepare("UPDATE wcag_examples SET html_code = ? WHERE criterion_id = '2.1.1' AND state = 'before'");
    $stmt->execute([$before_html]);
    
    // Update after state
    $after_html = '<div class="ticket-shell">
  <div class="ticket-header">
    <h3>Support Queue Filters</h3>
    <span class="queue-count">23 open tickets</span>
  </div>

  <p class="toolbar-label">Filter tickets by status:</p>
  <div class="status-toolbar" role="toolbar" aria-label="Ticket status filters">
    <button type="button" class="status-chip active" data-filter="all" aria-pressed="true">All Tickets</button>
    <button type="button" class="status-chip" data-filter="open" aria-pressed="false">Open</button>
    <button type="button" class="status-chip" data-filter="pending" aria-pressed="false">Pending</button>
    <button type="button" class="status-chip" data-filter="resolved" aria-pressed="false">Resolved</button>
  </div>
</div>';
    
    $stmt = $pdo->prepare("UPDATE wcag_examples SET html_code = ? WHERE criterion_id = '2.1.1' AND state = 'after'");
    $stmt->execute([$after_html]);
    
    echo "Updated HTML for WCAG 2.1.1 examples (removed trailing <p> tags).\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
