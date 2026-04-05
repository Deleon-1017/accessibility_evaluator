<?php
/**
 * PhpStorm Meta file for better IDE support
 * This file helps IDEs understand dynamic code patterns
 */

namespace PHPSTORM_META {
    
    // Register Symfony DomCrawler namespace
    override(\Symfony\Component\DomCrawler\Crawler::filter(0), type(0));
    override(\Symfony\Component\DomCrawler\Crawler::filterXPath(0), type(0));
    
    // Help IDE understand that new Crawler returns Crawler instance
    expectedArguments(\Symfony\Component\DomCrawler\Crawler::__construct(), 0, 
        \DOMNode::class, 
        \DOMNodeList::class, 
        array()
    );
}
