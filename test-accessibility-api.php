<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Accessibility Checks API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #007bff;
        }
        .stat-card h3 {
            margin: 0 0 5px 0;
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
        }
        .stat-card .value {
            font-size: 32px;
            font-weight: bold;
            color: #333;
        }
        .filters {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        .filters label {
            margin-right: 15px;
        }
        .filters select, .filters button {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 10px;
        }
        .filters button {
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }
        .filters button:hover {
            background: #0056b3;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-error { background: #fee; color: #c00; }
        .badge-warning { background: #ffc; color: #860; }
        .badge-info { background: #e7f3ff; color: #0066cc; }
        .badge-high { background: #fee; color: #c00; }
        .badge-medium { background: #ffc; color: #860; }
        .badge-low { background: #e7f3ff; color: #0066cc; }
        .principle {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            background: #e9ecef;
            color: #495057;
        }
        .error {
            background: #fee;
            color: #c00;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Accessibility Checks API Test</h1>
        <p class="subtitle">Testing the database-driven accessibility checks system</p>
        
        <div id="stats" class="stats"></div>
        
        <div class="filters">
            <label>
                Principle:
                <select id="principleFilter">
                    <option value="">All Principles</option>
                    <option value="Perceivable">Perceivable</option>
                    <option value="Operable">Operable</option>
                    <option value="Understandable">Understandable</option>
                    <option value="Robust">Robust</option>
                </select>
            </label>
            
            <label>
                Enabled:
                <select id="enabledFilter">
                    <option value="true">Enabled Only</option>
                    <option value="false">Disabled Only</option>
                    <option value="">All</option>
                </select>
            </label>
            
            <button onclick="loadChecks()">Apply Filters</button>
            <button onclick="resetFilters()">Reset</button>
        </div>
        
        <div id="content">
            <div class="loading">Loading checks...</div>
        </div>
    </div>
    
    <script>
        async function loadChecks() {
            const principle = document.getElementById('principleFilter').value;
            const enabled = document.getElementById('enabledFilter').value;
            
            let url = 'api/get-accessibility-checks.php?';
            if (principle) url += `principle=${principle}&`;
            if (enabled) url += `enabled=${enabled}&`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    displayStats(data);
                    displayChecks(data.checks);
                } else {
                    displayError(data.error || 'Unknown error occurred');
                }
            } catch (error) {
                displayError('Failed to fetch checks: ' + error.message);
            }
        }
        
        function displayStats(data) {
            const stats = {
                total: data.count,
                perceivable: data.checks.filter(c => c.principle === 'Perceivable').length,
                operable: data.checks.filter(c => c.principle === 'Operable').length,
                understandable: data.checks.filter(c => c.principle === 'Understandable').length,
                robust: data.checks.filter(c => c.principle === 'Robust').length
            };
            
            document.getElementById('stats').innerHTML = `
                <div class="stat-card">
                    <h3>Total Checks</h3>
                    <div class="value">${stats.total}</div>
                </div>
                <div class="stat-card">
                    <h3>Perceivable</h3>
                    <div class="value">${stats.perceivable}</div>
                </div>
                <div class="stat-card">
                    <h3>Operable</h3>
                    <div class="value">${stats.operable}</div>
                </div>
                <div class="stat-card">
                    <h3>Understandable</h3>
                    <div class="value">${stats.understandable}</div>
                </div>
                <div class="stat-card">
                    <h3>Robust</h3>
                    <div class="value">${stats.robust}</div>
                </div>
            `;
        }
        
        function displayChecks(checks) {
            if (checks.length === 0) {
                document.getElementById('content').innerHTML = '<p>No checks found matching the filters.</p>';
                return;
            }
            
            let html = `
                <table>
                    <thead>
                        <tr>
                            <th>Check Key</th>
                            <th>WCAG</th>
                            <th>Title</th>
                            <th>Principle</th>
                            <th>Type</th>
                            <th>Severity</th>
                            <th>Priority</th>
                            <th>Enabled</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            checks.forEach(check => {
                html += `
                    <tr>
                        <td><code>${check.check_key}</code></td>
                        <td><strong>${check.wcag_code}</strong></td>
                        <td>${check.title}</td>
                        <td><span class="principle">${check.principle}</span></td>
                        <td><span class="badge badge-${check.issue_type}">${check.issue_type}</span></td>
                        <td><span class="badge badge-${check.severity}">${check.severity}</span></td>
                        <td>${check.priority}</td>
                        <td>${check.enabled ? '✓' : '✗'}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            document.getElementById('content').innerHTML = html;
        }
        
        function displayError(message) {
            document.getElementById('content').innerHTML = `
                <div class="error">
                    <strong>Error:</strong> ${message}
                    <br><br>
                    <strong>Troubleshooting:</strong>
                    <ul>
                        <li>Make sure you've run the migration: <code>database/run-accessibility-checks-migration.bat</code></li>
                        <li>Check that the database connection is configured in <code>config/database.php</code></li>
                        <li>Verify the table exists: <code>SELECT * FROM accessibility_checks LIMIT 1;</code></li>
                    </ul>
                </div>
            `;
        }
        
        function resetFilters() {
            document.getElementById('principleFilter').value = '';
            document.getElementById('enabledFilter').value = 'true';
            loadChecks();
        }
        
        // Load checks on page load
        loadChecks();
    </script>
</body>
</html>
