<?php
function cleanHtml($file) {
    $content = file_get_contents($file);
    
    // Pattern to find 2.1.1 section and remove trailing <p> tags in html strings
    // We target the html properties inside the 2.1.1 object
    
    // This is tricky for a large file, so we'll do it carefully.
    // For 2.1.1, remove specific <p> tags and following text until </div>
    
    $patterns = [
        '/\s*<p id="statusBeforeMessage".*?<\/p>/s',
        '/\s*<p class="helper-text".*?<\/p>/s',
        '/\s*<p id="statusAfterMessage".*?<\/p>/s',
        '/\s*<p class="helper-text success-text".*?<\/p>/s'
    ];
    
    // We need to make sure we only do this for 2.1.1 context if possible, 
    // but these IDs/classes are quite specific to 2.1.1.
    
    $newContent = preg_replace($patterns, '', $content);
    
    file_put_contents($file, $newContent);
    echo "Cleaned $file\n";
}

cleanHtml('c:/xampp/htdocs/trial/wcag-data.json');
cleanHtml('c:/xampp/htdocs/trial/wcag-data.js');
