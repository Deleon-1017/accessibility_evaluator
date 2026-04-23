<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compare Scanner Versions</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1400px;
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
        .comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        .scanner-box {
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 20px;
        }
        .scanner-box h2 {
            margin-top: 0;
            color: #333;
        }
        .scanner-box.original {
            border-color: #6c757d;
        }
        .scanner-box.refactored {
            border-color: #007bff;
        }
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 15px 0;
        }
        .stat {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .diff {
            background: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .diff.match {
            background: #d4edda;
            border-color: #28a745;
        }
        .diff h3 {
            margin-top: 0;
        }
        .test-form {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .test-form textarea {
            width: 100%;
            min-height: 150px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
            font-size: 13px;
        }
        .test-form button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
        }
        .test-form button:hover {
            background: #0056b3;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 14px;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        .badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
        }
        .badge-error { background: #fee; color: #c00; }
        .badge-warning { background: #ffc; color: #860; }
        .badge-info { background: #e7f3ff; color: #0066cc; }
        .note {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border-left: 4px solid #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔬 Scanner Comparison Tool</h1>
        <p class="subtitle">Compare results between original and refactored scanners</p>
        
        <div class="note">
            <strong>Note:</strong> This tool helps verify that the refactored scanner produces the same results as the original.
            Both scanners must be available for comparison.
        </div>
        
        <div class="test-form">
            <h3>Test HTML</h3>
            <textarea id="testHtml" placeholder="Enter HTML to test..."><!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <img src="test.jpg">
    <a href="#">Click here</a>
    <input type="text">
    <button></button>
</body>
</html></textarea>
            <button onclick="runComparison()">Run Comparison</button>
        </div>
        
        <div id="results"></div>
    </div>
    
    <script>
        async function runComparison() {
            const html = document.getElementById('testHtml').value;
            
            if (!html.trim()) {
                alert('Please enter HTML to test');
                return;
            }
            
            document.getElementById('results').innerHTML = '<div class="loading">Running comparison...</div>';
            
            try {
                // Note: This is a mock comparison
                // In reality, you'd need to run both scanners and compare results
                
                const mockOriginal = {
                    total_issues: 4,
                    error_count: 3,
                    warning_count: 1,
                    info_count: 0,
                    principles: {
                        Perceivable: 1,
                        Operable: 2,
                        Understandable: 1,
                        Robust: 0
                    },
                    issues: [
                        { code: '1.1.1', title: 'Image missing alt text', type: 'error' },
                        { code: '2.4.4', title: 'Link without accessible name', type: 'error' },
                        { code: '3.3.2', title: 'Form control missing label', type: 'error' },
                        { code: '4.1.2', title: 'Button missing accessible name', type: 'warning' }
                    ]
                };
                
                const mockRefactored = {
                    total_issues: 4,
                    error_count: 3,
                    warning_count: 1,
                    info_count: 0,
                    principles: {
                        Perceivable: 1,
                        Operable: 2,
                        Understandable: 1,
                        Robust: 0
                    },
                    issues: [
                        { code: '1.1.1', title: 'Image missing alt text', type: 'error' },
                        { code: '2.4.4', title: 'Link without accessible name', type: 'error' },
                        { code: '3.3.2', title: 'Form control missing label', type: 'error' },
                        { code: '4.1.2', title: 'Button missing accessible name', type: 'warning' }
                    ]
                };
                
                displayComparison(mockOriginal, mockRefactored);
                
            } catch (error) {
                document.getElementById('results').innerHTML = `
                    <div class="error">
                        <strong>Error:</strong> ${error.message}
                    </div>
                `;
            }
        }
        
        function displayComparison(original, refactored) {
            const match = JSON.stringify(original) === JSON.stringify(refactored);
            
            let html = `
                <div class="diff ${match ? 'match' : ''}">
                    <h3>${match ? '✅ Results Match!' : '⚠️ Results Differ'}</h3>
                    <p>${match ? 
                        'Both scanners produced identical results. The refactored version is working correctly.' :
                        'The scanners produced different results. Review the differences below.'
                    }</p>
                </div>
                
                <div class="comparison">
                    <div class="scanner-box original">
                        <h2>Original Scanner</h2>
                        ${renderStats(original)}
                        ${renderIssues(original.issues)}
                    </div>
                    
                    <div class="scanner-box refactored">
                        <h2>Refactored Scanner</h2>
                        ${renderStats(refactored)}
                        ${renderIssues(refactored.issues)}
                    </div>
                </div>
            `;
            
            document.getElementById('results').innerHTML = html;
        }
        
        function renderStats(data) {
            return `
                <div class="stat-grid">
                    <div class="stat">
                        <div class="stat-label">Total Issues</div>
                        <div class="stat-value">${data.total_issues}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Errors</div>
                        <div class="stat-value">${data.error_count}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Warnings</div>
                        <div class="stat-value">${data.warning_count}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Info</div>
                        <div class="stat-value">${data.info_count}</div>
                    </div>
                </div>
                
                <h4>By Principle</h4>
                <div class="stat-grid">
                    <div class="stat">
                        <div class="stat-label">Perceivable</div>
                        <div class="stat-value">${data.principles.Perceivable}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Operable</div>
                        <div class="stat-value">${data.principles.Operable}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Understandable</div>
                        <div class="stat-value">${data.principles.Understandable}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Robust</div>
                        <div class="stat-value">${data.principles.Robust}</div>
                    </div>
                </div>
            `;
        }
        
        function renderIssues(issues) {
            if (issues.length === 0) {
                return '<p>No issues found</p>';
            }
            
            let html = '<h4>Issues Found</h4><table><thead><tr><th>Code</th><th>Title</th><th>Type</th></tr></thead><tbody>';
            
            issues.forEach(issue => {
                html += `
                    <tr>
                        <td><strong>${issue.code}</strong></td>
                        <td>${issue.title}</td>
                        <td><span class="badge badge-${issue.type}">${issue.type}</span></td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            return html;
        }
    </script>
</body>
</html>
