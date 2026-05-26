<?php
$filePath = 'c:\xampp\htdocs\trial\wcag-data.js';
$content = file_get_contents($filePath);

// Regex to find the 2.2.2 block
$pattern = '/(id: "2\.2\.2",.*?examples: \{.*?before: \{.*?\},\s+after: \{).*?(interactive: \{.*?\},)/s';

// The new content for "after" and "interactive"
$newAfter = '
            after: {
                html: `<div class="marquee-accessible-container">
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
</div>`,
                css: `.marquee-accessible-container {
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
}`,
                js: `const toggleBtn = document.getElementById(\'marqueeToggle\');
const container = document.querySelector(\'.marquee-accessible-container\');
let isPaused = false;

toggleBtn.addEventListener(\'click\', () => {
  isPaused = !isPaused;
  container.classList.toggle(\'paused\', isPaused);
  
  const icon = toggleBtn.querySelector(\'.icon\');
  const text = toggleBtn.querySelector(\'.text\');
  
  if (isPaused) {
    icon.textContent = \'▶️\';
    text.textContent = \'Resume\';
    toggleBtn.setAttribute(\'aria-label\', \'Resume marquee\');
  } else {
    icon.textContent = \'⏸️\';
    text.textContent = \'Pause\';
    toggleBtn.setAttribute(\'aria-label\', \'Pause marquee\');
  }
});`,
                context: "The accessible version uses a CSS-based marquee animation instead of the deprecated marquee element. A prominent Pause button allows users to stop the scrolling whenever they need more time to read, satisfying WCAG 2.2.2. The implementation also respects user system preferences for reduced motion, automatically disabling the animation for those who may find it distracting or problematic. This ensures the content is readable and usable for all users, including those with cognitive, reading, or vestibular disabilities."
            },
            interactive: {
                enabled: true,
                instructions: "In the After example, click the Pause button to stop the scrolling text. Click Resume to start it again. Notice how the text slides smoothly and can be controlled by the user."
            },';

// Wait, I need to be careful with the regex match.
// I'll use a simpler approach: find the indices of the markers.
$idMarker = 'id: "2.2.2"';
$pos = strpos($content, $idMarker);
if ($pos === false) {
    die("Could not find 2.2.2 block");
}

$afterStart = strpos($content, 'after: {', $pos);
$interactiveEnd = strpos($content, '},', strpos($content, 'interactive: {', $pos)) + 2;

$newContent = substr($content, 0, $afterStart) . $newAfter . substr($content, $interactiveEnd);

file_put_contents($filePath, $newContent);
echo "Successfully updated wcag-data.js\n";
