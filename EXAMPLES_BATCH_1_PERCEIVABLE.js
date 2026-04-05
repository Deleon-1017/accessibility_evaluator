// BATCH 1: Perceivable Guidelines - Examples to Add
// Copy these into wcag-data.js for each corresponding guideline

// ============================================================================
// 1.2.1 - Audio-only and Video-only (Prerecorded)
// ============================================================================
examples: {
    before: {
        html: `<div class="podcast-player">
  <h3>Episode 42: Web Accessibility Basics</h3>
  <audio controls src="podcast-episode-42.mp3"></audio>
  <p>Duration: 45 minutes</p>
</div>`,
        css: `.podcast-player {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
}
.podcast-player h3 {
  margin-top: 0;
}`,
        js: "",
        context: "This audio content has no text alternative. Users who are deaf or hard of hearing cannot access the information. Users in noisy environments or without audio capabilities also cannot consume the content."
    },
    after: {
        html: `<div class="podcast-player">
  <h3>Episode 42: Web Accessibility Basics</h3>
  <audio controls src="podcast-episode-42.mp3"></audio>
  <p>Duration: 45 minutes</p>
  
  <details class="transcript">
    <summary>Read Transcript</summary>
    <div class="transcript-content">
      <p><strong>[00:00]</strong> Welcome to our podcast on web accessibility basics...</p>
      <p><strong>[02:15]</strong> Today we'll cover WCAG guidelines...</p>
      <p><strong>[05:30]</strong> Let's start with perceivable content...</p>
    </div>
  </details>
  
  <a href="episode-42-transcript.pdf" download class="download-link">
    <i class="bi bi-download"></i> Download Full Transcript (PDF)
  </a>
</div>`,
        css: `.podcast-player {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
}
.podcast-player h3 {
  margin-top: 0;
}
.transcript {
  margin-top: 15px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 10px;
}
.transcript summary {
  cursor: pointer;
  font-weight: 600;
  color: #0d6efd;
}
.transcript-content {
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
}
.download-link {
  display: inline-block;
  margin-top: 10px;
  color: #0d6efd;
  text-decoration: none;
}`,
        js: "",
        context: "A complete text transcript is provided in an expandable details element, making the audio content accessible to deaf and hard of hearing users. A downloadable PDF version is also available for offline access."
    },
    interactive: {
        enabled: true,
        instructions: "Click 'Read Transcript' to expand and view the text alternative for the audio content."
    },
    userGroups: ["deaf users", "hard of hearing users", "users in noisy environments", "users without audio capabilities"],
    principle: "Perceivable"
},

// ============================================================================
// 1.2.2 - Captions (Prerecorded)
// ============================================================================
examples: {
    before: {
        html: `<div class="video-container">
  <h3>Tutorial: Creating Accessible Forms</h3>
  <video controls width="640" height="360">
    <source src="form-tutorial.mp4" type="video/mp4">
    Your browser doesn't support video.
  </video>
</div>`,
        css: `.video-container {
  max-width: 640px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}
.video-container h3 {
  background: #f8f9fa;
  padding: 15px;
  margin: 0;
}
video {
  display: block;
  width: 100%;
}`,
        js: "",
        context: "This video has no captions. Deaf and hard of hearing users cannot understand the spoken dialogue and audio cues. Users in quiet environments where audio cannot be played also miss the content."
    },
    after: {
        html: `<div class="video-container">
  <h3>Tutorial: Creating Accessible Forms</h3>
  <video controls width="640" height="360">
    <source src="form-tutorial.mp4" type="video/mp4">
    <track kind="captions" 
           src="form-tutorial-en.vtt" 
           srclang="en" 
           label="English"
           default>
    <track kind="captions" 
           src="form-tutorial-es.vtt" 
           srclang="es" 
           label="Español">
    Your browser doesn't support video.
  </video>
  <p class="caption-note">
    <i class="bi bi-badge-cc"></i> Captions available in English and Spanish
  </p>
</div>`,
        css: `.video-container {
  max-width: 640px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}
.video-container h3 {
  background: #f8f9fa;
  padding: 15px;
  margin: 0;
}
video {
  display: block;
  width: 100%;
}
.caption-note {
  background: #f8f9fa;
  padding: 10px 15px;
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
}`,
        js: "",
        context: "Captions are provided using WebVTT track files in multiple languages. Users can enable captions through the video player controls, making the dialogue and important sounds accessible to everyone."
    },
    interactive: {
        enabled: true,
        instructions: "Click the CC button in the video player to enable captions and select your preferred language."
    },
    userGroups: ["deaf users", "hard of hearing users", "users in quiet environments", "non-native speakers"],
    principle: "Perceivable"
},

// ============================================================================
// 1.3.2 - Meaningful Sequence
// ============================================================================
examples: {
    before: {
        html: `<div class="article-layout">
  <div style="float: right; width: 300px;">
    <img src="diagram.png" alt="Process diagram">
    <p class="caption">Figure 1: The process flow</p>
  </div>
  <h2>Understanding the Process</h2>
  <p>First, review the diagram on the right.</p>
  <p>The process begins with user input...</p>
  <div style="clear: both;"></div>
  <p>As shown in the diagram, the next step is validation...</p>
</div>`,
        css: `.article-layout {
  max-width: 800px;
  padding: 20px;
}
.caption {
  font-size: 0.9rem;
  font-style: italic;
  color: #6c757d;
}`,
        js: "",
        context: "The visual layout uses CSS floats to position the image, but the reading order in the HTML doesn't match the visual presentation. Screen readers will announce the image and caption before the heading, creating confusion about the content sequence."
    },
    after: {
        html: `<article class="article-layout">
  <h2>Understanding the Process</h2>
  <p>First, review the diagram below.</p>
  
  <figure>
    <img src="diagram.png" alt="Process diagram showing three steps: input, validation, and output">
    <figcaption>Figure 1: The process flow</figcaption>
  </figure>
  
  <p>The process begins with user input...</p>
  <p>As shown in the diagram, the next step is validation...</p>
</article>`,
        css: `.article-layout {
  max-width: 800px;
  padding: 20px;
}
figure {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}
figure img {
  max-width: 100%;
  height: auto;
}
figcaption {
  margin-top: 10px;
  font-size: 0.9rem;
  font-style: italic;
  color: #6c757d;
}`,
        js: "",
        context: "The HTML structure now follows a logical reading order that matches the visual presentation. The semantic figure and figcaption elements properly group the image with its caption, and the content flows naturally for all users."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["screen reader users", "keyboard users", "users with cognitive disabilities"],
    principle: "Perceivable"
},

// ============================================================================
// 1.4.1 - Use of Color
// ============================================================================
examples: {
    before: {
        html: `<form class="registration-form">
  <h3>User Registration</h3>
  
  <div class="form-group">
    <label for="username">Username</label>
    <input type="text" id="username" class="error-field">
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" class="error-field">
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password">
  </div>
  
  <p class="form-note">Fields in red are required</p>
  <button type="submit">Register</button>
</form>`,
        css: `.registration-form {
  max-width: 400px;
  padding: 20px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
input {
  width: 100%;
  padding: 8px;
  border: 2px solid #ced4da;
  border-radius: 4px;
}
.error-field {
  border-color: #dc3545;
  background: #fff5f5;
}
.form-note {
  color: #dc3545;
  font-size: 0.9rem;
}`,
        js: "",
        context: "Required fields are indicated only by red color. Users who are colorblind, have low vision, or use monochrome displays cannot distinguish which fields are required. Color alone should never convey information."
    },
    after: {
        html: `<form class="registration-form">
  <h3>User Registration</h3>
  
  <div class="form-group">
    <label for="username">
      Username <span class="required-indicator" aria-label="required">*</span>
    </label>
    <input type="text" 
           id="username" 
           required 
           aria-required="true"
           class="error-field">
  </div>
  
  <div class="form-group">
    <label for="email">
      Email <span class="required-indicator" aria-label="required">*</span>
    </label>
    <input type="email" 
           id="email" 
           required 
           aria-required="true"
           class="error-field">
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password">
  </div>
  
  <p class="form-note">
    <i class="bi bi-asterisk"></i> Required fields are marked with an asterisk (*)
  </p>
  <button type="submit">Register</button>
</form>`,
        css: `.registration-form {
  max-width: 400px;
  padding: 20px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
.required-indicator {
  color: #dc3545;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 8px;
  border: 2px solid #ced4da;
  border-radius: 4px;
}
.error-field {
  border-color: #dc3545;
  background: #fff5f5;
}
.form-note {
  color: #6c757d;
  font-size: 0.9rem;
}`,
        js: "",
        context: "Required fields are now indicated with both color AND an asterisk (*) symbol. The required attribute and aria-required provide programmatic indication. The legend explains the asterisk meaning, ensuring all users understand which fields are required."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["colorblind users", "users with low vision", "users with monochrome displays"],
    principle: "Perceivable"
},

// ============================================================================
// 1.4.2 - Audio Control
// ============================================================================
examples: {
    before: {
        html: `<div class="welcome-page">
  <h1>Welcome to Our Website</h1>
  <p>Discover amazing products and services...</p>
  
  <audio autoplay loop>
    <source src="background-music.mp3" type="audio/mpeg">
  </audio>
</div>`,
        css: `.welcome-page {
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 400px;
}`,
        js: "",
        context: "Background audio plays automatically without user control. This interferes with screen readers, distracts users, and cannot be stopped easily. Users with cognitive disabilities or those using assistive technology are particularly affected."
    },
    after: {
        html: `<div class="welcome-page">
  <h1>Welcome to Our Website</h1>
  <p>Discover amazing products and services...</p>
  
  <div class="audio-controls">
    <button id="playAudioBtn" class="audio-btn" aria-label="Play background music">
      <i class="bi bi-play-circle"></i> Play Background Music
    </button>
    <button id="stopAudioBtn" class="audio-btn" aria-label="Stop background music" style="display: none;">
      <i class="bi bi-stop-circle"></i> Stop Music
    </button>
  </div>
  
  <audio id="backgroundAudio" loop>
    <source src="background-music.mp3" type="audio/mpeg">
  </audio>
</div>`,
        css: `.welcome-page {
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 400px;
}
.audio-controls {
  margin-top: 20px;
}
.audio-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 5px;
}
.audio-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}`,
        js: `const audio = document.getElementById('backgroundAudio');
const playBtn = document.getElementById('playAudioBtn');
const stopBtn = document.getElementById('stopAudioBtn');

playBtn.addEventListener('click', () => {
  audio.play();
  playBtn.style.display = 'none';
  stopBtn.style.display = 'inline-block';
});

stopBtn.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
  stopBtn.style.display = 'none';
  playBtn.style.display = 'inline-block';
});`,
        context: "Audio does not play automatically. Users have full control through clearly labeled play and stop buttons. This prevents interference with screen readers and allows users to choose whether to enable background audio."
    },
    interactive: {
        enabled: true,
        instructions: "Click 'Play Background Music' to start audio, then 'Stop Music' to stop it. Notice how the audio doesn't play automatically."
    },
    userGroups: ["screen reader users", "users with cognitive disabilities", "users with hearing aids", "all users who prefer quiet browsing"],
    principle: "Perceivable"
},

// ============================================================================
// 1.4.4 - Resize Text
// ============================================================================
examples: {
    before: {
        html: `<div class="article-fixed">
  <h2 style="font-size: 18px;">Important Announcement</h2>
  <p style="font-size: 12px;">
    This is critical information that all users must read. 
    The text size is fixed and cannot be resized by the user.
  </p>
  <button style="font-size: 10px;">Read More</button>
</div>`,
        css: `.article-fixed {
  width: 400px;
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}`,
        js: "",
        context: "Text sizes are set in absolute pixels and cannot be resized by the user. Users with low vision who need larger text cannot read the content comfortably, even when using browser zoom or text-only zoom features."
    },
    after: {
        html: `<article class="article-responsive">
  <h2>Important Announcement</h2>
  <p>
    This is critical information that all users must read. 
    The text size uses relative units (rem/em) and can be resized up to 200% without loss of functionality.
  </p>
  <button>Read More</button>
</article>`,
        css: `.article-responsive {
  max-width: 40rem;
  padding: 1.25rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}
.article-responsive h2 {
  font-size: 1.5rem;
  margin-top: 0;
}
.article-responsive p {
  font-size: 1rem;
  line-height: 1.6;
}
.article-responsive button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}`,
        js: "",
        context: "Text sizes use relative units (rem/em) that scale with user preferences. Users can resize text up to 200% using browser settings without breaking the layout or losing functionality. All content remains readable and accessible."
    },
    interactive: {
        enabled: true,
        instructions: "Try zooming in your browser (Ctrl/Cmd + Plus) to see how the text scales properly without breaking the layout."
    },
    userGroups: ["users with low vision", "users who need larger text", "older users"],
    principle: "Perceivable"
},

// ============================================================================
// 1.4.5 - Images of Text
// ============================================================================
examples: {
    before: {
        html: `<div class="banner">
  <img src="welcome-banner.png" alt="Welcome to Our Store - Grand Opening Sale - 50% Off Everything">
</div>

<div class="quote-section">
  <img src="inspirational-quote.png" alt="Success is not final, failure is not fatal">
</div>`,
        css: `.banner img, .quote-section img {
  max-width: 100%;
  height: auto;
  display: block;
}
.banner {
  margin-bottom: 20px;
}`,
        js: "",
        context: "Important text is embedded in images. Users cannot resize the text, change colors for better contrast, or select/copy the text. Screen readers can only access the alt text, which may not capture all visual styling and emphasis."
    },
    after: {
        html: `<div class="banner">
  <div class="banner-content">
    <h1>Welcome to Our Store</h1>
    <p class="sale-announcement">Grand Opening Sale</p>
    <p class="discount">50% Off Everything</p>
  </div>
</div>

<blockquote class="quote-section">
  <p>"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
  <cite>— Winston Churchill</cite>
</blockquote>`,
        css: `.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 20px;
}
.banner-content h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 800;
}
.sale-announcement {
  font-size: 1.5rem;
  margin: 10px 0;
  font-weight: 600;
}
.discount {
  font-size: 3rem;
  font-weight: 900;
  margin: 10px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}
.quote-section {
  background: #f8f9fa;
  border-left: 4px solid #0d6efd;
  padding: 20px 30px;
  font-style: italic;
  margin: 20px 0;
}
.quote-section p {
  font-size: 1.25rem;
  margin: 0 0 10px 0;
}
.quote-section cite {
  font-size: 1rem;
  color: #6c757d;
}`,
        js: "",
        context: "Text is rendered as actual HTML text with CSS styling. Users can resize text, adjust colors, select and copy content, and use custom stylesheets. Screen readers can access all text with proper semantic structure and emphasis."
    },
    interactive: {
        enabled: true,
        instructions: "Try selecting the text, changing browser text size, or using browser reader mode to see how real text is more flexible than images."
    },
    userGroups: ["users with low vision", "users who need custom colors", "users who need larger text", "screen reader users"],
    principle: "Perceivable"
},

// ============================================================================
// 1.4.6 - Contrast (Enhanced)
// ============================================================================
examples: {
    before: {
        html: `<div class="info-card">
  <h3 style="color: #999;">Important Information</h3>
  <p style="color: #aaa;">
    This text has low contrast against the background. 
    While it may be readable for some users, it doesn't meet 
    the enhanced contrast ratio of 7:1 for Level AAA compliance.
  </p>
  <a href="#" style="color: #66b3ff;">Learn More</a>
</div>`,
        css: `.info-card {
  background: #fff;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}`,
        js: "",
        context: "Text has insufficient contrast (approximately 3:1 to 4:1). While this might meet Level AA requirements, it doesn't achieve the enhanced 7:1 ratio needed for Level AAA. Users with low vision or color deficiencies struggle to read the content."
    },
    after: {
        html: `<div class="info-card-enhanced">
  <h3>Important Information</h3>
  <p>
    This text has enhanced contrast against the background, 
    meeting the 7:1 ratio required for Level AAA compliance. 
    This provides better readability for all users, especially 
    those with low vision or color deficiencies.
  </p>
  <a href="#" class="enhanced-link">Learn More</a>
</div>`,
        css: `.info-card-enhanced {
  background: #fff;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.info-card-enhanced h3 {
  color: #000;
  font-size: 1.5rem;
  margin-top: 0;
}
.info-card-enhanced p {
  color: #1a1a1a;
  font-size: 1rem;
  line-height: 1.6;
}
.enhanced-link {
  color: #0056b3;
  font-weight: 600;
  text-decoration: underline;
}
.enhanced-link:hover {
  color: #003d82;
}`,
        js: "",
        context: "Text colors provide enhanced contrast ratios of at least 7:1 for normal text and 4.5:1 for large text. This exceeds Level AAA requirements, ensuring maximum readability for users with low vision, color deficiencies, or viewing in bright sunlight."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["users with low vision", "users with color deficiencies", "older users", "users viewing in bright light"],
    principle: "Perceivable"
}
