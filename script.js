document.addEventListener('DOMContentLoaded', function() {
    // Form submission handling
    const urlForm = document.getElementById('url-form');
    const htmlForm = document.getElementById('html-form');
    
    // URL Form Submission
    if (urlForm) {
        urlForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const urlInput = document.getElementById('website-url');
            const url = urlInput.value.trim();
            
            if (!url) {
                alert('Please enter a website URL');
                urlInput.focus();
                return;
            }
            
            // Basic URL validation
            try {
                new URL(url);
                // Valid URL - show demo message
                alert('Demo: Scanning website at: ' + url + '\n\nIn a real application, this would analyze the website for accessibility issues.');
            } catch (error) {
                alert('Please enter a valid URL (e.g., https://example.com)');
                urlInput.focus();
                return;
            }
        });
    }
    
    // HTML Form Submission
    if (htmlForm) {
        htmlForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const htmlTextarea = document.getElementById('html-code');
            const htmlCode = htmlTextarea.value.trim();
            
            if (!htmlCode) {
                alert('Please enter HTML code to analyze');
                htmlTextarea.focus();
                return;
            }
            
            // Show demo message
            alert('Demo: Analyzing HTML code...\n\nIn a real application, this would check your HTML for accessibility compliance.');
        });
    }
    
    const htmlTextarea = document.getElementById('html-code');
    if (htmlTextarea) {
        // Force clear the textarea on page load
        htmlTextarea.value = '';
        
        // Optional: Add a simple placeholder
        htmlTextarea.placeholder = 'Paste your HTML code here...\n\nExample:\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Your Page</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n  </body>\n</html>';
    }
});