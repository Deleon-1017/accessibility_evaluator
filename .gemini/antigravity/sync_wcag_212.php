<?php
/**
 * Update WCAG 2.1.2 examples in JSON and JS data files
 */

$jsonPath = 'wcag-data.json';
$jsPath = 'wcag-data.js';

// --- Simplified Content ---
$beforeHtml = '<div class="date-picker-demo">\n  <h3>Select Your Appointment Date</h3>\n  <div class="form-group">\n    <label for="dateInput">Date:</label>\n    <input type="text" \n           id="dateInput" \n           placeholder="MM/DD/YYYY" \n           readonly\n           onclick="openTrappedCalendar()"\n           onkeydown="trapInDateInput(event)">\n    \n    <div id="trappedCalendar" class="calendar-popup" style="display: none;">\n      <div class="calendar-header">\n        <span class="nav-btn" onclick="prevMonth()">‹</span>\n        <span class="month-year">January 2024</span>\n        <span class="nav-btn" onclick="nextMonth()">›</span>\n      </div>\n      <div class="calendar-grid" tabindex="0" onkeydown="trapInCalendar(event)">\n        <div class="day-cell" onclick="selectDate(\'01\')">1</div>\n        <div class="day-cell" onclick="selectDate(\'02\')">2</div>\n        <div class="day-cell" onclick="selectDate(\'03\')">3</div>\n        <div class="day-cell" onclick="selectDate(\'04\')">4</div>\n        <div class="day-cell" onclick="selectDate(\'05\')">5</div>\n        <div class="day-cell" onclick="selectDate(\'06\')">6</div>\n        <div class="day-cell" onclick="selectDate(\'07\')">7</div>\n      </div>\n    </div>\n  </div>\n  <p class="helper-text">Tip: Try navigating to the calendar using your keyboard.</p>\n</div>';

$beforeCss = '.date-picker-demo {\n  max-width: 400px;\n  margin: 20px auto;\n  padding: 25px;\n  background: white;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n}\n.date-picker-demo h3 {\n  margin: 0 0 20px 0;\n  color: #1f2937;\n  font-size: 1.2rem;\n}\n.form-group {\n  position: relative;\n  margin-bottom: 15px;\n}\n.form-group label {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #374151;\n}\n.form-group input {\n  width: 100%;\n  padding: 12px;\n  border: 2px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 16px;\n}\n.calendar-popup {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  margin-top: 8px;\n  background: white;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  padding: 15px;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);\n  z-index: 100;\n  width: 280px;\n}\n.calendar-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 15px;\n}\n.nav-btn {\n  width: 32px;\n  height: 32px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #f3f4f6;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 20px;\n}\n.calendar-grid {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: 4px;\n  outline: none;\n}\n.day-cell {\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 8px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n  color: #374151;\n}\n.day-cell:hover {\n  background: #f3f4f6;\n}\n.helper-text {\n  margin-top: 20px;\n  font-size: 0.9rem;\n  color: #6b7280;\n  font-style: italic;\n}';

$beforeJs = 'function openTrappedCalendar() {\n  const calendar = document.getElementById(\'trappedCalendar\');\n  calendar.style.display = \'block\';\n  setTimeout(() => {\n    document.querySelector(\'.calendar-grid\').focus();\n  }, 100);\n}\n\nfunction trapInDateInput(event) {\n  const calendar = document.getElementById(\'trappedCalendar\');\n  if (calendar.style.display === \'block\') {\n    if (event.key === \'Tab\' || event.key === \'Escape\') {\n      event.preventDefault();\n      document.querySelector(\'.calendar-grid\').focus();\n    }\n  }\n}\n\nfunction trapInCalendar(event) {\n  if ([\'Tab\', \'Escape\', \'Enter\', \'ArrowUp\', \'ArrowDown\', \'ArrowLeft\', \'ArrowRight\'].includes(event.key)) {\n    event.preventDefault();\n    event.stopPropagation();\n    event.target.focus();\n  }\n}\n\nfunction selectDate(day) {\n  document.getElementById(\'dateInput\').value = \'01/\' + day + \'/2024\';\n  document.getElementById(\'trappedCalendar\').style.display = \'none\';\n}\n\nfunction prevMonth() {\n  document.querySelector(\'.month-year\').textContent = \'December 2023\';\n}\n\nfunction nextMonth() {\n  document.querySelector(\'.month-year\').textContent = \'February 2024\';\n}';

$beforeContext = "This date picker demonstrates a severe keyboard trap. Once the calendar opens, focus is forcibly moved to the calendar grid, which then intercepts and blocks all navigation keys (Tab, Escape, Arrows). Users cannot navigate between days, change months, or even close the calendar using a keyboard. They are effectively stuck within the component, unable to interact with the rest of the page without a mouse or a full page reload.";

$afterHtml = '<div class="date-picker-demo">\n  <h3>Select Your Appointment Date</h3>\n  <div class="form-group">\n    <label for="dateInput">Date:</label>\n    <div class="date-picker-wrapper">\n      <input type="text" \n             id="dateInput" \n             placeholder="MM/DD/YYYY" \n             readonly\n             aria-haspopup="dialog"\n             aria-expanded="false"\n             onclick="openAccessibleCalendar()">\n      <button type="button" \n              class="calendar-icon-btn" \n              onclick="openAccessibleCalendar()"\n              aria-label="Open calendar">📅</button>\n    </div>\n    \n    <div id="accessibleCalendar" \n         class="calendar-popup" \n         role="dialog"\n         aria-modal="true"\n         aria-label="Choose date"\n         style="display: none;">\n      <div class="calendar-header">\n        <button type="button" \n                class="nav-btn" \n                onclick="prevMonth()"\n                aria-label="Previous month">‹</button>\n        <h4 class="month-year" id="monthYear">January 2024</h4>\n        <button type="button" \n                class="nav-btn" \n                onclick="nextMonth()"\n                aria-label="Next month">›</button>\n      </div>\n      <div class="calendar-grid" role="grid">\n        <button type="button" class="day-cell" onclick="selectDate(\'01\')">1</button>\n        <button type="button" class="day-cell" onclick="selectDate(\'02\')">2</button>\n        <button type="button" class="day-cell" onclick="selectDate(\'03\')">3</button>\n        <button type="button" class="day-cell" onclick="selectDate(\'04\')">4</button>\n        <button type="button" class="day-cell" onclick="selectDate(\'05\')">5</button>\n        <button type="button" class="day-cell" onclick="selectDate(\'06\')">6</button>\n        <button type="button" class="day-cell" onclick="selectDate(\'07\')">7</button>\n      </div>\n      <div class="calendar-footer">\n        <button type="button" class="btn-close" onclick="closeAccessibleCalendar()">Close Calendar</button>\n      </div>\n    </div>\n  </div>\n  <p class="helper-text">Tip: Use Tab to navigate and Escape to close the calendar.</p>\n</div>';

$afterCss = '.date-picker-demo {\n  max-width: 400px;\n  margin: 20px auto;\n  padding: 25px;\n  background: white;\n  border: 1px solid #bfdbfe;\n  border-radius: 12px;\n}\n.date-picker-demo h3 {\n  margin: 0 0 20px 0;\n  color: #1e3a8a;\n  font-size: 1.2rem;\n}\n.form-group {\n  position: relative;\n  margin-bottom: 15px;\n}\n.form-group label {\n  display: block;\n  margin-bottom: 8px;\n  font-weight: 600;\n  color: #1e3a8a;\n}\n.date-picker-wrapper {\n  display: flex;\n  gap: 8px;\n}\n.form-group input {\n  width: 100%;\n  padding: 12px;\n  border: 2px solid #3b82f6;\n  border-radius: 8px;\n  font-size: 16px;\n}\n.calendar-icon-btn {\n  padding: 0 16px;\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 18px;\n}\n.calendar-popup {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  margin-top: 8px;\n  background: white;\n  border: 1px solid #3b82f6;\n  border-radius: 8px;\n  padding: 15px;\n  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);\n  z-index: 100;\n  width: 300px;\n}\n.calendar-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 15px;\n}\n.nav-btn {\n  width: 32px;\n  height: 32px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #eff6ff;\n  border: 1px solid #bfdbfe;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.month-year {\n  margin: 0;\n  font-size: 1rem;\n  font-weight: 700;\n  color: #1e3a8a;\n}\n.calendar-grid {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: 4px;\n  margin-bottom: 15px;\n}\n.day-cell {\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 8px;\n  background: white;\n  border: 1px solid #eff6ff;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 600;\n  color: #1e40af;\n}\n.day-cell:hover, .day-cell:focus {\n  background: #3b82f6;\n  color: white;\n  outline: none;\n}\n.calendar-footer {\n  border-top: 1px solid #e5e7eb;\n  padding-top: 12px;\n}\n.btn-close {\n  width: 100%;\n  padding: 10px;\n  background: #f3f4f6;\n  border: none;\n  border-radius: 6px;\n  font-weight: 700;\n  cursor: pointer;\n  color: #4b5563;\n}\n.helper-text {\n  margin-top: 20px;\n  font-size: 0.9rem;\n  color: #3b82f6;\n  font-style: italic;\n}';

$afterJs = 'let lastFocusedElement;\n\nfunction openAccessibleCalendar() {\n  lastFocusedElement = document.activeElement;\n  const calendar = document.getElementById(\'accessibleCalendar\');\n  calendar.style.display = \'block\';\n  document.getElementById(\'dateInput\').setAttribute(\'aria-expanded\', \'true\');\n  setTimeout(() => {\n    calendar.querySelector(\'.day-cell\').focus();\n  }, 100);\n  calendar.addEventListener(\'keydown\', handleCalendarKeydown);\n}\n\nfunction closeAccessibleCalendar() {\n  const calendar = document.getElementById(\'accessibleCalendar\');\n  calendar.style.display = \'none\';\n  document.getElementById(\'dateInput\').setAttribute(\'aria-expanded\', \'false\');\n  calendar.removeEventListener(\'keydown\', handleCalendarKeydown);\n  if (lastFocusedElement) lastFocusedElement.focus();\n}\n\nfunction handleCalendarKeydown(event) {\n  if (event.key === \'Escape\') closeAccessibleCalendar();\n}\n\nfunction selectDate(day) {\n  document.getElementById(\'dateInput\').value = \'01/\' + day + \'/2024\';\n  closeAccessibleCalendar();\n}\n\nfunction prevMonth() {\n  document.getElementById(\'monthYear\').textContent = \'December 2023\';\n}\n\nfunction nextMonth() {\n  document.getElementById(\'monthYear\').textContent = \'February 2024\';\n}';

$afterContext = "This accessible implementation ensures that keyboard users can easily enter and exit the calendar. All interactive elements are proper buttons, the \'Escape\' key closes the widget, and focus management returns the user to the original input field upon closing. This eliminates keyboard traps and maintains a predictable navigation flow.";

// --- Update JSON ---
if (file_exists($jsonPath)) {
    $json = json_decode(file_get_contents($jsonPath), true);
    foreach ($json as &$item) {
        if ($item['id'] === '2.1.2') {
            $item['examples']['before']['html'] = str_replace('\n', "\n", $beforeHtml);
            $item['examples']['before']['css'] = str_replace('\n', "\n", $beforeCss);
            $item['examples']['before']['js'] = str_replace('\n', "\n", $beforeJs);
            $item['examples']['before']['context'] = $beforeContext;
            
            $item['examples']['after']['html'] = str_replace('\n', "\n", $afterHtml);
            $item['examples']['after']['css'] = str_replace('\n', "\n", $afterCss);
            $item['examples']['after']['js'] = str_replace('\n', "\n", $afterJs);
            $item['examples']['after']['context'] = $afterContext;
        }
    }
    file_put_contents($jsonPath, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    echo "Updated wcag-data.json\n";
}

// --- Update JS ---
if (file_exists($jsPath)) {
    $content = file_get_contents($jsPath);
    // This is a bit tricky with JS, but we can try to find the 2.1.2 block
    // and replace the entire examples object
    $pattern = '/id:\s*"2.1.2",.*?"examples":\s*\{.*?\}(?=\s*,\s*interactive:)/s';
    
    // Construct new examples object for JS
    $newExamples = "\"examples\": {\n" .
        "            before: {\n" .
        "                html: `" . str_replace('\n', "\n", $beforeHtml) . "`,\n" .
        "                css: `" . str_replace('\n', "\n", $beforeCss) . "`,\n" .
        "                js: \"" . str_replace('\'', "\\'", str_replace('\n', "\n", $beforeJs)) . "\",\n" .
        "                context: \"" . $beforeContext . "\"\n" .
        "            },\n" .
        "            after: {\n" .
        "                html: `" . str_replace('\n', "\n", $afterHtml) . "`,\n" .
        "                css: `" . str_replace('\n', "\n", $afterCss) . "`,\n" .
        "                js: \"" . str_replace('\'', "\\'", str_replace('\n', "\n", $afterJs)) . "\",\n" .
        "                context: \"" . $afterContext . "\"\n" .
        "            }\n" .
        "        }";
    
    // Since regex might be fragile, let's just do a string replacement for the known old parts if possible
    // or just use the pattern carefully.
    
    // Better way: find the start of 2.1.2 and end of its examples
    $idPos = strpos($content, 'id: "2.1.2"');
    if ($idPos !== false) {
        $examplesStart = strpos($content, 'examples: {', $idPos);
        $interactiveStart = strpos($content, 'interactive: {', $examplesStart);
        // Find the last } before interactive
        $examplesEnd = strrpos(substr($content, 0, $interactiveStart), '}');
        // Need to be careful with the trailing comma
        $examplesEnd = strrpos(substr($content, 0, $examplesEnd), '}');
        $examplesEnd = strpos($content, '}', $examplesEnd) + 1;
        $examplesEnd = strpos($content, '}', $examplesEnd) + 1;
        
        // Actually, let's just use the regex and see if it hits
        if (preg_match($pattern, $content)) {
            $content = preg_replace($pattern, 'id: "2.1.2", principle: "Operable", title: "No Keyboard Trap", level: "A", description: "Keyboard focus can be moved away using only keyboard.", techniques: ["G21", "H91", "FLASH17"], before: `<div tabindex="0" onkeydown="event.preventDefault()">\n  Stuck!\n</div>`, after: `<dialog role="dialog" aria-modal="true">\n  <h2>Confirm Action</h2>\n  <button>Cancel</button>\n  <button>Confirm</button>\n</dialog>`, explanation: "Never trap focus. Users must escape using Tab or Escape. Modals need focus management-focus should move to the modal and trap there, then restore on close.", ' . $newExamples, $content);
            file_put_contents($jsPath, $content);
            echo "Updated wcag-data.js\n";
        } else {
            echo "Regex did not match for wcag-data.js\n";
        }
    }
}
