<?php
/**
 * Quick Fix for WCAG 1.2.2 Video Examples
 */
$config = require __DIR__ . '/../../config/db-config.php';
$dbConfig = $config['default'];

$conn = new mysqli($dbConfig['host'], $dbConfig['username'], $dbConfig['password'], $dbConfig['database'], $dbConfig['port']);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$criterionId = '1.2.2';

// Update Before example
$beforeHtml = '<div class="video-lesson">
  <h3>WCAG 1.2.2 Demo Video</h3>
  <video width="100%" controls preload="auto" playsinline>
    <source src="wcag-1-2-2-sample.mp4" type="video/mp4">
    <track kind="captions" srclang="en" label="English captions" default>
    Your browser does not support the video tag.
  </video>
  <p class="video-meta">Duration: 5 seconds | Captions track present, but no caption file source</p>
</div>';

$stmt = $conn->prepare("UPDATE wcag_examples SET html_code = ? WHERE criterion_id = ? AND state = 'before'");
$stmt->bind_param("ss", $beforeHtml, $criterionId);
$stmt->execute();
echo "Updated 'before' example for $criterionId\n";

// Update After example
$afterHtml = '<div class="video-lesson">
  <h3>WCAG 1.2.2 Demo Video</h3>
  <video width="100%" controls preload="auto" playsinline>
    <source src="wcag-1-2-2-sample.mp4" type="video/mp4">
    <track kind="captions" src="wcag-1-2-2-sample.vtt" srclang="en" label="English captions" default>
    Your browser does not support the video tag.
  </video>
  <p class="video-meta">Duration: 5 seconds | Captions: English (player CC option enabled)</p>
</div>';

$stmt = $conn->prepare("UPDATE wcag_examples SET html_code = ? WHERE criterion_id = ? AND state = 'after'");
$stmt->bind_param("ss", $afterHtml, $criterionId);
$stmt->execute();
echo "Updated 'after' example for $criterionId\n";

$conn->close();
echo "Done!\n";
