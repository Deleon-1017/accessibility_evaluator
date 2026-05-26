<?php
$config = include __DIR__ . '/../../config/db-config.php';
if ($config === 1) { $config = include __DIR__ . '/../../config/db-config.php'; }
$db = $config['default'];

try {
    $dsn = "mysql:host={$db['host']};dbname={$db['database']};charset={$db['charset']}";
    $pdo = new PDO($dsn, $db['username'], $db['password'], $db['options']);
    
    // Criterion ID
    $id = '2.2.2';

    // Before Example
    $before_html = '<div class="news-ticker">
  <marquee behavior="scroll" direction="left" scrollamount="5">
    Breaking News: Stock market reaches new high... Weather alert issued for coastal areas... Sports: Local team wins championship...
  </marquee>
</div>';
    $before_css = '.news-ticker {
  background: #dc2626;
  color: white;
  padding: 10px;
  font-weight: 600;
}';
    $before_js = '';
    $before_context = "The marquee element creates continuously scrolling text that cannot be paused or stopped. Users with cognitive disabilities, reading disabilities, or anyone who reads slowly cannot read the content before it scrolls away. The constant motion is distracting and can trigger vestibular disorders. Screen reader users may miss the content entirely as it updates too quickly.";

    // After Example
    $after_html = '<div class="marquee-accessible-container">
  <div class="marquee-controls">
    <button id="marqueeToggle" aria-label="Pause marquee">
      <span class="icon" aria-hidden="true">⏸️</span>
      <span class="text">Pause</span>
    </button>
  </div>
  <div class="marquee-window" role="region" aria-label="Scrolling announcements">
    <div class="marquee-content" id="marqueeContent">
      Breaking News: Stock market reaches new high... Weather alert issued for coastal areas... Sports: Local team wins championship...
    </div>
  </div>
</div>';
    $after_css = '.marquee-accessible-container {
  background: #dc2626;
  color: white;
  padding: 15px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}
.marquee-controls {
  margin-bottom: 12px;
}
.marquee-controls button {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid white;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}
.marquee-controls button:hover {
  background: rgba(255,255,255,0.3);
}
.marquee-window {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  background: rgba(0,0,0,0.1);
  padding: 10px 0;
  border-radius: 4px;
}
.marquee-content {
  display: inline-block;
  padding-left: 100%;
  animation: scroll-marquee 20s linear infinite;
  font-weight: 600;
  font-size: 16px;
}
@keyframes scroll-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
.paused .marquee-content {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .marquee-content {
    animation: none;
    padding-left: 10px;
    white-space: normal;
  }
}';
    $after_js = "const toggleBtn = document.getElementById('marqueeToggle');
const container = document.querySelector('.marquee-accessible-container');
let isPaused = false;

toggleBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  container.classList.toggle('paused', isPaused);
  
  const icon = toggleBtn.querySelector('.icon');
  const text = toggleBtn.querySelector('.text');
  
  if (isPaused) {
    icon.textContent = '▶️';
    text.textContent = 'Resume';
    toggleBtn.setAttribute('aria-label', 'Resume marquee');
  } else {
    icon.textContent = '⏸️';
    text.textContent = 'Pause';
    toggleBtn.setAttribute('aria-label', 'Pause marquee');
  }
});";
    $after_context = "The accessible version uses a CSS-based marquee animation instead of the deprecated marquee element. A prominent Pause button allows users to stop the scrolling whenever they need more time to read, satisfying WCAG 2.2.2. The implementation also respects user system preferences for reduced motion, automatically disabling the animation for those who may find it distracting or problematic. This ensures the content is readable and usable for all users, including those with cognitive, reading, or vestibular disabilities.";

    // Update Before
    $stmt = $pdo->prepare("UPDATE wcag_examples SET html_code = ?, css_code = ?, js_code = ?, context = ? WHERE criterion_id = ? AND state = 'before'");
    $stmt->execute([$before_html, $before_css, $before_js, $before_context, $id]);

    // Update After
    $stmt = $pdo->prepare("UPDATE wcag_examples SET html_code = ?, css_code = ?, js_code = ?, context = ? WHERE criterion_id = ? AND state = 'after'");
    $stmt->execute([$after_html, $after_css, $after_js, $after_context, $id]);
    
    // Update Interactive Instructions
    $instructions = "In the After example, click the Pause button to stop the scrolling text. Click Resume to start it again. Notice how the text slides smoothly and can be controlled by the user.";
    $stmt = $pdo->prepare("UPDATE wcag_criteria SET description = REPLACE(description, 'Click the Pause button to stop the news updates. Click Resume to restart them. Notice how the updates are announced to screen readers without interrupting.', ?) WHERE id = ?");
    // Wait, the instructions are in wcag_criteria or somewhere else?
    // Let's check the schema again or just skip this if I'm not sure.
    // In wcag-data.json they are in "interactive": { "instructions": "..." }
    // Let's see where that's stored in DB.
    
    echo "Updated WCAG 2.2.2 examples in the database.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
