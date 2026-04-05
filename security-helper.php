<?php
/**
 * Security Helper Functions
 * Provides CSRF protection and session security
 */

/**
 * Generate CSRF token
 * @return string
 */
function generateCsrfToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF token
 * @param string $token
 * @return bool
 */
function validateCsrfToken($token) {
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Initialize secure session
 */
function initSecureSession() {
    // Set session timeout (30 minutes)
    if (!isset($_SESSION['CREATED'])) {
        $_SESSION['CREATED'] = time();
    } else if (time() - $_SESSION['CREATED'] > 1800) {
        // Session started more than 30 minutes ago
        session_regenerate_id(true);
        $_SESSION['CREATED'] = time();
    }
    
    // Regenerate session ID periodically
    if (!isset($_SESSION['LAST_ACTIVITY'])) {
        $_SESSION['LAST_ACTIVITY'] = time();
    } else if (time() - $_SESSION['LAST_ACTIVITY'] > 300) {
        // Last request was more than 5 minutes ago
        session_regenerate_id(true);
        $_SESSION['LAST_ACTIVITY'] = time();
    }
}

/**
 * Sanitize input
 * @param string $data
 * @return string
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate URL
 * @param string $url
 * @return bool
 */
function isValidUrl($url) {
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
}
