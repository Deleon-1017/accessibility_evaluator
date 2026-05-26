<?php
/**
 * Force update wcag-data.js for 2.1.2
 */
$jsPath = 'wcag-data.js';
$content = file_get_contents($jsPath);

$id = 'id: "2.1.2"';
$pos = strpos($content, $id);

if ($pos !== false) {
    // Find the examples object
    $examplesStart = strpos($content, 'examples: {', $pos);
    // Find the end of the examples object (it's followed by interactive: {)
    $interactiveStart = strpos($content, 'interactive: {', $examplesStart);
    $examplesEnd = strrpos(substr($content, 0, $interactiveStart), '}');
    $examplesEnd = strrpos(substr($content, 0, $examplesEnd), '}');
    $examplesEnd = strpos($content, '}', $examplesEnd) + 1;
    $examplesEnd = strpos($content, '}', $examplesEnd) + 1;
    
    $newExamples = "examples: {
            before: {
                html: `<div class=\"date-picker-demo\">
  <h3>Select Your Appointment Date</h3>
  <div class=\"form-group\">
    <label for=\"dateInput\">Date:</label>
    <input type=\"text\" 
           id=\"dateInput\" 
           placeholder=\"MM/DD/YYYY\" 
           readonly
           onclick=\"openTrappedCalendar()\"
           onkeydown=\"trapInDateInput(event)\">
    
    <div id=\"trappedCalendar\" class=\"calendar-popup\" style=\"display: none;\">
      <div class=\"calendar-header\">
        <span class=\"nav-btn\" onclick=\"prevMonth()\">‹</span>
        <span class=\"month-year\">January 2024</span>
        <span class=\"nav-btn\" onclick=\"nextMonth()\">›</span>
      </div>
      <div class=\"calendar-grid\" tabindex=\"0\" onkeydown=\"trapInCalendar(event)\">
        <div class=\"day-cell\" onclick=\"selectDate('01')\">1</div>
        <div class=\"day-cell\" onclick=\"selectDate('02')\">2</div>
        <div class=\"day-cell\" onclick=\"selectDate('03')\">3</div>
        <div class=\"day-cell\" onclick=\"selectDate('04')\">4</div>
        <div class=\"day-cell\" onclick=\"selectDate('05')\">5</div>
        <div class=\"day-cell\" onclick=\"selectDate('06')\">6</div>
        <div class=\"day-cell\" onclick=\"selectDate('07')\">7</div>
      </div>
    </div>
  </div>
  <p class=\"helper-text\">Tip: Try navigating to the calendar using your keyboard.</p>
</div>`,
                css: `.date-picker-demo {
  max-width: 400px;
  margin: 20px auto;
  padding: 25px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.date-picker-demo h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 1.2rem;
}
.form-group {
  position: relative;
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}
.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
}
.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 100;
  width: 280px;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.nav-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  outline: none;
}
.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}
.day-cell:hover {
  background: #f3f4f6;
}
.helper-text {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #6b7280;
  font-style: italic;
}`,
                js: \"function openTrappedCalendar() {\\n  const calendar = document.getElementById('trappedCalendar');\\n  calendar.style.display = 'block';\\n  setTimeout(() => {\\n    document.querySelector('.calendar-grid').focus();\\n  }, 100);\\n}\\n\\nfunction trapInDateInput(event) {\\n  const calendar = document.getElementById('trappedCalendar');\\n  if (calendar.style.display === 'block') {\\n    if (event.key === 'Tab' || event.key === 'Escape') {\\n      event.preventDefault();\\n      document.querySelector('.calendar-grid').focus();\\n    }\\n  }\\n}\\n\\nfunction trapInCalendar(event) {\\n  if (['Tab', 'Escape', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {\\n    event.preventDefault();\\n    event.stopPropagation();\\n    event.target.focus();\\n  }\\n}\\n\\nfunction selectDate(day) {\\n  document.getElementById('dateInput').value = '01/' + day + '/2024';\\n  document.getElementById('trappedCalendar').style.display = 'none';\\n}\\n\\nfunction prevMonth() {\\n  document.querySelector('.month-year').textContent = 'December 2023';\\n}\\n\\nfunction nextMonth() {\\n  document.querySelector('.month-year').textContent = 'February 2024';\\n}\",
                context: \"This date picker demonstrates a severe keyboard trap. Once the calendar opens, focus is forcibly moved to the calendar grid, which then intercepts and blocks all navigation keys (Tab, Escape, Arrows). Users cannot navigate between days, change months, or even close the calendar using a keyboard. They are effectively stuck within the component, unable to interact with the rest of the page without a mouse or a full page reload.\"
            },
            after: {
                html: `<div class=\"date-picker-demo\">
  <h3>Select Your Appointment Date</h3>
  <div class=\"form-group\">
    <label for=\"dateInput\">Date:</label>
    <div class=\"date-picker-wrapper\">
      <input type=\"text\" 
             id=\"dateInput\" 
             placeholder=\"MM/DD/YYYY\" 
             readonly
             aria-haspopup=\"dialog\"
             aria-expanded=\"false\"
             onclick=\"openAccessibleCalendar()\">
      <button type=\"button\" 
              class=\"calendar-icon-btn\" 
              onclick=\"openAccessibleCalendar()\"
              aria-label=\"Open calendar\">📅</button>
    </div>
    
    <div id=\"accessibleCalendar\" 
         class=\"calendar-popup\" 
         role=\"dialog\"
         aria-modal=\"true\"
         aria-label=\"Choose date\"
         style=\"display: none;\">
      <div class=\"calendar-header\">
        <button type=\"button\" 
                class=\"nav-btn\" 
                onclick=\"prevMonth()\"
                aria-label=\"Previous month\">‹</button>
        <h4 class=\"month-year\" id=\"monthYear\">January 2024</h4>
        <button type=\"button\" 
                class=\"nav-btn\" 
                onclick=\"nextMonth()\"
                aria-label=\"Next month\">›</button>
      </div>
      <div class=\"calendar-grid\" role=\"grid\">
        <button type=\"button\" class=\"day-cell\" onclick=\"selectDate('01')\">1</button>
        <button type=\"button\" class=\"day-cell\" onclick=\"selectDate('02')\">2</button>
        <button type=\"button\" class=\"day-cell\" onclick=\"selectDate('03')\">3</button>
        <button type=\"button\" class=\"day-cell\" onclick=\"selectDate('04')\">4</button>
        <button type=\"button\" class=\"day-cell\" onclick=\"selectDate('05')\">5</button>
        <button type=\"button\" class=\"day-cell\" onclick=\"selectDate('06')\">6</button>
        <button type=\"button\" class=\"day-cell\" onclick=\"selectDate('07')\">7</button>
      </div>
      <div class=\"calendar-footer\">
        <button type=\"button\" class=\"btn-close\" onclick=\"closeAccessibleCalendar()\">Close Calendar</button>
      </div>
    </div>
  </div>
  <p class=\"helper-text\">Tip: Use Tab to navigate and Escape to close the calendar.</p>
</div>`,
                css: `.date-picker-demo {
  max-width: 400px;
  margin: 20px auto;
  padding: 25px;
  background: white;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
}
.date-picker-demo h3 {
  margin: 0 0 20px 0;
  color: #1e3a8a;
  font-size: 1.2rem;
}
.form-group {
  position: relative;
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1e3a8a;
}
.date-picker-wrapper {
  display: flex;
  gap: 8px;
}
.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-size: 16px;
}
.calendar-icon-btn {
  padding: 0 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
}
.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
  z-index: 100;
  width: 300px;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.nav-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  cursor: pointer;
}
.month-year {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1e3a8a;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 15px;
}
.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: white;
  border: 1px solid #eff6ff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #1e40af;
}
.day-cell:hover, .day-cell:focus {
  background: #3b82f6;
  color: white;
  outline: none;
}
.calendar-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}
.btn-close {
  width: 100%;
  padding: 10px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  color: #4b5563;
}
.helper-text {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #3b82f6;
  font-style: italic;
}`,
                js: \"let lastFocusedElement;\\n\\nfunction openAccessibleCalendar() {\\n  lastFocusedElement = document.activeElement;\\n  const calendar = document.getElementById('accessibleCalendar');\\n  calendar.style.display = 'block';\\n  document.getElementById('dateInput').setAttribute('aria-expanded', 'true');\\n  setTimeout(() => {\\n    calendar.querySelector('.day-cell').focus();\\n  }, 100);\\n  calendar.addEventListener('keydown', handleCalendarKeydown);\\n}\\n\\nfunction closeAccessibleCalendar() {\\n  const calendar = document.getElementById('accessibleCalendar');\\n  calendar.style.display = 'none';\\n  document.getElementById('dateInput').setAttribute('aria-expanded', 'false');\\n  calendar.removeEventListener('keydown', handleCalendarKeydown);\\n  if (lastFocusedElement) lastFocusedElement.focus();\\n}\\n\\nfunction handleCalendarKeydown(event) {\\n  if (event.key === 'Escape') closeAccessibleCalendar();\\n}\\n\\nfunction selectDate(day) {\\n  document.getElementById('dateInput').value = '01/' + day + '/2024';\\n  closeAccessibleCalendar();\\n}\\n\\nfunction prevMonth() {\\n  document.getElementById('monthYear').textContent = 'December 2023';\\n}\\n\\nfunction nextMonth() {\\n  document.getElementById('monthYear').textContent = 'February 2024';\\n}\",
                context: \"This accessible implementation ensures that keyboard users can easily enter and exit the calendar. All interactive elements are proper buttons, the 'Escape' key closes the widget, and focus management returns the user to the original input field upon closing. This eliminates keyboard traps and maintains a predictable navigation flow.\"
            }";

    $newContent = substr($content, 0, $examplesStart) . $newExamples . substr($content, $examplesEnd);
    file_put_contents($jsPath, $newContent);
    echo "Updated wcag-data.js successfully.\n";
} else {
    echo "Could not find id: 2.1.2 in wcag-data.js\n";
}
