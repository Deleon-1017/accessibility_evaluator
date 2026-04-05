// BATCH 2: Operable Guidelines - Examples to Add
// Copy these into wcag-data.js for each corresponding guideline

// ============================================================================
// 2.1.2 - No Keyboard Trap
// ============================================================================
examples: {
    before: {
        html: `<div class="modal-trap">
  <div class="modal-content">
    <h3>Subscribe to Newsletter</h3>
    <input type="email" placeholder="Enter your email">
    <button onclick="alert('Subscribed!')">Subscribe</button>
  </div>
</div>`,
        css: `.modal-trap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
}`,
        js: "",
        context: "This modal has no close button and no keyboard escape mechanism. Users navigating with keyboard get trapped inside the modal and cannot return to the main page content. This violates the fundamental principle that users must always be able to navigate away."
    },
    after: {
        html: `<div class="modal-accessible" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
  <div class="modal-content">
    <button class="close-btn" aria-label="Close dialog">
      <i class="bi bi-x-lg"></i>
    </button>
    <h3 id="modalTitle">Subscribe to Newsletter</h3>
    <input type="email" placeholder="Enter your email" aria-label="Email address">
    <button class="subscribe-btn">Subscribe</button>
    <p class="help-text">Press Escape to close this dialog</p>
  </div>
</div>`,
        css: `.modal-accessible {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
}
.help-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 10px;
}`,
        js: `// Close button functionality
document.querySelector('.close-btn').addEventListener('click', closeModal);

// Escape key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Trap focus within modal
const modal = document.querySelector('.modal-accessible');
const focusableElements = modal.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
const firstElement = focusableElements[0];
const lastElement = focusableElements[focusableElements.length - 1];

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});

function closeModal() {
  modal.style.display = 'none';
  // Return focus to trigger element
}`,
        context: "The modal includes a visible close button, Escape key support, and proper focus management. Focus is trapped within the modal (cycling through interactive elements) but users can always exit using the close button or Escape key."
    },
    interactive: {
        enabled: true,
        instructions: "Try tabbing through the modal elements. Press Escape to close. Notice how focus cycles within the modal but you can always escape."
    },
    userGroups: ["keyboard users", "screen reader users", "users with motor disabilities"],
    principle: "Operable"
},

// ============================================================================
// 2.1.4 - Character Key Shortcuts
// ============================================================================
examples: {
    before: {
        html: `<div class="email-app">
  <h3>Email Inbox</h3>
  <div class="email-list">
    <div class="email-item">Meeting reminder - Press 'r' to reply</div>
    <div class="email-item">Project update - Press 'd' to delete</div>
  </div>
  <p class="shortcuts-info">Keyboard shortcuts: r=reply, d=delete, c=compose</p>
</div>`,
        css: `.email-app {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.email-item {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
}
.shortcuts-info {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 15px;
}`,
        js: `document.addEventListener('keydown', (e) => {
  if (e.key === 'r') alert('Reply');
  if (e.key === 'd') alert('Delete');
  if (e.key === 'c') alert('Compose');
});`,
        context: "Single-character keyboard shortcuts are always active. Users of speech input software who say words containing these letters will accidentally trigger actions. Users cannot turn off or remap these shortcuts."
    },
    after: {
        html: `<div class="email-app-accessible">
  <div class="toolbar">
    <h3>Email Inbox</h3>
    <button id="toggleShortcuts" class="toggle-btn">
      <i class="bi bi-keyboard"></i> Shortcuts: <span id="shortcutStatus">ON</span>
    </button>
  </div>
  
  <div class="email-list">
    <div class="email-item" tabindex="0">
      Meeting reminder
      <button class="action-btn" data-action="reply">Reply (Ctrl+R)</button>
    </div>
    <div class="email-item" tabindex="0">
      Project update
      <button class="action-btn" data-action="delete">Delete (Ctrl+D)</button>
    </div>
  </div>
  
  <div class="shortcuts-panel">
    <h4>Keyboard Shortcuts</h4>
    <ul>
      <li><kbd>Ctrl+R</kbd> - Reply to email</li>
      <li><kbd>Ctrl+D</kbd> - Delete email</li>
      <li><kbd>Ctrl+N</kbd> - Compose new email</li>
    </ul>
  </div>
</div>`,
        css: `.email-app-accessible {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.toggle-btn {
  padding: 8px 15px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.email-item {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.action-btn {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
}
kbd {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  padding: 2px 6px;
  font-family: monospace;
}`,
        js: `let shortcutsEnabled = true;

document.getElementById('toggleShortcuts').addEventListener('click', () => {
  shortcutsEnabled = !shortcutsEnabled;
  document.getElementById('shortcutStatus').textContent = shortcutsEnabled ? 'ON' : 'OFF';
});

document.addEventListener('keydown', (e) => {
  if (!shortcutsEnabled) return;
  
  // Use Ctrl/Cmd modifier to avoid conflicts
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'r') {
      e.preventDefault();
      alert('Reply');
    }
    if (e.key === 'd') {
      e.preventDefault();
      alert('Delete');
    }
    if (e.key === 'n') {
      e.preventDefault();
      alert('Compose');
    }
  }
});`,
        context: "Keyboard shortcuts now use modifier keys (Ctrl/Cmd) to avoid conflicts with speech input. Users can toggle shortcuts on/off. All actions are also available through visible buttons, providing multiple ways to accomplish tasks."
    },
    interactive: {
        enabled: true,
        instructions: "Try using Ctrl+R or Ctrl+D. Click the 'Shortcuts' button to toggle them off. Notice how shortcuts require modifier keys."
    },
    userGroups: ["speech input users", "keyboard users", "users with motor disabilities"],
    principle: "Operable"
},

// ============================================================================
// 2.2.1 - Timing Adjustable
// ============================================================================
examples: {
    before: {
        html: `<div class="quiz-container">
  <h3>Timed Quiz</h3>
  <p>Time remaining: <span id="timer">60</span> seconds</p>
  <div class="question">
    <p>What is 2 + 2?</p>
    <input type="number" placeholder="Your answer">
  </div>
  <button>Submit</button>
</div>`,
        css: `.quiz-container {
  max-width: 500px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
#timer {
  font-weight: bold;
  color: #dc3545;
}`,
        js: `let timeLeft = 60;
const timer = document.getElementById('timer');

const countdown = setInterval(() => {
  timeLeft--;
  timer.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(countdown);
    alert('Time is up! Quiz submitted automatically.');
  }
}, 1000);`,
        context: "The quiz has a fixed 60-second time limit with no way to extend or disable it. Users who need more time due to disabilities, slow reading speed, or using assistive technology cannot complete the quiz successfully."
    },
    after: {
        html: `<div class="quiz-container-accessible">
  <div class="quiz-header">
    <h3>Accessible Quiz</h3>
    <div class="time-controls">
      <p>Time remaining: <span id="timer" aria-live="polite">120</span> seconds</p>
      <button id="extendTime" class="extend-btn">
        <i class="bi bi-clock"></i> Extend Time (+60s)
      </button>
      <button id="disableTimer" class="disable-btn">
        <i class="bi bi-pause-circle"></i> Disable Timer
      </button>
    </div>
  </div>
  
  <div class="question">
    <p>What is 2 + 2?</p>
    <input type="number" placeholder="Your answer" aria-label="Answer">
  </div>
  
  <div class="alert alert-info">
    <i class="bi bi-info-circle"></i>
    You can extend the time or disable the timer at any point.
  </div>
  
  <button class="submit-btn">Submit</button>
</div>`,
        css: `.quiz-container-accessible {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.quiz-header {
  margin-bottom: 20px;
}
.time-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
#timer {
  font-weight: bold;
  color: #0d6efd;
}
.extend-btn, .disable-btn {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 0.9rem;
}
.alert {
  padding: 12px;
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 6px;
  margin: 15px 0;
}`,
        js: `let timeLeft = 120;
let timerActive = true;
const timerDisplay = document.getElementById('timer');

const countdown = setInterval(() => {
  if (timerActive) {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      alert('Time is up! You can still submit your answers.');
    }
  }
}, 1000);

document.getElementById('extendTime').addEventListener('click', () => {
  timeLeft += 60;
  timerDisplay.textContent = timeLeft;
  alert('Time extended by 60 seconds');
});

document.getElementById('disableTimer').addEventListener('click', () => {
  timerActive = false;
  timerDisplay.textContent = '∞';
  alert('Timer disabled. Take as much time as you need.');
});`,
        context: "Users start with 120 seconds (double the original time) and can extend time in 60-second increments or disable the timer completely. The timer is announced to screen readers via aria-live. Users maintain full control over timing."
    },
    interactive: {
        enabled: true,
        instructions: "Click 'Extend Time' to add 60 seconds, or 'Disable Timer' to remove the time limit completely."
    },
    userGroups: ["users with cognitive disabilities", "users with motor disabilities", "screen reader users", "older users"],
    principle: "Operable"
},

// ============================================================================
// 2.2.2 - Pause, Stop, Hide
// ============================================================================
examples: {
    before: {
        html: `<div class="news-ticker">
  <div class="ticker-content">
    <span>Breaking: New product launch...</span>
    <span>Update: Stock prices rising...</span>
    <span>Alert: Weather warning issued...</span>
  </div>
</div>

<div class="carousel">
  <div class="slide active">Slide 1: Special Offer</div>
  <div class="slide">Slide 2: New Arrivals</div>
  <div class="slide">Slide 3: Customer Reviews</div>
</div>`,
        css: `.news-ticker {
  background: #0d6efd;
  color: white;
  padding: 10px;
  overflow: hidden;
}
.ticker-content {
  display: flex;
  animation: scroll 20s linear infinite;
}
@keyframes scroll {
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
}
.carousel {
  height: 200px;
  position: relative;
}
.slide {
  display: none;
  padding: 40px;
  background: #f8f9fa;
}
.slide.active {
  display: block;
}`,
        js: `// Auto-rotate carousel every 3 seconds
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 3000);`,
        context: "Moving content (ticker and carousel) auto-plays with no way to pause, stop, or hide it. This distracts users with attention disorders, makes it difficult for screen reader users to focus, and can trigger seizures in sensitive users."
    },
    after: {
        html: `<div class="news-ticker-accessible">
  <div class="ticker-controls">
    <button id="pauseTicker" aria-label="Pause news ticker">
      <i class="bi bi-pause-fill"></i>
    </button>
    <button id="playTicker" aria-label="Play news ticker" style="display: none;">
      <i class="bi bi-play-fill"></i>
    </button>
  </div>
  <div class="ticker-content" aria-live="off" aria-atomic="true">
    <span>Breaking: New product launch...</span>
    <span>Update: Stock prices rising...</span>
    <span>Alert: Weather warning issued...</span>
  </div>
</div>

<div class="carousel-accessible">
  <div class="carousel-controls">
    <button class="control-btn" id="prevSlide" aria-label="Previous slide">
      <i class="bi bi-chevron-left"></i>
    </button>
    <button class="control-btn" id="pauseCarousel" aria-label="Pause carousel">
      <i class="bi bi-pause-fill"></i>
    </button>
    <button class="control-btn" id="playCarousel" aria-label="Play carousel" style="display: none;">
      <i class="bi bi-play-fill"></i>
    </button>
    <button class="control-btn" id="nextSlide" aria-label="Next slide">
      <i class="bi bi-chevron-right"></i>
    </button>
  </div>
  
  <div class="slides-container" aria-live="polite">
    <div class="slide active">Slide 1: Special Offer</div>
    <div class="slide">Slide 2: New Arrivals</div>
    <div class="slide">Slide 3: Customer Reviews</div>
  </div>
  
  <div class="slide-indicators">
    <button class="indicator active" aria-label="Go to slide 1"></button>
    <button class="indicator" aria-label="Go to slide 2"></button>
    <button class="indicator" aria-label="Go to slide 3"></button>
  </div>
</div>`,
        css: `.news-ticker-accessible {
  background: #0d6efd;
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ticker-controls button {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.ticker-content {
  overflow: hidden;
  flex: 1;
}
.ticker-content.paused {
  animation-play-state: paused;
}
.carousel-accessible {
  position: relative;
  padding: 20px;
}
.carousel-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}
.control-btn {
  padding: 8px 15px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.slide-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}
.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #0d6efd;
  background: transparent;
  cursor: pointer;
}
.indicator.active {
  background: #0d6efd;
}`,
        js: `// Ticker controls
let tickerPaused = false;
const tickerContent = document.querySelector('.ticker-content');

document.getElementById('pauseTicker').addEventListener('click', () => {
  tickerPaused = true;
  tickerContent.style.animationPlayState = 'paused';
  document.getElementById('pauseTicker').style.display = 'none';
  document.getElementById('playTicker').style.display = 'inline-block';
});

document.getElementById('playTicker').addEventListener('click', () => {
  tickerPaused = false;
  tickerContent.style.animationPlayState = 'running';
  document.getElementById('playTicker').style.display = 'none';
  document.getElementById('pauseTicker').style.display = 'inline-block';
});

// Carousel controls
let carouselPaused = false;
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-accessible .slide');
const indicators = document.querySelectorAll('.indicator');

function showSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  indicators.forEach(i => i.classList.remove('active'));
  slides[index].classList.add('active');
  indicators[index].classList.add('active');
}

let carouselInterval = setInterval(() => {
  if (!carouselPaused) {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
}, 5000);

document.getElementById('pauseCarousel').addEventListener('click', () => {
  carouselPaused = true;
  document.getElementById('pauseCarousel').style.display = 'none';
  document.getElementById('playCarousel').style.display = 'inline-block';
});

document.getElementById('playCarousel').addEventListener('click', () => {
  carouselPaused = false;
  document.getElementById('playCarousel').style.display = 'none';
  document.getElementById('pauseCarousel').style.display = 'inline-block';
});

document.getElementById('prevSlide').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

document.getElementById('nextSlide').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});`,
        context: "Both moving elements have pause/play controls. The carousel also has manual navigation (previous/next) and slide indicators. Users can stop all movement, navigate at their own pace, and control when content updates."
    },
    interactive: {
        enabled: true,
        instructions: "Click the pause buttons to stop movement. Use the carousel arrows to navigate manually. Click play to resume auto-rotation."
    },
    userGroups: ["users with attention disorders", "users with cognitive disabilities", "screen reader users", "users sensitive to motion"],
    principle: "Operable"
}

// Note: Continue with remaining Operable guidelines in next batch...
