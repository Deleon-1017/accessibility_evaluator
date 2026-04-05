<?php
/**
 * IDE Helper for Symfony Components
 * This file helps IDEs recognize autoloaded classes
 */

// Force autoload of Symfony classes
if (file_exists(__DIR__ . '/autoload.php')) {
    require_once __DIR__ . '/autoload.php';
}

// Explicitly reference classes to help IDE
if (false) {
    class_alias(\Symfony\Component\DomCrawler\Crawler::class, 'Crawler');
    class_alias(\Symfony\Component\CssSelector\CssSelectorConverter::class, 'CssSelectorConverter');
    class_alias(\GuzzleHttp\Client::class, 'GuzzleClient');
}

