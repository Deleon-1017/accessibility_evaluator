// WCAG 2.1 Guidelines Data with Before/After Examples
const wcagGuidelines = [
    {
        id: "1.1.1",
        principle: "Perceivable",
        title: "Non-text Content",
        level: "A",
        description: "All non-text content that is presented to the user has a text alternative that serves the equivalent purpose.",
        techniques: ["G94", "G95", "ARIA6", "ARIA10"],
        before: `<div class="product-card">
  <img src="logo.png" width="120" height="120">
  <h3>Premium Headphones</h3>
  <img src="rating-5-stars.png">
  <p>$199.99</p>
  <img src="free-shipping.png">
</div>`,
        after: `<div class="product-card">
  <img src="logo.png" alt="TechSound Logo" width="120" height="120">
  <h3>Premium Headphones</h3>
  <img src="rating-5-stars.png" alt="5 out of 5 stars rating">
  <p>$199.99</p>
  <img src="free-shipping.png" alt="Free shipping available">
</div>`,
        explanation: "Images must have descriptive alt text. Screen readers rely on alt text to describe images to visually impaired users. Make alt text concise but meaningful.",
        examples: {
            before: {
                html: `<article class="blog-post">
  <img src="data-visualization-chart.png" width="600" height="400">
  <h2>Q4 Sales Performance</h2>
  <p>Our sales team exceeded expectations this quarter.</p>
  
  <div class="author-info">
    <img src="author-photo.jpg" width="50" height="50">
    <span>Posted by Sarah Johnson</span>
  </div>
  
  <button class="share-btn">
    <img src="share-icon.svg" width="20" height="20">
  </button>
</article>`,
                css: `.blog-post {
  max-width: 700px;
  padding: 30px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}
.blog-post > img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 20px;
}
.blog-post h2 {
  margin: 0 0 15px 0;
  color: #1f2937;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  padding: 15px;
  background: #f9fafb;
  border-radius: 6px;
}
.author-info img {
  border-radius: 50%;
}
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.share-btn:hover {
  background: #2563eb;
}`,
                js: "",
                context: "This blog post contains three images without alt attributes: a data visualization chart, an author photo, and a share icon. Screen readers will announce 'image' or the filename (e.g., 'data-visualization-chart.png'), providing no meaningful information. Users who are blind cannot understand what the chart shows, who the author is, or what the button does. This creates a completely inaccessible experience where critical information is lost."
            },
            after: {
                html: `<article class="blog-post">
  <img src="data-visualization-chart.png" 
       alt="Bar chart showing Q4 sales increased 35% compared to Q3, with revenue reaching $2.4 million across all regions" 
       width="600" 
       height="400">
  <h2>Q4 Sales Performance</h2>
  <p>Our sales team exceeded expectations this quarter.</p>
  
  <div class="author-info">
    <img src="author-photo.jpg" 
         alt="Sarah Johnson, Senior Sales Analyst" 
         width="50" 
         height="50">
    <span>Posted by Sarah Johnson</span>
  </div>
  
  <button class="share-btn">
    <img src="share-icon.svg" 
         alt="" 
         width="20" 
         height="20">
    Share Article
  </button>
</article>`,
                css: `.blog-post {
  max-width: 700px;
  padding: 30px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}
.blog-post > img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 20px;
}
.blog-post h2 {
  margin: 0 0 15px 0;
  color: #1f2937;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  padding: 15px;
  background: #f9fafb;
  border-radius: 6px;
}
.author-info img {
  border-radius: 50%;
}
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.share-btn:hover {
  background: #2563eb;
}`,
                js: "",
                context: "Each image now has appropriate alt text. The chart has a detailed description of the data it presents, allowing screen reader users to understand the key insights. The author photo identifies who is shown. The share icon uses an empty alt attribute (alt='') because the button already has visible text 'Share Article' - this prevents redundant announcements. This demonstrates three types of alt text: informative (chart), identification (author), and decorative (icon with adjacent text)."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "users with images disabled", "users on slow connections", "search engines"],
            principle: "Perceivable"
        }
    },
    {
        id: "1.2.1",
        principle: "Perceivable",
        title: "Audio-only and Video-only (Prerecorded)",
        level: "A",
        description: "An alternative for time-based media is provided that presents equivalent information for prerecorded audio-only or video-only content.",
        techniques: ["G158", "G159", "G166"],
        before: `<audio controls preload="metadata">
  <source src="js-variables-lesson.wav" type="audio/wav">
  <source src="js-variables-lesson.wav" type="audio/x-wav">
</audio>`,
        after: `<audio controls preload="metadata">
  <source src="js-variables-lesson.wav" type="audio/wav">
  <source src="js-variables-lesson.wav" type="audio/x-wav">
</audio>
<p><strong>Transcript:</strong> Full transcript provided below.</p>
<a href="js-variables-transcript.txt" download>Download Full Transcript (TXT)</a>`,
        explanation: "Provide transcripts for audio content. Users who are deaf or hard of hearing need text alternatives. Transcripts also benefit users in noisy environments.",
        examples: {
            before: {
                html: `<div class="audio-lesson">
  <h3>Introduction to JavaScript Variables</h3>
  <audio controls preload="metadata">
    <source src="js-variables-lesson.wav" type="audio/wav">
    <source src="js-variables-lesson.wav" type="audio/x-wav">
    Your browser does not support the audio element.
  </audio>
  <p class="meta">Duration: 1:56 | Instructor: Alex Chen</p>
</div>`,
                css: `.audio-lesson {
  max-width: 600px;
  padding: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}
.audio-lesson h3 {
  margin-top: 0;
  color: #1f2937;
}
audio {
  width: 100%;
  margin: 20px 0;
}
.meta {
  color: #6b7280;
  font-size: 14px;
}`,
                js: "",
                context: "This audio-only educational lesson has no text alternative or transcript. Deaf and hard-of-hearing users cannot access the learning content at all. Users who prefer reading to listening, users in noisy environments, users with audio processing difficulties, and users who want to quickly scan or search for specific information are all excluded. The educational content is completely inaccessible to a significant portion of potential learners."
            },
            after: {
                html: `<div class="audio-lesson">
  <h3>Introduction to JavaScript Variables</h3>
  <audio controls preload="metadata">
    <source src="js-variables-lesson.wav" type="audio/wav">
    <source src="js-variables-lesson.wav" type="audio/x-wav">
    Your browser does not support the audio element.
  </audio>
  <p class="meta">Duration: 1:56 | Instructor: Alex Chen</p>
  
  <div class="transcript-section">
    <h4>Full Transcript</h4>
    <div class="transcript-content">
      <p><strong>[00:00]</strong> Hey everyone, Alex here. Welcome back. In this lesson, we're covering one of the most important JavaScript fundamentals: variables.</p>
      
      <p><strong>[00:11]</strong> Think of a variable as a labeled container. You put a value in that container so you can use it later in your program.</p>
      
      <p><strong>[00:23]</strong> In JavaScript, you'll see three keywords for declaring variables: var, let, and const. In modern code, you'll mostly use let and const.</p>
      
      <p><strong>[00:36]</strong> Let's start with let. If you write, let name equals John, you've created a variable called name, and stored the text John inside it.</p>
      
      <p><strong>[00:49]</strong> Now let's look at const. Use const when a value should not be reassigned. For example, const PI equals 3 point 1 4 1 5 9.</p>
      
      <p><strong>[01:01]</strong> Variables can hold different data types. Strings for text, numbers for math, booleans for true or false, and complex structures like arrays and objects.</p>
      
      <p><strong>[01:14]</strong> Here's a realistic scenario. Imagine you're building a shopping cart. You might start with let cartTotal equals zero, and each time a user adds an item, you update that total.</p>
      
      <p><strong>[01:31]</strong> Naming matters a lot. Instead of writing let x equals five, write let itemCount equals five. Clear names make your code easier to read, debug, and maintain.</p>
      
      <p><strong>[01:44]</strong> Quick recap. Use let for values that can change. Use const for values that should stay the same. And always choose descriptive variable names.</p>
      
      <p><strong>[01:55]</strong> Practice this with small examples every day, and variables will become second nature. Thanks for listening, and I'll see you in the next lesson.</p>
    </div>
    <a href="js-variables-transcript.txt" class="download-link" download>
      <span aria-hidden="true">📄</span> Download Complete Transcript (TXT)
    </a>
  </div>
</div>`,
                css: `.audio-lesson {
  max-width: 600px;
  padding: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}
.audio-lesson h3 {
  margin-top: 0;
  color: #1f2937;
}
audio {
  width: 100%;
  margin: 20px 0;
}
.meta {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 20px;
}
.transcript-section {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 2px solid #e5e7eb;
}
.transcript-section h4 {
  margin-top: 0;
  color: #374151;
  margin-bottom: 15px;
}
.transcript-content {
  background: #f9fafb;
  padding: 20px;
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
  border: 1px solid #e5e7eb;
}
.transcript-content p {
  margin: 12px 0;
  line-height: 1.7;
  color: #374151;
}
.download-link {
  display: inline-block;
  padding: 10px 18px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
}
.download-link:hover {
  background: #2563eb;
}`,
                js: "",
                context: "The audio lesson now includes a complete text transcript with timestamps that matches the spoken lesson. Deaf and hard-of-hearing users can read the entire educational content. Users who prefer reading to listening can access the information at their own pace. Users can quickly scan for specific topics or search for keywords. The transcript is searchable by search engines, improving discoverability. Users in noisy environments, users with audio processing difficulties, and users who want to take notes can all benefit. A downloadable text transcript is also provided for offline study. This makes the educational content accessible to everyone."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["deaf users", "hard-of-hearing users", "users in noisy environments", "users who prefer reading", "search engines"],
            keySummary: [
                "Provide complete text transcripts for all audio-only content",
                "Include timestamps in transcripts for easier navigation",
                "Transcripts should capture all spoken words and important sounds",
                "Offer downloadable transcript files for offline access",
                "Place transcripts near the audio player for easy discovery"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "1.2.2",
        principle: "Perceivable",
        title: "Captions (Prerecorded)",
        level: "A",
        description: "Captions are provided for all prerecorded audio content in synchronized media.",
        techniques: ["G93", "G87"],
        before: `<video src="wcag-1-2-2-sample.mp4" controls>
  <track kind="captions" srclang="en" label="English captions" default>
</video>`,
        after: `<video src="wcag-1-2-2-sample.mp4" controls>
  <track kind="captions" src="wcag-1-2-2-sample.vtt" srclang="en" label="English captions" default>
</video>`,
        explanation: "Include captions in videos showing dialogue and important sounds. Captions help deaf and hard-of-hearing users. They also help in noisy environments and when audio is muted.",
        examples: {
            before: {
                html: `<div class="video-lesson">
  <h3>WCAG 1.2.2 Demo Video</h3>
  <video width="100%" controls>
    <source src="wcag-1-2-2-sample.mp4" type="video/mp4">
    <track kind="captions" srclang="en" label="English captions" default>
    Your browser does not support the video tag.
  </video>
  <p class="video-meta">Duration: 5 seconds | Captions track present, but no caption file source</p>
</div>`,
                css: `.video-lesson {
  max-width: 800px;
  padding: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}
.video-lesson h3 {
  margin-top: 0;
  color: #1f2937;
}
video {
  border-radius: 6px;
  background: #000;
}
.video-meta {
  color: #6b7280;
  font-size: 14px;
  margin-top: 15px;
}`,
                js: "",
                context: "The video includes a captions track element, but the track has no src file. Because no caption resource is loaded, captions never render. This fails WCAG 1.2.2 just like having no captions at all."
            },
            after: {
                html: `<div class="video-lesson">
  <h3>WCAG 1.2.2 Demo Video</h3>
  <video width="100%" controls>
    <source src="wcag-1-2-2-sample.mp4" type="video/mp4">
    <track kind="captions" src="wcag-1-2-2-sample.vtt" srclang="en" label="English captions" default>
    Your browser does not support the video tag.
  </video>
  <p class="video-meta">Duration: 5 seconds | Captions: English (player CC option enabled)</p>
</div>`,
                css: `.video-lesson {
  max-width: 800px;
  padding: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}
.video-lesson h3 {
  margin-top: 0;
  color: #1f2937;
}
video {
  border-radius: 6px;
  background: #000;
}
video::cue {
  background-color: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  font-size: 1.1em;
  font-family: Arial, sans-serif;
}
.video-meta {
  color: #6b7280;
  font-size: 14px;
  margin-top: 15px;
}`,
                js: "",
                context: "This version uses a standard WebVTT captions source with a native captions track. The browser video player shows the built-in captions/CC option, and users can toggle captions from player controls."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["deaf users", "hard-of-hearing users", "users in noisy environments", "users who prefer reading"],
            keySummary: [
                "Include synchronized captions for all video content with audio",
                "Use WebVTT format with proper track element and src attribute",
                "Captions should include dialogue and important sound effects",
                "Ensure captions are readable with sufficient contrast",
                "Allow users to toggle captions on/off via player controls"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "1.3.1",
        principle: "Perceivable",
        title: "Info and Relationships",
        level: "A",
        description: "Information, structure, and relationships conveyed through presentation can be programmatically determined.",
        techniques: ["G115", "H42", "H48", "ARIA11"],
        before: `<div class="contact-info">
  <div style="font-weight: bold;">Contact Information</div>
  <div>
    <span style="font-weight: bold;">Name:</span> John Doe<br>
    <span style="font-weight: bold;">Email:</span> john@example.com<br>
    <span style="font-weight: bold;">Phone:</span> (555) 123-4567
  </div>
</div>`,
        after: `<section class="contact-info">
  <h2>Contact Information</h2>
  <dl>
    <dt>Name</dt>
    <dd>John Doe</dd>
    <dt>Email</dt>
    <dd>john@example.com</dd>
    <dt>Phone</dt>
    <dd>(555) 123-4567</dd>
  </dl>
</section>`,
        explanation: "Use semantic HTML to convey relationships. Definition lists, fieldsets, and proper labels help screen readers understand content structure and relationships.",
        examples: {
            before: {
                html: `<div class="contact-info">
  <div class="heading">Contact Information</div>
  <div class="info-list">
    <span class="label">Name:</span> John Doe<br>
    <span class="label">Email:</span> john@example.com<br>
    <span class="label">Phone:</span> (555) 123-4567
  </div>
</div>`,
                css: `.contact-info {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.heading {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 10px;
}
.label {
  font-weight: bold;
}`,
                js: "",
                context: "This contact information uses generic div and span elements with visual styling to create the appearance of structure. Screen readers cannot identify the heading as a heading or understand the relationship between labels and values. The structure is only visual, not semantic, making it difficult for assistive technology users to navigate and understand the content organization."
            },
            after: {
                html: `<section class="contact-info">
  <h2>Contact Information</h2>
  <dl>
    <dt>Name</dt>
    <dd>John Doe</dd>
    <dt>Email</dt>
    <dd>john@example.com</dd>
    <dt>Phone</dt>
    <dd>(555) 123-4567</dd>
  </dl>
</section>`,
                css: `.contact-info {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.contact-info h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
}
.contact-info dt {
  font-weight: bold;
  margin-top: 8px;
}
.contact-info dd {
  margin-left: 0;
}`,
                js: "",
                context: "Using semantic HTML elements conveys the structure programmatically. The h2 element identifies the heading, allowing screen readers to announce it as a heading and include it in the page outline. The definition list (dl, dt, dd) explicitly defines the relationship between terms and their definitions, enabling assistive technologies to announce these relationships and allow users to navigate between them efficiently."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "users with cognitive disabilities", "users navigating by headings"],
            keySummary: [
                "Use semantic HTML elements (h1-h6, nav, main, article, etc.)",
                "Use proper list markup (ul, ol, dl) for related items",
                "Use fieldset and legend for grouping form controls",
                "Use label elements properly associated with form inputs",
                "Avoid using visual styling alone to convey structure"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "1.3.2",
        principle: "Perceivable",
        title: "Meaningful Sequence",
        level: "A",
        description: "When sequence affects meaning, correct reading order can be programmatically determined.",
        techniques: ["G57", "H34", "C6", "C8"],
        before: `<div style="display: flex; flex-direction: row-reverse;">
  <div>Submit Button</div>
  <div>Form</div>
</div>`,
        after: `<form>
  <label for="name">Name:</label>
  <input id="name" type="text">
  <button type="submit">Submit</button>
</form>`,
        explanation: "HTML order should match the logical reading order. CSS can change visual appearance, but screen reader users follow the HTML structure. Don't rely on CSS to reorder important content.",
        examples: {
            before: {
                html: `<div class="checkout-form">
  <div class="payment-section" style="order: 1;">
    <h3>Payment Information</h3>
    <input type="text" placeholder="Card Number">
    <input type="text" placeholder="CVV">
  </div>
  
  <div class="shipping-section" style="order: 2;">
    <h3>Shipping Address</h3>
    <input type="text" placeholder="Street Address">
    <input type="text" placeholder="City">
  </div>
  
  <div class="contact-section" style="order: 3;">
    <h3>Contact Information</h3>
    <input type="email" placeholder="Email">
    <input type="tel" placeholder="Phone">
  </div>
</div>`,
                css: `.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  padding: 30px;
  background: #ffffff;
  border-radius: 8px;
}
.contact-section {
  order: 1;
}
.shipping-section {
  order: 2;
}
.payment-section {
  order: 3;
}
.checkout-form h3 {
  margin-top: 0;
  color: #1f2937;
}
.checkout-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}`,
                js: "",
                context: "This checkout form uses CSS flexbox order property to visually display sections in the order: Contact, Shipping, Payment. However, in the HTML DOM, the order is: Payment, Shipping, Contact. Screen reader users will hear the form in the wrong order (Payment first, Contact last), which is confusing and illogical. Users expect to provide contact information first, then shipping, then payment. This mismatch between visual presentation and DOM order creates a disorienting experience for screen reader users."
            },
            after: {
                html: `<div class="checkout-form">
  <div class="contact-section">
    <h3>Contact Information</h3>
    <input type="email" placeholder="Email">
    <input type="tel" placeholder="Phone">
  </div>
  
  <div class="shipping-section">
    <h3>Shipping Address</h3>
    <input type="text" placeholder="Street Address">
    <input type="text" placeholder="City">
  </div>
  
  <div class="payment-section">
    <h3>Payment Information</h3>
    <input type="text" placeholder="Card Number">
    <input type="text" placeholder="CVV">
  </div>
</div>`,
                css: `.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  padding: 30px;
  background: #ffffff;
  border-radius: 8px;
}
.checkout-form h3 {
  margin-top: 0;
  color: #1f2937;
}
.checkout-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}`,
                js: "",
                context: "The HTML DOM order now matches the logical and visual order: Contact Information, Shipping Address, Payment Information. Screen readers announce the form sections in the correct sequence that makes sense for completing a checkout. No CSS reordering is used, ensuring the reading order is predictable and matches user expectations. This creates a consistent, logical experience for all users regardless of how they access the content. Users can complete the form in a natural, intuitive order."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "users with cognitive disabilities", "keyboard users"],
            keySummary: [
                "Ensure HTML source order matches logical reading order",
                "Avoid using CSS (flexbox order, absolute positioning) to reorder content",
                "Test with screen readers to verify reading sequence",
                "Place form labels before their inputs in the DOM",
                "Keep navigation, main content, and sidebars in logical order"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "1.4.1",
        principle: "Perceivable",
        title: "Use of Color",
        level: "A",
        description: "Color is not used as the only visual means of conveying information.",
        techniques: ["G14", "G182", "G183", "G111"],
        before: `<div class="status-indicators">
  <div style="background: #dc3545; color: white; padding: 10px; margin: 5px; border-radius: 4px;">
    Server Status
  </div>
  <div style="background: #ffc107; color: black; padding: 10px; margin: 5px; border-radius: 4px;">
    Database Status
  </div>
  <div style="background: #28a745; color: white; padding: 10px; margin: 5px; border-radius: 4px;">
    API Status
  </div>
</div>`,
        after: `<div class="status-indicators">
  <div style="background: #dc3545; color: white; padding: 10px; margin: 5px; border-radius: 4px;">
    <span style="font-size: 1.2em;">⚠️</span> Server Status: <strong>Down</strong>
  </div>
  <div style="background: #ffc107; color: black; padding: 10px; margin: 5px; border-radius: 4px;">
    <span style="font-size: 1.2em;">⚡</span> Database Status: <strong>Warning</strong>
  </div>
  <div style="background: #28a745; color: white; padding: 10px; margin: 5px; border-radius: 4px;">
    <span style="font-size: 1.2em;">✓</span> API Status: <strong>Online</strong>
  </div>
</div>`,
        explanation: "Don't rely on color alone. Colorblind users (8% of males) can't distinguish red/green. Use text labels, patterns, icons, or symbols alongside color.",
        examples: {
            before: {
                html: `<form class="registration-form">
  <div class="form-group">
    <label for="username">Username</label>
    <input type="text" id="username" class="input-error" value="ab">
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" class="input-error" value="invalid-email">
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" class="input-success" value="SecurePass123!">
  </div>
  
  <div class="form-group">
    <label for="confirm">Confirm Password</label>
    <input type="password" id="confirm" class="input-success" value="SecurePass123!">
  </div>
</form>`,
                css: `.registration-form {
  max-width: 400px;
  padding: 20px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
.form-group input {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}
.input-error {
  border: 2px solid #dc2626;
  background: #fef2f2;
}
.input-success {
  border: 2px solid #16a34a;
  background: #f0fdf4;
}
.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #dc2626;
  font-size: 13px;
  margin-top: 5px;
  font-weight: 500;
}
.error-icon {
  font-weight: bold;
  font-size: 16px;
}
.success-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #16a34a;
  font-size: 13px;
  margin-top: 5px;
  font-weight: 500;
}
.success-icon {
  font-weight: bold;
  font-size: 16px;
}`,
                js: "",
                context: "This form uses only color to indicate validation status. Fields with errors have red borders and pink backgrounds, while valid fields have green borders and light green backgrounds. Users with red-green color blindness (deuteranopia or protanopia) cannot distinguish between error and success states. They cannot tell which fields need correction. This is a critical accessibility failure in forms where users must fix errors to proceed."
            },
            after: {
                html: `<form class="registration-form">
  <div class="form-group">
    <label for="username">Username</label>
    <input type="text" id="username" class="input-error" value="ab" aria-invalid="true" aria-describedby="username-error">
    <span class="error-message" id="username-error">
      <span class="error-icon">✕</span> Username must be at least 3 characters
    </span>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" class="input-error" value="invalid-email" aria-invalid="true" aria-describedby="email-error">
    <span class="error-message" id="email-error">
      <span class="error-icon">✕</span> Please enter a valid email address
    </span>
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" class="input-success" value="SecurePass123!" aria-invalid="false">
    <span class="success-message">
      <span class="success-icon">✓</span> Password is strong
    </span>
  </div>
  
  <div class="form-group">
    <label for="confirm">Confirm Password</label>
    <input type="password" id="confirm" class="input-success" value="SecurePass123!" aria-invalid="false">
    <span class="success-message">
      <span class="success-icon">✓</span> Passwords match
    </span>
  </div>
</form>`,
                css: `.registration-form {
  max-width: 400px;
  padding: 20px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
.form-group input {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}
.input-error {
  border: 2px solid #dc2626;
  background: #fef2f2;
}
.input-success {
  border: 2px solid #16a34a;
  background: #f0fdf4;
}
.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #dc2626;
  font-size: 13px;
  margin-top: 5px;
  font-weight: 500;
}
.error-icon {
  font-weight: bold;
  font-size: 16px;
}
.success-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #16a34a;
  font-size: 13px;
  margin-top: 5px;
  font-weight: 500;
}
.success-icon {
  font-weight: bold;
  font-size: 16px;
}`,
                js: "",
                context: "Each form field now includes explicit text messages with icons indicating validation status. Error fields show red borders PLUS an X icon and error message. Success fields show green borders PLUS a checkmark icon and success message. Users can understand validation status through multiple cues: color, icons, and text. This makes the form accessible to colorblind users who cannot distinguish red from green. The aria-invalid and aria-describedby attributes also provide programmatic information for screen readers."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["colorblind users", "users with low vision", "users on monochrome displays"],
            keySummary: [
                "Never use color as the only way to convey information",
                "Combine color with text labels, icons, or patterns",
                "Use explicit error messages, not just red borders",
                "Add symbols (✓, ✕) alongside color-coded status indicators",
                "Test with color blindness simulators to verify accessibility"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "1.4.2",
        principle: "Perceivable",
        title: "Audio Control",
        level: "A",
        description: "If audio plays automatically for more than 3 seconds, pause/stop mechanism is available.",
        techniques: ["G60", "G170", "G171"],
        before: `<audio autoplay loop>
  <source src="js-variables-lesson.wav" type="audio/wav">
</audio>`,
        after: `<button id="audioControl">Play Background Audio</button>
<audio id="bgAudio">
  <source src="js-variables-lesson.wav" type="audio/wav">
</audio>`,
        explanation: "Never auto-play audio. Give users control with play/pause buttons. Screen reader users need to hear only what they're focused on, not competing background audio.",
        examples: {
            before: {
                html: `<div class="audio-player-container">
  <h3>🎵 Welcome to Our Site</h3>
  <p>Enjoy our background music while you browse.</p>
  <div class="waveform">
    <div class="waveform-bar"></div>
    <div class="waveform-bar"></div>
    <div class="waveform-bar"></div>
    <div class="waveform-bar"></div>
    <div class="waveform-bar"></div>
  </div>
  <audio autoplay loop>
    <source src="js-variables-lesson.wav" type="audio/wav">
  </audio>
  <div class="audio-status">⚠️ AUTOPLAY ENABLED - Music starts automatically!</div>
</div>`,
                css: `.audio-player-container {
  padding: 25px;
  border-radius: 8px;
  max-width: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
.audio-player-container h3 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
}
.audio-player-container p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 15px;
}
.waveform {
  height: 50px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 10px;
}
.waveform-bar {
  width: 4px;
  height: 30%;
  background: rgba(255,255,255,0.4);
  border-radius: 2px;
  animation: wave 1s ease-in-out infinite;
}
@keyframes wave {
  0%, 100% { height: 20%; }
  50% { height: 80%; }
}
.waveform-bar:nth-child(1) { animation-delay: 0s; }
.waveform-bar:nth-child(2) { animation-delay: 0.2s; }
.waveform-bar:nth-child(3) { animation-delay: 0.4s; }
.waveform-bar:nth-child(4) { animation-delay: 0.2s; }
.waveform-bar:nth-child(5) { animation-delay: 0s; }
.audio-status {
  text-align: center;
  color: #fca5a5;
  font-weight: 600;
  font-size: 0.9em;
  margin-top: 10px;
}`,
                js: "",
                context: "This audio element has autoplay enabled, causing music to start playing immediately when the page loads. This creates a major accessibility barrier for screen reader users who cannot hear their assistive technology over the background music. It also startles users, violates user expectations, and can be disruptive in quiet environments like offices or libraries."
            },
            after: {
                html: `<div class="audio-player-container">
  <h3>🎵 Welcome to Our Site</h3>
  <p>Enjoy our background music while you browse.</p>
  <div class="waveform" id="waveform">
    <div class="waveform-bar"></div>
    <div class="waveform-bar"></div>
    <div class="waveform-bar"></div>
    <div class="waveform-bar"></div>
    <div class="waveform-bar"></div>
  </div>
  <div class="audio-status" id="audioStatus">🔇 Audio Stopped - Click Play to start</div>
  <div class="audio-controls">
    <button id="playPauseBtn" aria-label="Play background music">
      <span aria-hidden="true">▶️</span> Play
    </button>
    <button id="stopBtn" aria-label="Stop background music">
      <span aria-hidden="true">⏹️</span> Stop
    </button>
  </div>
  <audio id="bgAudio" loop>
    <source src="js-variables-lesson.wav" type="audio/wav">
  </audio>
</div>`,
                css: `.audio-player-container {
  padding: 25px;
  border-radius: 8px;
  max-width: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
.audio-player-container h3 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
}
.audio-player-container p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 15px;
}
.waveform {
  height: 50px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 10px;
}
.waveform-bar {
  width: 4px;
  height: 30%;
  background: rgba(255,255,255,0.4);
  border-radius: 2px;
  transition: height 0.3s ease;
}
.waveform.playing .waveform-bar {
  animation: wave 1s ease-in-out infinite;
}
@keyframes wave {
  0%, 100% { height: 20%; }
  50% { height: 80%; }
}
.waveform-bar:nth-child(1) { animation-delay: 0s; }
.waveform-bar:nth-child(2) { animation-delay: 0.2s; }
.waveform-bar:nth-child(3) { animation-delay: 0.4s; }
.waveform-bar:nth-child(4) { animation-delay: 0.2s; }
.waveform-bar:nth-child(5) { animation-delay: 0s; }
.audio-status {
  text-align: center;
  color: rgba(255,255,255,0.8);
  font-size: 0.9em;
  margin: 10px 0;
}
.audio-controls {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.audio-controls button {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  background: rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.audio-controls button:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}
.audio-controls button.playing {
  background: rgba(255,255,255,0.25);
  border-color: white;
}`,
                js: `const audio = document.getElementById('bgAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const waveform = document.getElementById('waveform');
const audioStatus = document.getElementById('audioStatus');

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = '<span aria-hidden="true">⏸️</span> Pause';
    playPauseBtn.setAttribute('aria-label', 'Pause background music');
    playPauseBtn.classList.add('playing');
    waveform.classList.add('playing');
    audioStatus.textContent = '🔊 Audio Playing';
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '<span aria-hidden="true">▶️</span> Play';
    playPauseBtn.setAttribute('aria-label', 'Play background music');
    playPauseBtn.classList.remove('playing');
    waveform.classList.remove('playing');
    audioStatus.textContent = '⏸️ Audio Paused';
  }
});

stopBtn.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
  playPauseBtn.innerHTML = '<span aria-hidden="true">▶️</span> Play';
  playPauseBtn.setAttribute('aria-label', 'Play background music');
  playPauseBtn.classList.remove('playing');
  waveform.classList.remove('playing');
  audioStatus.textContent = '🔇 Audio Stopped - Click Play to start';
});`,
                context: "The audio no longer autoplays. Users have full control through clearly labeled play, pause, and stop buttons. The waveform visualization animates when audio is playing, providing visual feedback. Screen reader users can hear their assistive technology without interference. Users can choose whether to enable the audio based on their environment and preferences. The controls have proper ARIA labels for accessibility."
            },
            interactive: {
                enabled: true
            },
            userGroups: ["screen reader users", "users with cognitive disabilities", "users in quiet environments"],
            keySummary: [
                "Never autoplay audio for more than 3 seconds",
                "Provide visible pause/stop controls at the top of the page",
                "Use user-initiated audio playback instead of autoplay",
                "Ensure audio controls are keyboard accessible",
                "Provide clear labels for audio control buttons"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "1.4.3",
        principle: "Perceivable",
        title: "Contrast (Minimum)",
        level: "AA",
        description: "Text and images of text have a contrast ratio of at least 4.5:1.",
        techniques: ["G18", "G145", "G148"],
        before: `<div class="notification-card" style="background: #FFFFFF; padding: 20px; border-radius: 8px;">
  <h3 style="color: #CCCCCC; margin-bottom: 10px;">Important Notice</h3>
  <p style="color: #DDDDDD; line-height: 1.6;">
    Your account will expire in 30 days. Please renew your subscription to continue accessing premium features.
  </p>
  <button style="background: #E0E0E0; color: #FFFFFF; border: none; padding: 10px 20px; border-radius: 4px;">
    Renew Now
  </button>
</div>`,
        after: `<div class="notification-card" style="background: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
  <h3 style="color: #212529; margin-bottom: 10px;">Important Notice</h3>
  <p style="color: #495057; line-height: 1.6;">
    Your account will expire in 30 days. Please renew your subscription to continue accessing premium features.
  </p>
  <button style="background: #0d6efd; color: #FFFFFF; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
    Renew Now
  </button>
</div>`,
        explanation: "Maintain 4.5:1 contrast between text and background. Test with WebAIM Contrast Checker. Users with low vision depend on good contrast for readability.",
        examples: {
            before: {
                html: `<div class="notification-card">
  <h3>Important Notice</h3>
  <p>
    Your account will expire in 30 days. Please renew your subscription to continue accessing premium features.
  </p>
  <button class="renew-btn">Renew Now</button>
</div>`,
                css: `.notification-card {
  background: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
}
.notification-card h3 {
  color: #CCCCCC;
  margin-bottom: 10px;
}
.notification-card p {
  color: #DDDDDD;
  line-height: 1.6;
}
.renew-btn {
  background: #E0E0E0;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}`,
                js: "",
                context: "This notification card uses very light gray text (#CCCCCC and #DDDDDD) on a white background, resulting in contrast ratios of approximately 1.6:1 and 1.4:1 respectively. This falls far below the WCAG AA requirement of 4.5:1, making the text extremely difficult to read for users with low vision, color blindness, or anyone viewing the screen in bright lighting conditions."
            },
            after: {
                html: `<div class="notification-card">
  <h3>Important Notice</h3>
  <p>
    Your account will expire in 30 days. Please renew your subscription to continue accessing premium features.
  </p>
  <button class="renew-btn">Renew Now</button>
</div>`,
                css: `.notification-card {
  background: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}
.notification-card h3 {
  color: #212529;
  margin-bottom: 10px;
}
.notification-card p {
  color: #495057;
  line-height: 1.6;
}
.renew-btn {
  background: #0d6efd;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}`,
                js: "",
                context: "The text colors have been changed to dark gray (#212529 for headings and #495057 for body text) which provide contrast ratios of 16:1 and 8.6:1 respectively against the white background. These ratios exceed the WCAG AA requirement of 4.5:1, ensuring the text is readable for users with low vision and in various viewing conditions. The button also uses a high-contrast blue background with white text."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with low vision", "users with color blindness", "older users", "users viewing in bright light"],
            keySummary: [
                "Ensure text has at least 4.5:1 contrast ratio against background",
                "Large text (18pt+ or 14pt+ bold) needs at least 3:1 contrast",
                "Use contrast checking tools during design phase",
                "Avoid light gray text on white backgrounds",
                "Test with actual users who have low vision"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "1.4.4",
        principle: "Perceivable",
        title: "Resize Text",
        level: "AA",
        description: "Text can be resized up to 200% without loss of functionality.",
        techniques: ["G142", "C12", "C13", "C14"],
        before: `body { font-size: 10px; }
.button { width: 100px; }`,
        after: `body { font-size: 16px; }
.button { width: 6.25rem; }
/* Use flexible units */`,
        explanation: "Use relative units (rem, em, %) not fixed pixels. Test at 200% zoom. Content should reflow without horizontal scrolling. Users with low vision may zoom frequently.",
        examples: {
            before: {
                html: `<div class="content-container">
  <h2>Article Title</h2>
  <p class="intro">This is an important article about web accessibility and responsive design principles.</p>
  <div class="button-group">
    <button class="action-btn">Read More</button>
    <button class="action-btn">Share</button>
  </div>
</div>`,
                css: `.content-container {
  width: 600px;
  padding: 20px;
  border: 1px solid #ddd;
}
h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
.intro {
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 15px;
}
.button-group {
  display: flex;
  gap: 10px;
}
.action-btn {
  width: 100px;
  height: 35px;
  font-size: 12px;
  padding: 8px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
}`,
                js: "",
                context: "This layout uses fixed pixel values for all dimensions. When users zoom to 200%, the 600px container doesn't scale proportionally, causing horizontal scrolling. The 100px button width becomes too small for the enlarged text, causing text overflow. Fixed font sizes don't scale smoothly with browser zoom. Users with low vision who need to zoom cannot read the content comfortably without constant horizontal scrolling."
            },
            after: {
                html: `<div class="content-container">
  <h2>Article Title</h2>
  <p class="intro">This is an important article about web accessibility and responsive design principles.</p>
  <div class="button-group">
    <button class="action-btn">Read More</button>
    <button class="action-btn">Share</button>
  </div>
</div>`,
                css: `.content-container {
  max-width: 37.5rem;
  padding: 1.25rem;
  border: 1px solid #ddd;
}
h2 {
  font-size: 1.5rem;
  margin-bottom: 0.625rem;
}
.intro {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}
.button-group {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}
.action-btn {
  min-width: 6.25rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 0.25rem;
  white-space: nowrap;
}`,
                js: "",
                context: "All dimensions now use relative units (rem, em). The container uses max-width instead of fixed width, allowing it to scale with zoom. Font sizes use rem units that scale proportionally with browser zoom settings. Buttons use min-width and padding instead of fixed dimensions, allowing them to grow with content. The layout reflows gracefully at 200% zoom without horizontal scrolling. Users with low vision can zoom comfortably while maintaining full functionality."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with low vision", "users who zoom text", "older users"],
            keySummary: [
                "Allow text to be resized up to 200% without loss of functionality",
                "Use relative units (em, rem, %) instead of fixed pixels",
                "Test zoom functionality in multiple browsers",
                "Ensure layouts don't break when text is enlarged",
                "Avoid horizontal scrolling when text is zoomed"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "1.4.5",
        principle: "Perceivable",
        title: "Images of Text",
        level: "AA",
        description: "If visual design can be made with text alone, don't use images for text.",
        techniques: ["G140", "C22", "C30"],
        before: `<img src="welcome-banner.png" alt="Welcome">`,
        after: `<h1 style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
             color: white; padding: 20px;">
  Welcome
</h1>`,
        explanation: "Use text with CSS styling to achieve visual effects. Text is searchable, selectable, scalable, and accessible. Screen readers and search engines understand text.",
        examples: {
            before: {
                html: `<div class="pricing-card">
  <img src="premium-plan-title.png" alt="Premium Plan" width="280" height="60">
  <img src="price-99-month.png" alt="$99 per month" width="200" height="80">
  <img src="features-list.png" alt="Unlimited storage, 24/7 support, Advanced analytics, Priority updates" width="280" height="200">
  <img src="buy-now-button.png" alt="Buy Now" width="200" height="50">
</div>`,
                css: `.pricing-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 320px;
}
.pricing-card img {
  display: block;
  margin: 15px auto;
  max-width: 100%;
}`,
                js: "",
                context: "This pricing card uses images for all text: the plan title, price, features list, and call-to-action button. Users cannot select or copy the price to compare with other services. Search engines cannot index the pricing information or features. Screen readers only announce generic alt text without proper semantic structure (no heading hierarchy, no list structure). Users who zoom in see pixelated text. Users with custom high contrast settings cannot apply their preferences. The button image is not keyboard accessible and doesn't provide proper focus states."
            },
            after: {
                html: `<div class="pricing-card">
  <h3 class="plan-title">Premium Plan</h3>
  <div class="price">
    <span class="currency">$</span>
    <span class="amount">99</span>
    <span class="period">/month</span>
  </div>
  <ul class="features-list">
    <li><span class="icon">✓</span> Unlimited storage</li>
    <li><span class="icon">✓</span> 24/7 support</li>
    <li><span class="icon">✓</span> Advanced analytics</li>
    <li><span class="icon">✓</span> Priority updates</li>
  </ul>
  <button class="cta-button">Buy Now</button>
</div>`,
                css: `.pricing-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  text-align: center;
  max-width: 320px;
  color: white;
}
.plan-title {
  margin: 0 0 20px 0;
  font-size: 1.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.price {
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
}
.currency {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 8px;
}
.amount {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
}
.period {
  font-size: 1rem;
  font-weight: 400;
  align-self: flex-end;
  margin-bottom: 12px;
  opacity: 0.9;
}
.features-list {
  list-style: none;
  padding: 0;
  margin: 25px 0;
  text-align: left;
}
.features-list li {
  padding: 10px 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.features-list .icon {
  font-weight: bold;
  font-size: 1.2rem;
  color: #4ade80;
}
.cta-button {
  width: 100%;
  padding: 15px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.cta-button:focus {
  outline: 3px solid #4ade80;
  outline-offset: 2px;
}`,
                js: "",
                context: "All text is now real HTML with semantic structure. The h3 heading provides proper document outline. The price uses separate spans for flexible styling and screen reader clarity. The features are in a proper ul list that screen readers can navigate efficiently. Users can select and copy the price or features to compare with competitors. Search engines can index all pricing information. The text remains sharp at any zoom level. The button is keyboard accessible with proper focus states. Users with high contrast mode can apply their settings. The design is achieved entirely with CSS gradients, colors, and typography while maintaining full accessibility."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with low vision", "users with custom stylesheets", "users with high contrast mode", "keyboard users", "screen reader users", "search engines"],
            keySummary: [
                "Use actual text instead of images of text whenever possible",
                "If images of text are necessary, provide high resolution versions",
                "Use CSS for visual text styling instead of images",
                "Logos and brand names are acceptable as images",
                "Ensure any essential images of text have proper alt text"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "1.4.6",
        principle: "Perceivable",
        title: "Contrast (Enhanced)",
        level: "AAA",
        description: "Text and images of text have a contrast ratio of at least 7:1.",
        techniques: ["G17", "G18", "G148"],
        before: `<p style="color: #555555; background: #FFFFFF;">
  Minimum contrast (3:1 ratio)
</p>`,
        after: `<p style="color: #000000; background: #FFFFFF;">
  Enhanced contrast (22:1 ratio)
</p>`,
        explanation: "7:1 contrast is recommended for AAA compliance and specialized applications. Better for users with severe low vision and elderly users reading small text.",
        examples: {
            before: {
                html: `<div class="content-card">
  <h3>Product Features</h3>
  <p>Our product offers advanced capabilities with an intuitive interface designed for modern workflows.</p>
  <button>Learn More</button>
</div>`,
                css: `.content-card {
  background: #FFFFFF;
  padding: 24px;
  border-radius: 8px;
  max-width: 500px;
}
.content-card h3 {
  color: #666666;
  margin-top: 0;
}
.content-card p {
  color: #777777;
  line-height: 1.6;
}
.content-card button {
  background: #999999;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
}`,
                js: "",
                context: "This content card uses medium gray colors that provide contrast ratios of approximately 5.7:1 for the heading and 4.7:1 for body text. While these meet WCAG AA standards (4.5:1), they fall short of the AAA enhanced contrast requirement of 7:1. Users with severe low vision or age-related vision decline may still struggle to read this content comfortably."
            },
            after: {
                html: `<div class="content-card">
  <h3>Product Features</h3>
  <p>Our product offers advanced capabilities with an intuitive interface designed for modern workflows.</p>
  <button>Learn More</button>
</div>`,
                css: `.content-card {
  background: #FFFFFF;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  max-width: 500px;
}
.content-card h3 {
  color: #000000;
  margin-top: 0;
}
.content-card p {
  color: #1a1a1a;
  line-height: 1.6;
}
.content-card button {
  background: #0056b3;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}`,
                js: "",
                context: "The text colors have been changed to pure black (#000000) for the heading and near-black (#1a1a1a) for body text, providing contrast ratios of 21:1 and 16.1:1 respectively. These ratios far exceed the AAA requirement of 7:1, ensuring maximum readability for users with severe low vision, older users, and anyone reading in challenging lighting conditions. The enhanced contrast reduces eye strain and improves reading speed."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with severe low vision", "older users", "users with contrast sensitivity", "users in bright environments"],
            keySummary: [
                "Achieve at least 7:1 contrast ratio for normal text (AAA level)",
                "Large text needs at least 4.5:1 contrast ratio",
                "This is an enhanced version of 1.4.3 for better accessibility",
                "Benefits users with moderately low vision",
                "Use high contrast themes or modes for better readability"
            ],
            principle: "Perceivable"
        }
    },
    {
        id: "2.1.1",
        principle: "Operable",
        title: "Keyboard",
        level: "A",
        description: "All functionality is operable through keyboard interface.",
        techniques: ["G202", "H91", "ARIA2", "ARIA4"],
        before: `<div class="status-toolbar">
  <div class="status-chip" onclick="setStatusFilter('all')">All Tickets</div>
  <div class="status-chip" onclick="setStatusFilter('open')">Open</div>
  <div class="status-chip" onclick="setStatusFilter('pending')">Pending</div>
  <div class="status-chip" onclick="setStatusFilter('resolved')">Resolved</div>
</div>
<p>Current filter: All Tickets</p>`,
        after: `<div class="status-toolbar" role="toolbar" aria-label="Ticket status filters">
  <button type="button" class="status-chip" aria-pressed="true" onclick="setStatusFilter('all', this)">All Tickets</button>
  <button type="button" class="status-chip" aria-pressed="false" onclick="setStatusFilter('open', this)">Open</button>
  <button type="button" class="status-chip" aria-pressed="false" onclick="setStatusFilter('pending', this)">Pending</button>
  <button type="button" class="status-chip" aria-pressed="false" onclick="setStatusFilter('resolved', this)">Resolved</button>
</div>
<p role="status" aria-live="polite">Current filter: All Tickets</p>`,
        explanation: "A ticket dashboard with status filters must work without a mouse. If filter chips are implemented as clickable div elements only, keyboard users cannot reach or activate them, so the interface fails WCAG 2.1.1.",
        examples: {
            before: {
                html: `<div class="ticket-shell">
  <div class="ticket-header">
    <h3>Support Queue Filters</h3>
    <span class="queue-count">23 open tickets</span>
  </div>

  <p class="toolbar-label">Filter tickets by status:</p>
  <div class="status-toolbar" aria-label="Ticket status filters">
    <div class="status-chip active" data-filter="all">All Tickets</div>
    <div class="status-chip" data-filter="open">Open</div>
    <div class="status-chip" data-filter="pending">Pending</div>
    <div class="status-chip" data-filter="resolved">Resolved</div>
  </div>

  <p id="statusBeforeMessage" class="status-message">Current filter: All Tickets</p>
  <p class="helper-text">Inaccessible implementation: filter chips are clickable div elements only.</p>
</div>
<p class="helper-text">Keyboard users cannot tab to these controls or activate a filter without a mouse.</p>`,
                css: `.ticket-shell {
  max-width: 560px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: #ffffff;
  padding: 16px;
}
.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
}
.ticket-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}
.queue-count {
  font-size: 13px;
  color: #6b7280;
}
.toolbar-label {
  margin: 14px 0 8px;
  font-weight: 600;
  color: #374151;
}
.status-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 7px 12px;
  background: #f3f4f6;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}
.status-chip.active {
  border-color: #b91c1c;
  background: #fee2e2;
  color: #991b1b;
}
.status-chip:hover {
  background: #e5e7eb;
}
.status-message {
  margin: 12px 0 6px;
  font-size: 14px;
  color: #111827;
}
.helper-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: #991b1b;
}`,
                js: `const beforeChips = Array.from(document.querySelectorAll('.status-chip'));
const beforeMessage = document.getElementById('statusBeforeMessage');

function activateBeforeChip(chip) {
  beforeChips.forEach(function(current) {
    current.classList.remove('active');
  });
  chip.classList.add('active');
  beforeMessage.textContent = 'Current filter: ' + chip.textContent;
}

beforeChips.forEach(function(chip) {
  chip.addEventListener('click', function() {
    activateBeforeChip(chip);
  });

  chip.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
    }
  });
});`,
                context: "Inaccessible behavior in this support dashboard: status filters are custom div elements that respond only to mouse clicks. They are not keyboard focusable, so Tab skips all filter controls. Keyboard users and many assistive technology users cannot switch ticket status views."
            },
            after: {
                html: `<div class="ticket-shell">
  <div class="ticket-header">
    <h3>Support Queue Filters</h3>
    <span class="queue-count">23 open tickets</span>
  </div>

  <p class="toolbar-label">Filter tickets by status:</p>
  <div class="status-toolbar" role="toolbar" aria-label="Ticket status filters">
    <button type="button" class="status-chip active" data-filter="all" aria-pressed="true">All Tickets</button>
    <button type="button" class="status-chip" data-filter="open" aria-pressed="false">Open</button>
    <button type="button" class="status-chip" data-filter="pending" aria-pressed="false">Pending</button>
    <button type="button" class="status-chip" data-filter="resolved" aria-pressed="false">Resolved</button>
  </div>

  <p id="statusAfterMessage" class="status-message success-text" role="status" aria-live="polite">Current filter: All Tickets</p>
  <p class="helper-text success-text">Accessible implementation: filter chips are native buttons with keyboard support and pressed state.</p>
</div>
<p class="helper-text success-text">Tab reaches each filter. Enter or Space activates it, and Arrow keys move focus across the toolbar.</p>`,
                css: `.ticket-shell {
  max-width: 560px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #ffffff;
  padding: 16px;
}
.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
}
.ticket-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1e3a8a;
}
.queue-count {
  font-size: 13px;
  color: #1d4ed8;
}
.toolbar-label {
  margin: 14px 0 8px;
  font-weight: 600;
  color: #1e3a8a;
}
.status-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.status-chip {
  border: 1px solid #2563eb;
  border-radius: 999px;
  padding: 7px 12px;
  background: #eff6ff;
  color: #1e3a8a;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.status-chip:hover {
  background: #dbeafe;
}
.status-chip:focus {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}
.status-chip[aria-pressed="true"] {
  background: #2563eb;
  color: #ffffff;
}
.status-message {
  margin: 12px 0 6px;
  font-size: 14px;
  color: #0f172a;
}
.helper-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: #1f2937;
}
.success-text {
  color: #14532d;
}`,
                js: `const afterChips = Array.from(document.querySelectorAll('.status-chip'));
const afterMessage = document.getElementById('statusAfterMessage');

function activateAfterChip(chip) {
  afterChips.forEach(function(current) {
    const isActive = current === chip;
    current.classList.toggle('active', isActive);
    current.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  afterMessage.textContent = 'Current filter: ' + chip.textContent;
}

afterChips.forEach(function(chip) {
  chip.addEventListener('click', function() {
    activateAfterChip(chip);
  });

  chip.addEventListener('keydown', function(event) {
    const index = afterChips.indexOf(chip);

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      afterChips[(index + 1) % afterChips.length].focus();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      afterChips[(index - 1 + afterChips.length) % afterChips.length].focus();
    }
  });
});

activateAfterChip(afterChips[0]);`,
                context: "Accessible behavior in this support dashboard: status filters are native button elements grouped in a toolbar. Buttons are in the Tab order, Enter and Space work by default, and focus is visibly indicated. Arrow key navigation helps users move across the filter set, while aria-pressed communicates the active state."
            },
            interactive: {
                enabled: true,
                instructions: "Try keyboard-only use. In the Before example, press Tab and notice the status filters are skipped because they are div elements. In the After example, Tab reaches each filter button; use Enter or Space to activate a filter and Left or Right Arrow keys to move focus across the toolbar."
            },
            userGroups: ["keyboard users", "screen reader users", "users with motor disabilities"],
            keySummary: [
                "Ensure all functionality is available via keyboard",
                "Use native HTML elements (button, a, input) for interactive elements",
                "Add tabindex=\"0\" to custom interactive elements",
                "Implement keyboard event handlers (keydown, keyup) for custom controls",
                "Test navigation using only Tab, Enter, Space, and Arrow keys"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.1.2",
        principle: "Operable",
        title: "No Keyboard Trap",
        level: "A",
        description: "Keyboard focus can be moved away using only keyboard.",
        techniques: ["G21", "H91", "FLASH17"],
        before: `<div tabindex="0" onkeydown="event.preventDefault()">
  Stuck!
</div>`,
        after: `<dialog role="dialog" aria-modal="true">
  <h2>Confirm Action</h2>
  <button>Cancel</button>
  <button>Confirm</button>
</dialog>`,
        explanation: "Never trap focus. Users must escape using Tab or Escape. Modals need focus management-focus should move to the modal and trap there, then restore on close.",
        examples: {
            before: {
                html: `<div class="booking-form">
  <h2>Book Your Appointment</h2>
  <form>
    <div class="form-group">
      <label for="name">Full Name</label>
      <input type="text" id="name" placeholder="John Doe">
    </div>
    
    <div class="form-group">
      <label for="dateInput">Select Date</label>
      <input type="text" 
             id="dateInput" 
             placeholder="MM/DD/YYYY" 
             readonly
             onclick="openTrappedCalendar()"
             onkeydown="trapInDateInput(event)">
      
      <div id="trappedCalendar" class="calendar-popup" style="display: none;">
        <div class="calendar-header">
          <span class="nav-btn" onclick="prevMonth()">‹</span>
          <span class="month-year">January 2024</span>
          <span class="nav-btn" onclick="nextMonth()">›</span>
        </div>
        <div class="calendar-grid" tabindex="0" onkeydown="trapInCalendar(event)">
          <div class="day-cell" onclick="selectDate('01')">1</div>
          <div class="day-cell" onclick="selectDate('02')">2</div>
          <div class="day-cell" onclick="selectDate('03')">3</div>
          <div class="day-cell" onclick="selectDate('04')">4</div>
          <div class="day-cell" onclick="selectDate('05')">5</div>
          <div class="day-cell" onclick="selectDate('06')">6</div>
          <div class="day-cell" onclick="selectDate('07')">7</div>
        </div>
      </div>
    </div>
    
    <div class="form-group">
      <label for="time">Preferred Time</label>
      <select id="time">
        <option>9:00 AM</option>
        <option>10:00 AM</option>
        <option>11:00 AM</option>
      </select>
    </div>
    
    <button type="submit">Book Appointment</button>
  </form>
</div>`,
                css: `.booking-form {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.booking-form h2 {
  margin: 0 0 25px 0;
  color: #1f2937;
}
.form-group {
  margin-bottom: 20px;
  position: relative;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}
.form-group input[readonly] {
  background: #f9fafb;
  cursor: pointer;
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
  user-select: none;
}
.nav-btn:hover {
  background: #e5e7eb;
}
.month-year {
  font-weight: 600;
  color: #1f2937;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  outline: none;
}
.calendar-grid:focus {
  box-shadow: 0 0 0 2px #3b82f6;
  border-radius: 4px;
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
  background: #e5e7eb;
}
button[type="submit"] {
  width: 100%;
  padding: 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}
button[type="submit"]:hover {
  background: #2563eb;
}`,
                js: `function openTrappedCalendar() {
  const calendar = document.getElementById('trappedCalendar');
  calendar.style.display = 'block';
  
  // Force focus into the calendar grid
  setTimeout(() => {
    document.querySelector('.calendar-grid').focus();
  }, 100);
}

function trapInDateInput(event) {
  // When calendar is open, prevent Tab from leaving the date input
  const calendar = document.getElementById('trappedCalendar');
  if (calendar.style.display === 'block') {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      // Force focus back to calendar grid
      document.querySelector('.calendar-grid').focus();
    }
  }
}

function trapInCalendar(event) {
  // Trap ALL keyboard navigation within calendar
  if (event.key === 'Tab' || 
      event.key === 'Escape' || 
      event.key === 'Enter' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight') {
    event.preventDefault();
    event.stopPropagation();
    // Keep focus trapped in the calendar grid
    event.target.focus();
  }
}

function selectDate(day) {
  document.getElementById('dateInput').value = '01/' + day + '/2024';
  document.getElementById('trappedCalendar').style.display = 'none';
}

function prevMonth() {
  document.querySelector('.month-year').textContent = 'December 2023';
}

function nextMonth() {
  document.querySelector('.month-year').textContent = 'February 2024';
}`,
                context: "This date picker creates a severe keyboard trap. When users click the date input, the calendar opens and focus is forced into the calendar grid. The calendar grid blocks ALL keyboard keys: Tab, Escape, Enter, and all Arrow keys. Users cannot tab to navigation buttons or day cells. They cannot press Escape to close the calendar. They cannot use Arrow keys to navigate. The navigation buttons and day cells are non-focusable div/span elements that only work with mouse clicks. Even if users try to tab away from the calendar, the date input also has a trap that forces focus back to the calendar. Keyboard users are completely stuck with no way to select a date, close the calendar, or continue to other form fields. They must reload the page to escape. This demonstrates a complete keyboard trap that makes the booking form entirely unusable for keyboard-only users."
            },
            after: {
                html: `<div class="booking-form">
  <h2>Book Your Appointment</h2>
  <form>
    <div class="form-group">
      <label for="name">Full Name</label>
      <input type="text" id="name" placeholder="John Doe">
    </div>
    
    <div class="form-group">
      <label for="dateInput">Select Date</label>
      <div class="date-picker-wrapper">
        <input type="text" 
               id="dateInput" 
               placeholder="MM/DD/YYYY" 
               readonly
               aria-haspopup="dialog"
               aria-expanded="false"
               onclick="openAccessibleCalendar()">
        <button type="button" 
                class="calendar-icon-btn" 
                onclick="openAccessibleCalendar()"
                aria-label="Open calendar">📅</button>
      </div>
      
      <div id="accessibleCalendar" 
           class="calendar-popup" 
           role="dialog"
           aria-modal="true"
           aria-label="Choose date"
           style="display: none;">
        <div class="calendar-header">
          <button type="button" 
                  class="nav-btn" 
                  onclick="prevMonth()"
                  aria-label="Previous month">‹</button>
          <h3 class="month-year" id="monthYear">January 2024</h3>
          <button type="button" 
                  class="nav-btn" 
                  onclick="nextMonth()"
                  aria-label="Next month">›</button>
        </div>
        <div class="calendar-grid" role="grid">
          <button type="button" class="day-cell" onclick="selectDate('01')">1</button>
          <button type="button" class="day-cell" onclick="selectDate('02')">2</button>
          <button type="button" class="day-cell" onclick="selectDate('03')">3</button>
          <button type="button" class="day-cell" onclick="selectDate('04')">4</button>
          <button type="button" class="day-cell" onclick="selectDate('05')">5</button>
          <button type="button" class="day-cell" onclick="selectDate('06')">6</button>
          <button type="button" class="day-cell" onclick="selectDate('07')">7</button>
        </div>
        <div class="calendar-footer">
          <button type="button" class="btn-close" onclick="closeAccessibleCalendar()">Close</button>
        </div>
      </div>
    </div>
    
    <div class="form-group">
      <label for="time">Preferred Time</label>
      <select id="time">
        <option>9:00 AM</option>
        <option>10:00 AM</option>
        <option>11:00 AM</option>
      </select>
    </div>
    
    <button type="submit">Book Appointment</button>
  </form>
</div>`,
                css: `.booking-form {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.booking-form h2 {
  margin: 0 0 25px 0;
  color: #1f2937;
}
.form-group {
  margin-bottom: 20px;
  position: relative;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}
.date-picker-wrapper {
  position: relative;
  display: flex;
  gap: 8px;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
}
.form-group input[readonly] {
  background: #f9fafb;
  cursor: pointer;
}
.calendar-icon-btn {
  padding: 12px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
}
.calendar-icon-btn:hover {
  background: #2563eb;
}
.calendar-icon-btn:focus {
  outline: 2px solid #1e40af;
  outline-offset: 2px;
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
}
.nav-btn:hover {
  background: #e5e7eb;
}
.nav-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
.month-year {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
  margin: 0;
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
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}
.day-cell:hover {
  background: #e5e7eb;
}
.day-cell:focus {
  outline: none;
  border-color: #3b82f6;
  background: #dbeafe;
}
.calendar-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}
.btn-close {
  width: 100%;
  padding: 10px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
.btn-close:hover {
  background: #e5e7eb;
}
.btn-close:focus {
  outline: 2px solid #6b7280;
  outline-offset: 2px;
}
button[type="submit"] {
  width: 100%;
  padding: 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}
button[type="submit"]:hover {
  background: #2563eb;
}
button[type="submit"]:focus {
  outline: 2px solid #1e40af;
  outline-offset: 2px;
}`,
                js: `let lastFocusedElement;

function openAccessibleCalendar() {
  lastFocusedElement = document.activeElement;
  const calendar = document.getElementById('accessibleCalendar');
  const dateInput = document.getElementById('dateInput');
  
  calendar.style.display = 'block';
  dateInput.setAttribute('aria-expanded', 'true');
  
  // Focus first day button
  setTimeout(() => {
    calendar.querySelector('.day-cell').focus();
  }, 100);
  
  // Add keyboard event listeners
  calendar.addEventListener('keydown', handleCalendarKeydown);
}

function closeAccessibleCalendar() {
  const calendar = document.getElementById('accessibleCalendar');
  const dateInput = document.getElementById('dateInput');
  
  calendar.style.display = 'none';
  dateInput.setAttribute('aria-expanded', 'false');
  calendar.removeEventListener('keydown', handleCalendarKeydown);
  
  // Restore focus
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function handleCalendarKeydown(event) {
  // Close calendar on Escape
  if (event.key === 'Escape') {
    closeAccessibleCalendar();
  }
}

function selectDate(day) {
  document.getElementById('dateInput').value = '01/' + day + '/2024';
  closeAccessibleCalendar();
}

function prevMonth() {
  document.getElementById('monthYear').textContent = 'December 2023';
}

function nextMonth() {
  document.getElementById('monthYear').textContent = 'February 2024';
}`,
                context: "This date picker allows full keyboard navigation. Users can Tab through all elements: date input, calendar button, previous month button, month/year display, next month button, all day cells, and close button. Escape key closes the calendar and returns focus to the triggering element. All interactive elements are proper button elements that work with Enter and Space keys. Day cells can be navigated with Tab and selected with Enter. Focus indicators are visible on all controls. When the calendar closes, focus returns to the element that opened it. Users can freely navigate in and out of the calendar. This follows the 'No Keyboard Trap' guideline by providing standard keyboard navigation and an Escape key to exit."
            },
            interactive: {
                enabled: true,
                instructions: "Click the date input or calendar button to open the calendar. Press Tab to navigate through month navigation buttons and day cells. Press Enter or Space to select a date. Press Escape to close the calendar. Notice how you can freely navigate all elements and always escape with the Escape key."
            },
            userGroups: ["keyboard users", "screen reader users", "users with motor disabilities"],
            keySummary: [
                "Ensure users can navigate away from any component using keyboard",
                "Avoid focus traps in modals, dialogs, and custom widgets",
                "Provide clear instructions for exiting keyboard-focused areas",
                "Implement proper focus management in single-page applications",
                "Test with keyboard-only navigation to identify traps"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.1.4",
        principle: "Operable",
        title: "Character Key Shortcuts",
        level: "A",
        description: "If a keyboard shortcut uses only letter, punctuation, number, or symbol characters, then at least one of the following is true: the shortcut can be turned off, remapped, or is only active when the relevant component has focus.",
        techniques: ["G217", "ARIA15"],
        before: `const ticketList = document.getElementById('ticket-list-before');
ticketList.addEventListener('click', (e) => {
  const row = e.target.closest('.ticket-row');
  if (!row) return;
  row.remove();
});`,
        after: `const ticketList = document.getElementById('ticket-list-after');
ticketList.addEventListener('keydown', (e) => {
  const row = e.target.closest('.ticket-row');
  const hasCtrl = e.ctrlKey || e.metaKey;
  if (!row || !hasCtrl || e.key !== 'Enter') return;
  e.preventDefault();
  row.remove();
});`,
        explanation: "A weak pattern is mouse-only archive behavior. A stronger pattern is keyboard support with Ctrl/Cmd+Enter so users can archive tickets without relying on pointer input.",
        examples: {
            before: {
                html: `<div class="shortcut-scope-demo">
  <h2>Ticket Queue (Before)</h2>
  <p class="shortcut-info warning"><strong>No keyboard archive:</strong> Archiving works only by mouse click in this example</p>

  <label for="agent-note-before">Agent note</label>
  <form id="note-form-before" class="note-form" novalidate>
    <input id="agent-note-before" type="text" placeholder="Type a note here...">
    <button type="submit" class="submit-btn">Submit note</button>
  </form>
  <div id="ticket-list-before" class="ticket-list">
    <button type="button" class="ticket-row">
      <span class="ticket-row-title">Ticket #1421 - Billing issue</span>
      <span class="ticket-row-note">Agent note: Customer asked for invoice copy.</span>
    </button>
  </div>

  <p id="status-before" role="status" aria-live="polite" class="status warning">Submit a note to create a ticket. Keyboard archive does not work in this inaccessible example.</p>
</div>`,
                css: `.shortcut-scope-demo {
  max-width: 640px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  padding: 16px;
  font-family: "Segoe UI", Tahoma, sans-serif;
}
.shortcut-scope-demo h2 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  color: #0f172a;
}
.shortcut-info {
  margin: 0 0 12px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
}
.shortcut-info.warning {
  background: #fee2e2;
  color: #991b1b;
}
.shortcut-scope-demo label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #334155;
}
.note-form {
  margin-bottom: 8px;
}
.ticket-list {
  margin-bottom: 12px;
}
.shortcut-scope-demo input,
.shortcut-scope-demo button {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
}
.shortcut-scope-demo button {
  background: #f8fafc;
  text-align: left;
  cursor: pointer;
}
.shortcut-scope-demo .submit-btn {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  text-align: center;
  font-weight: 600;
}
.ticket-row {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #f8fafc;
  text-align: left;
  cursor: pointer;
}
.ticket-row {
  margin-bottom: 8px;
}
.ticket-list .ticket-row:last-child {
  margin-bottom: 0;
}
.ticket-row-title,
.ticket-row-note {
  display: block;
}
.ticket-row-title {
  font-weight: 600;
  color: #0f172a;
}
.ticket-row-note {
  margin-top: 4px;
  color: #475569;
  font-size: 0.85rem;
}
.status {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}
.status.warning {
  color: #b91c1c;
}
kbd {
  padding: 1px 6px;
  border-radius: 4px;
  background: #111827;
  color: #ffffff;
  font-size: 0.78rem;
}`,
                js: `// PROBLEM: archive behavior is mouse-only in this example
const statusBefore = document.getElementById('status-before');
const noteFormBefore = document.getElementById('note-form-before');
const noteInputBefore = document.getElementById('agent-note-before');
const ticketListBefore = document.getElementById('ticket-list-before');
let nextTicketBefore = 1422;

function createBeforeTicket(noteText) {
  const row = document.createElement('div');
  row.className = 'ticket-row';

  const title = document.createElement('span');
  title.className = 'ticket-row-title';
  title.textContent = 'Ticket #' + nextTicketBefore + ' - Billing issue';

  const note = document.createElement('span');
  note.className = 'ticket-row-note';
  note.textContent = 'Agent note: ' + noteText;

  row.appendChild(title);
  row.appendChild(note);
  nextTicketBefore += 1;
  return row;
}

noteFormBefore.addEventListener('submit', (e) => {
  e.preventDefault();
  const note = noteInputBefore.value.trim();
  if (!note) {
    statusBefore.textContent = 'Please type a note before submitting.';
    return;
  }

  const newTicket = createBeforeTicket(note);
  ticketListBefore.appendChild(newTicket);
  statusBefore.textContent = 'New ticket created from submitted note.';
  noteInputBefore.value = '';
  noteInputBefore.focus();
});

document.addEventListener('keydown', (e) => {
  const hasCtrl = e.ctrlKey || e.metaKey;
  if (!hasCtrl || e.key !== 'Enter') return;

  statusBefore.textContent = 'Keyboard shortcut does not archive in this inaccessible example.';
});

ticketListBefore.addEventListener('click', (e) => {
  const row = e.target.closest('.ticket-row');
  if (!row) return;
  const removedTitle = row.querySelector('.ticket-row-title')?.textContent || 'Ticket';
  row.remove();
  statusBefore.textContent = 'Mouse archive: ' + removedTitle + ' removed.';
});`,
                context: "ACCESSIBILITY FAILURE: Submitting a note creates a new ticket, but archiving is mouse-only. Keyboard users cannot archive tickets using a key command."
            },
            after: {
                html: `<div class="shortcut-scope-demo">
  <h2>Ticket Queue (After)</h2>
  <p class="shortcut-info success"><strong>Shortcut requires Ctrl key:</strong> Focus ticket row, then press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to archive</p>

  <label for="agent-note-after">Agent note</label>
  <form id="note-form-after" class="note-form" novalidate>
    <input id="agent-note-after" type="text" placeholder="Type a note here...">
    <button type="submit" class="submit-btn">Submit note</button>
  </form>
  <div id="ticket-list-after" class="ticket-list">
    <button id="ticket-row-after" type="button" class="ticket-row" aria-keyshortcuts="Control+Enter">
      <span class="ticket-row-title">Ticket #1421 - Billing issue</span>
      <span class="ticket-row-note">Agent note: Customer asked for invoice copy.</span>
    </button>
  </div>

  <p id="status-after" role="status" aria-live="polite" class="status success">Submit note normally. Focus ticket row and press Ctrl+Enter to archive and remove it.</p>
</div>`,
                css: `.shortcut-scope-demo {
  max-width: 640px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  padding: 16px;
  font-family: "Segoe UI", Tahoma, sans-serif;
}
.shortcut-scope-demo h2 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  color: #0f172a;
}
.shortcut-info {
  margin: 0 0 12px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
}
.shortcut-info.success {
  background: #dcfce7;
  color: #166534;
}
.shortcut-scope-demo label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #334155;
}
.note-form {
  margin-bottom: 8px;
}
.ticket-list {
  margin-bottom: 12px;
}
.shortcut-scope-demo input,
.shortcut-scope-demo button {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
}
.shortcut-scope-demo button {
  background: #f8fafc;
  text-align: left;
  cursor: pointer;
}
.shortcut-scope-demo .submit-btn {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  text-align: center;
  font-weight: 600;
}
.ticket-row {
  margin-bottom: 8px;
}
.ticket-list .ticket-row:last-child {
  margin-bottom: 0;
}
.ticket-row-title,
.ticket-row-note {
  display: block;
}
.ticket-row-title {
  font-weight: 600;
  color: #0f172a;
}
.ticket-row-note {
  margin-top: 4px;
  color: #475569;
  font-size: 0.85rem;
}
.shortcut-scope-demo button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.status {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}
.status.success {
  color: #166534;
}
kbd {
  padding: 1px 6px;
  border-radius: 4px;
  background: #111827;
  color: #ffffff;
  font-size: 0.78rem;
}`,
                js: `// SOLUTION: each submitted note becomes a new ticket and archive requires Ctrl+Enter
const statusAfter = document.getElementById('status-after');
const ticketListAfter = document.getElementById('ticket-list-after');
const noteFormAfter = document.getElementById('note-form-after');
const noteInputAfter = document.getElementById('agent-note-after');
let nextTicketAfter = 1422;

function createAfterTicket(noteText) {
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'ticket-row';
  row.setAttribute('aria-keyshortcuts', 'Control+Enter');

  const title = document.createElement('span');
  title.className = 'ticket-row-title';
  title.textContent = 'Ticket #' + nextTicketAfter + ' - Billing issue';

  const note = document.createElement('span');
  note.className = 'ticket-row-note';
  note.textContent = 'Agent note: ' + noteText;

  row.appendChild(title);
  row.appendChild(note);
  nextTicketAfter += 1;
  return row;
}

noteFormAfter.addEventListener('submit', (e) => {
  e.preventDefault();
  const note = noteInputAfter.value.trim();
  if (!note) {
    statusAfter.textContent = 'Please type a note before submitting.';
    return;
  }

  const newTicket = createAfterTicket(note);
  ticketListAfter.appendChild(newTicket);
  statusAfter.textContent = 'New ticket created from submitted note.';
  noteInputAfter.value = '';
  noteInputAfter.focus();
});

ticketListAfter.addEventListener('focusin', (e) => {
  const row = e.target.closest('.ticket-row');
  if (!row) return;
  const title = row.querySelector('.ticket-row-title')?.textContent || 'Ticket';
  statusAfter.textContent = title + ' focused. Press Ctrl+Enter to archive this ticket.';
});

ticketListAfter.addEventListener('keydown', (e) => {
  const row = e.target.closest('.ticket-row');
  const hasCtrl = e.ctrlKey || e.metaKey;
  if (!row || !hasCtrl || e.key !== 'Enter') return;

  e.preventDefault();
  const removedTitle = row.querySelector('.ticket-row-title')?.textContent || 'Ticket';
  row.remove();
  statusAfter.textContent = 'Shortcut fired: ' + removedTitle + ' archived and removed (Ctrl+Enter).';
});`,
                context: "ACCESSIBLE SOLUTION: Each submitted note creates a new ticket row. Archiving requires Ctrl+Enter while focus is on a ticket row, so typing in the note field does not trigger accidental archive actions."
            },
            interactive: {
                enabled: true,
                instructions: "BEFORE: Type a note and submit it to create a new ticket. Try Ctrl+Enter on tickets and notice keyboard archive does not work. You must click a ticket with mouse to archive. AFTER: Type a note and submit it to create a new ticket. Focus any ticket row and press Ctrl+Enter to archive and remove that ticket."
            },
            userGroups: ["speech recognition users", "screen reader users", "keyboard-only users", "support agents"],
            keySummary: [
                "Avoid single-key shortcuts that conflict with assistive technology",
                "Use modifier keys (Ctrl, Alt, Shift) with character keys",
                "Provide a way to turn off or remap single-key shortcuts",
                "Only activate shortcuts when component has focus",
                "Document all keyboard shortcuts clearly"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.2.1",
        principle: "Operable",
        title: "Timing Adjustable",
        level: "A",
        description: "User can turn off, adjust, or extend time limits.",
        techniques: ["G133", "G180", "G198", "ARIA2"],
        before: `<!-- Auto-logout with no warning -->
setTimeout(() => logout(), 300000);`,
        after: `<div role="status" aria-live="polite">
  Session expires in: <span id="countdown">5:00</span>
</div>
<button onclick="extendSession()">Stay Logged In</button>`,
        explanation: "Warn users before timeout. Provide buttons to extend sessions and save work. Users with cognitive disabilities and screen reader users need extra time.",
        examples: {
            before: {
                html: `<div class="online-exam-container">
  <div class="exam-header">
    <h2>Final Exam - Web Development 101</h2>
    <p class="student-info">Student: Alex Martinez | Student ID: 12345</p>
  </div>
  
  <div class="exam-content">
    <div class="question">
      <h3>Question 1 of 20</h3>
      <p>Explain the difference between semantic and non-semantic HTML elements. Provide at least three examples of each.</p>
      <textarea rows="8" placeholder="Type your answer here..."></textarea>
    </div>
    
    <div class="question">
      <h3>Question 2 of 20</h3>
      <p>What is the CSS Box Model? Describe each component and how they affect element sizing.</p>
      <textarea rows="8" placeholder="Type your answer here..."></textarea>
    </div>
    
    <button class="submit-btn">Submit Exam</button>
  </div>
</div>`,
                css: `.online-exam-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.exam-header {
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 20px;
  margin-bottom: 30px;
}
.exam-header h2 {
  margin: 0 0 10px 0;
  color: #1f2937;
}
.student-info {
  color: #6b7280;
  margin: 0;
}
.exam-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.question {
  padding: 20px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}
.question h3 {
  margin: 0 0 15px 0;
  color: #374151;
  font-size: 1.1em;
}
.question p {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: #1f2937;
}
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}
.submit-btn {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
}
.submit-btn:hover {
  background: #2563eb;
}`,
                js: `// Exam automatically submits after 30 minutes with no warning
setTimeout(() => {
  alert('Time is up! Your exam has been automatically submitted.');
  document.querySelector('.online-exam-container').innerHTML = 
    '<div style="text-align: center; padding: 40px;"><h2>Exam Submitted</h2><p>Your answers have been recorded.</p></div>';
}, 1800000); // 30 minutes`,
                context: "This online exam has a strict 30-minute time limit that automatically submits the exam when time expires, with no warning, countdown, or ability to extend time. Students with disabilities who need more time to read questions, process information, or type responses are severely disadvantaged. Screen reader users who navigate more slowly, students with dyslexia who need extra time to read, students with motor impairments who type slowly, and students who experience anxiety under time pressure all face barriers. There's no accommodation for different needs, and students may lose partially completed answers without any warning. This violates WCAG 2.2.1 by not allowing users to turn off, adjust, or extend the time limit."
            },
            after: {
                html: `<div class="online-exam-container">
  <div class="exam-header">
    <h2>Final Exam - Web Development 101</h2>
    <p class="student-info">Student: Alex Martinez | Student ID: 12345</p>
    <div class="time-controls">
      <div class="timer-display" role="timer" aria-live="polite" aria-atomic="true">
        <span class="timer-label">Time Remaining:</span>
        <span id="timeRemaining" class="timer-value">30:00</span>
      </div>
      <button id="requestMoreTime" class="time-extension-btn" aria-label="Request 10 more minutes">
        <span aria-hidden="true">⏱️</span> Add 10 Minutes
      </button>
    </div>
  </div>
  
  <div class="exam-content">
    <div class="question">
      <h3>Question 1 of 20</h3>
      <p>Explain the difference between semantic and non-semantic HTML elements. Provide at least three examples of each.</p>
      <textarea rows="8" placeholder="Type your answer here..." aria-label="Answer for question 1"></textarea>
    </div>
    
    <div class="question">
      <h3>Question 2 of 20</h3>
      <p>What is the CSS Box Model? Describe each component and how they affect element sizing.</p>
      <textarea rows="8" placeholder="Type your answer here..." aria-label="Answer for question 2"></textarea>
    </div>
    
    <button class="submit-btn">Submit Exam</button>
  </div>
  
  <div id="timeWarning" class="time-warning" role="alert" aria-live="assertive" style="display: none;">
    <div class="warning-content">
      <span class="warning-icon" aria-hidden="true">⚠️</span>
      <div class="warning-text">
        <strong>Time Running Low</strong>
        <p>You have <span id="warningCountdown">5</span> minutes remaining. You can request more time using the "Add 10 Minutes" button.</p>
      </div>
    </div>
  </div>
</div>`,
                css: `.online-exam-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.exam-header {
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 20px;
  margin-bottom: 30px;
}
.exam-header h2 {
  margin: 0 0 10px 0;
  color: #1f2937;
}
.student-info {
  color: #6b7280;
  margin: 0 0 15px 0;
}
.time-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  margin-top: 15px;
}
.timer-display {
  display: flex;
  align-items: center;
  gap: 10px;
}
.timer-label {
  font-weight: 600;
  color: #0c4a6e;
}
.timer-value {
  font-size: 1.5em;
  font-weight: 700;
  color: #0369a1;
  font-family: 'Courier New', monospace;
}
.time-extension-btn {
  padding: 10px 18px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.time-extension-btn:hover {
  background: #0284c7;
}
.time-extension-btn:focus {
  outline: 3px solid #7dd3fc;
  outline-offset: 2px;
}
.exam-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.question {
  padding: 20px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}
.question h3 {
  margin: 0 0 15px 0;
  color: #374151;
  font-size: 1.1em;
}
.question p {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: #1f2937;
}
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}
.submit-btn {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
}
.submit-btn:hover {
  background: #2563eb;
}
.time-warning {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  padding: 20px;
  background: #fef3c7;
  border: 3px solid #f59e0b;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.warning-content {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}
.warning-icon {
  font-size: 24px;
  flex-shrink: 0;
}
.warning-text strong {
  display: block;
  color: #92400e;
  margin-bottom: 8px;
  font-size: 1.1em;
}
.warning-text p {
  margin: 0;
  color: #78350f;
  line-height: 1.5;
}`,
                js: `let totalSeconds = 1800; // 30 minutes
let timerInterval;
let warningShown = false;

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  document.getElementById('timeRemaining').textContent = display;
  
  // Show warning at 5 minutes remaining
  if (totalSeconds === 300 && !warningShown) {
    showTimeWarning();
    warningShown = true;
  }
  
  // Update warning countdown if visible
  if (warningShown && totalSeconds <= 300) {
    const warningMinutes = Math.floor(totalSeconds / 60);
    document.getElementById('warningCountdown').textContent = warningMinutes;
  }
  
  // Change timer color when time is running low
  const timerValue = document.getElementById('timeRemaining');
  if (totalSeconds <= 300) {
    timerValue.style.color = '#dc2626';
  } else if (totalSeconds <= 600) {
    timerValue.style.color = '#ea580c';
  }
  
  if (totalSeconds <= 0) {
    clearInterval(timerInterval);
    submitExam();
  }
  
  totalSeconds--;
}

function showTimeWarning() {
  const warning = document.getElementById('timeWarning');
  warning.style.display = 'block';
  
  // Auto-hide warning after 10 seconds
  setTimeout(() => {
    warning.style.display = 'none';
  }, 10000);
}

function requestMoreTime() {
  totalSeconds += 600; // Add 10 minutes
  warningShown = false;
  document.getElementById('timeWarning').style.display = 'none';
  
  // Announce to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = '10 minutes added to your exam time.';
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function submitExam() {
  alert('Time is up! Your exam has been automatically submitted.');
  document.querySelector('.online-exam-container').innerHTML = 
    '<div style="text-align: center; padding: 40px;"><h2>Exam Submitted</h2><p>Your answers have been recorded.</p></div>';
}

// Start the timer
timerInterval = setInterval(updateTimerDisplay, 1000);

// Add event listener for time extension button
document.getElementById('requestMoreTime').addEventListener('click', requestMoreTime);`,
                context: "The exam now provides full timing control that meets WCAG 2.2.1 requirements. Students can see a persistent countdown timer showing exactly how much time remains. At 5 minutes remaining, a prominent warning appears (announced to screen readers via role='alert' and aria-live='assertive'). Most importantly, students can extend their time by clicking 'Add 10 Minutes' as many times as needed, with no limit. This accommodates students with disabilities who need more time: screen reader users who navigate more slowly, students with dyslexia or cognitive disabilities who need extra processing time, students with motor impairments who type slowly, and students who experience anxiety under time pressure. The timer uses role='timer' and aria-live='polite' for periodic updates without being disruptive. This implementation allows users to adjust the time limit, satisfying WCAG 2.2.1's requirement that users can 'turn off, adjust, or extend' time limits."
            },
            interactive: {
                enabled: true,
                instructions: "The accessible exam shows a countdown timer and allows students to add more time. Click 'Add 10 Minutes' to extend the exam duration. A warning appears at 5 minutes remaining. Screen readers announce time updates and warnings automatically."
            },
            userGroups: ["users with cognitive disabilities", "screen reader users", "users who read slowly", "older users"],
            keySummary: [
                "Allow users to turn off, adjust, or extend time limits",
                "Provide at least 20 seconds warning before timeout",
                "Allow users to extend timeout at least 10 times",
                "Avoid time limits unless absolutely necessary",
                "Save user data before session expires"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.2.2",
        principle: "Operable",
        title: "Pause, Stop, Hide",
        level: "A",
        description: "User can pause, stop, or hide moving, scrolling, or auto-updating content.",
        techniques: ["G4", "G11", "G152", "G186"],
        before: `<marquee>Breaking News scrolling continuously...</marquee>`,
        after: `<div role="region" aria-live="polite" aria-label="News updates">
  <p>Breaking News: [content]</p>
  <button onclick="toggleNews()">Pause Updates</button>
</div>`,
        explanation: "Never use <marquee>. For auto-updating content, provide pause/stop controls. Use ARIA live regions with aria-live=\"polite\" not \"assertive\".",
        examples: {
            before: {
                html: `<div class="news-ticker">
  <marquee behavior="scroll" direction="left" scrollamount="5">
    Breaking News: Stock market reaches new high... Weather alert issued for coastal areas... Sports: Local team wins championship...
  </marquee>
</div>`,
                css: `.news-ticker {
  background: #dc2626;
  color: white;
  padding: 10px;
  font-weight: 600;
}`,
                js: "",
                context: "The marquee element creates continuously scrolling text that cannot be paused or stopped. Users with cognitive disabilities, reading disabilities, or anyone who reads slowly cannot read the content before it scrolls away. The constant motion is distracting and can trigger vestibular disorders. Screen reader users may miss the content entirely as it updates too quickly."
            },
            after: {
                html: `<div class="news-ticker">
  <div class="ticker-controls">
    <button id="pauseBtn" aria-label="Pause news updates">
      <span aria-hidden="true">⏸️</span> Pause
    </button>
  </div>
  <div id="newsContent" role="region" aria-live="polite" aria-label="News updates">
    <p id="currentNews">Breaking News: Stock market reaches new high...</p>
  </div>
</div>`,
                css: `.news-ticker {
  background: #dc2626;
  color: white;
  padding: 15px;
}
.ticker-controls {
  margin-bottom: 10px;
}
.ticker-controls button {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
#newsContent {
  font-weight: 600;
}`,
                js: `const newsItems = [
  'Breaking News: Stock market reaches new high...',
  'Weather alert issued for coastal areas...',
  'Sports: Local team wins championship...'
];

let currentIndex = 0;
let isPaused = false;
let intervalId;

function updateNews() {
  if (!isPaused) {
    currentIndex = (currentIndex + 1) % newsItems.length;
    document.getElementById('currentNews').textContent = newsItems[currentIndex];
  }
}

function togglePause() {
  isPaused = !isPaused;
  const btn = document.getElementById('pauseBtn');
  if (isPaused) {
    btn.innerHTML = '<span aria-hidden="true">▶️</span> Resume';
    btn.setAttribute('aria-label', 'Resume news updates');
  } else {
    btn.innerHTML = '<span aria-hidden="true">⏸️</span> Pause';
    btn.setAttribute('aria-label', 'Pause news updates');
  }
}

document.getElementById('pauseBtn').addEventListener('click', togglePause);
intervalId = setInterval(updateNews, 5000);`,
                context: "Users can now pause the news updates with a clearly labeled button. The content updates at a reasonable pace (every 5 seconds) and uses aria-live='polite' so screen readers announce updates without interrupting the user. When paused, users can read at their own pace. The pause control is keyboard accessible and clearly indicates its state."
            },
            interactive: {
                enabled: true,
                instructions: "Click the Pause button to stop the news updates. Click Resume to restart them. Notice how the updates are announced to screen readers without interrupting."
            },
            userGroups: ["users with cognitive disabilities", "users with reading disabilities", "users with vestibular disorders", "screen reader users"],
            keySummary: [
                "Provide pause, stop, or hide controls for moving content",
                "Auto-updating content should have pause mechanism",
                "Carousels must have pause button and manual controls",
                "Scrolling text should be pausable",
                "Blinking content should not blink for more than 5 seconds"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.3.1",
        principle: "Operable",
        title: "Three Flashes or Below Threshold",
        level: "A",
        description: "Web pages do not contain anything that flashes more than three times in any one second period, or the flash is below the general flash and red flash thresholds.",
        techniques: ["G19", "G176"],
        before: `@keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
<div style="animation: flash 0.2s infinite;">ALERT!</div>`,
        after: `<div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px;">
  ALERT: Important information
</div>`,
        explanation: "Flashing content can trigger seizures in people with photosensitive epilepsy. Content must not flash more than 3 times per second. Use static visual indicators, smooth transitions, or user-controlled animations instead.",
        examples: {
            before: {
                html: `<div class="notification-center">
  <h3>System Notifications</h3>
  
  <div class="notification-item flashing-error">
    <span class="icon">🔴</span>
    <div class="message">
      <strong>Server Connection Lost</strong>
      <p>Unable to reach database server</p>
    </div>
  </div>
  
  <div class="notification-item flashing-warning">
    <span class="icon">⚠️</span>
    <div class="message">
      <strong>High CPU Usage</strong>
      <p>System resources at 95%</p>
    </div>
  </div>
  
  <div class="notification-item flashing-urgent">
    <span class="icon">🚨</span>
    <div class="message">
      <strong>Security Alert</strong>
      <p>Multiple failed login attempts detected</p>
    </div>
  </div>
</div>`,
                css: `.notification-center {
  max-width: 450px;
  padding: 25px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.notification-center h3 {
  margin-top: 0;
  color: #1f2937;
  margin-bottom: 20px;
}
.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 2px solid transparent;
}
.notification-item .icon {
  font-size: 1.5em;
  flex-shrink: 0;
}
.notification-item .message strong {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}
.notification-item .message p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

/* DANGEROUS: Flashing at 5 times per second */
.flashing-error {
  animation: flashRed 0.2s infinite;
}
@keyframes flashRed {
  0%, 100% {
    background: #dc2626;
    color: white;
    border-color: #991b1b;
  }
  50% {
    background: #fef2f2;
    color: #dc2626;
    border-color: #dc2626;
  }
}

/* DANGEROUS: Flashing at 6.67 times per second */
.flashing-warning {
  animation: flashYellow 0.15s infinite;
}
@keyframes flashYellow {
  0%, 100% {
    background: #f59e0b;
    color: white;
    border-color: #d97706;
  }
  50% {
    background: #fffbeb;
    color: #f59e0b;
    border-color: #f59e0b;
  }
}

/* DANGEROUS: Rapid flashing at 10 times per second */
.flashing-urgent {
  animation: flashUrgent 0.1s infinite;
}
@keyframes flashUrgent {
  0%, 100% {
    background: #ef4444;
    color: white;
    border-color: #b91c1c;
    transform: scale(1);
  }
  50% {
    background: #ffffff;
    color: #ef4444;
    border-color: #ef4444;
    transform: scale(1.02);
  }
}`,
                js: "",
                context: "This notification system uses rapid flashing animations to grab attention for different alert levels. The error notification flashes 5 times per second, the warning flashes 6.67 times per second, and the urgent alert flashes 10 times per second. All of these exceed the safe threshold of 3 flashes per second and can trigger seizures in people with photosensitive epilepsy. Even for users without epilepsy, the rapid flashing is extremely distracting, anxiety-inducing, and makes the text difficult to read. This is a serious accessibility and safety violation."
            },
            after: {
                html: `<div class="notification-center">
  <h3>System Notifications</h3>
  
  <div class="notification-item error-notification" role="alert" aria-live="assertive">
    <span class="icon" aria-hidden="true">🔴</span>
    <div class="message">
      <strong>Server Connection Lost</strong>
      <p>Unable to reach database server</p>
    </div>
    <div class="pulse-indicator error-pulse" aria-hidden="true"></div>
  </div>
  
  <div class="notification-item warning-notification" role="alert" aria-live="polite">
    <span class="icon" aria-hidden="true">⚠️</span>
    <div class="message">
      <strong>High CPU Usage</strong>
      <p>System resources at 95%</p>
    </div>
    <div class="pulse-indicator warning-pulse" aria-hidden="true"></div>
  </div>
  
  <div class="notification-item urgent-notification" role="alert" aria-live="assertive">
    <span class="icon" aria-hidden="true">🚨</span>
    <div class="message">
      <strong>Security Alert</strong>
      <p>Multiple failed login attempts detected</p>
    </div>
    <div class="pulse-indicator urgent-pulse" aria-hidden="true"></div>
  </div>
</div>`,
                css: `.notification-center {
  max-width: 450px;
  padding: 25px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.notification-center h3 {
  margin-top: 0;
  color: #1f2937;
  margin-bottom: 20px;
}
.notification-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 2px solid transparent;
}
.notification-item .icon {
  font-size: 1.5em;
  flex-shrink: 0;
}
.notification-item .message {
  flex: 1;
}
.notification-item .message strong {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}
.notification-item .message p {
  margin: 0;
  font-size: 13px;
}

/* SAFE: Static error styling with subtle pulse indicator */
.error-notification {
  background: #fef2f2;
  color: #991b1b;
  border-color: #dc2626;
  border-left-width: 4px;
}
.error-notification .message p {
  color: #dc2626;
}

/* SAFE: Static warning styling */
.warning-notification {
  background: #fffbeb;
  color: #92400e;
  border-color: #f59e0b;
  border-left-width: 4px;
}
.warning-notification .message p {
  color: #d97706;
}

/* SAFE: Static urgent styling with emphasis */
.urgent-notification {
  background: #fef2f2;
  color: #7f1d1d;
  border-color: #b91c1c;
  border-left-width: 5px;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}
.urgent-notification .message p {
  color: #991b1b;
}

/* SAFE: Slow, smooth pulse animation (2 seconds = 0.5 flashes per second) */
.pulse-indicator {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: gentlePulse 2s ease-in-out infinite;
}
@keyframes gentlePulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.3);
  }
}
.error-pulse {
  background: #dc2626;
}
.warning-pulse {
  background: #f59e0b;
}
.urgent-pulse {
  background: #b91c1c;
}`,
                js: "",
                context: "The notifications now use static color-coded backgrounds with distinct borders instead of flashing. Each notification has a severity level indicated by color, border thickness, and a small pulse indicator. The pulse animation is very slow (2 seconds per cycle = 0.5 flashes per second), well below the 3 flashes per second threshold. This provides visual interest and draws attention without triggering seizures. The role='alert' and aria-live attributes ensure screen readers announce the notifications appropriately. The design effectively communicates urgency through visual hierarchy, color, and subtle animation while remaining safe for all users, including those with photosensitive epilepsy."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with photosensitive epilepsy", "users with vestibular disorders", "users with cognitive disabilities", "users with attention disorders", "all users"],
            keySummary: [
                "Avoid content that flashes more than 3 times per second",
                "Keep flashing area small (less than 25% of 10 degrees of visual field)",
                "Test animations and videos for flash frequency",
                "Provide warnings before showing flashing content",
                "Offer alternative non-flashing versions of content"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.4.1",
        principle: "Operable",
        title: "Bypass Blocks",
        level: "A",
        description: "A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.",
        techniques: ["G1", "G123", "G124", "H69", "ARIA11"],
        before: `<nav>
  [50 navigation links...]
</nav>
<main>Page content</main>`,
        after: `<a href="#main" class="skip-link">
  Skip to Main Content
</a>
<nav>[other navigation]</nav>
<main id="main">Page content</main>`,
        explanation: "Provide skip links to bypass repetitive navigation. Keyboard and screen reader users shouldn't have to tab through dozens of links on every page. Skip links should be the first focusable element and become visible on keyboard focus.",
        examples: {
            before: {
                html: `<header class="site-header">
  <div class="logo">
    <a href="/">TechBlog</a>
  </div>
  <nav class="main-nav">
    <a href="/">Home</a>
    <a href="/articles">Articles</a>
    <a href="/tutorials">Tutorials</a>
    <a href="/reviews">Reviews</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
  <div class="search">
    <input type="search" placeholder="Search articles...">
    <button>Search</button>
  </div>
</header>

<aside class="sidebar">
  <h3>Categories</h3>
  <ul>
    <li><a href="/category/javascript">JavaScript</a></li>
    <li><a href="/category/python">Python</a></li>
    <li><a href="/category/css">CSS</a></li>
    <li><a href="/category/html">HTML</a></li>
    <li><a href="/category/react">React</a></li>
    <li><a href="/category/nodejs">Node.js</a></li>
  </ul>
  
  <h3>Recent Posts</h3>
  <ul>
    <li><a href="/post1">Getting Started with React Hooks</a></li>
    <li><a href="/post2">CSS Grid Layout Guide</a></li>
    <li><a href="/post3">Python Best Practices</a></li>
  </ul>
</aside>

<main class="content">
  <article>
    <h1>Understanding JavaScript Closures</h1>
    <p class="meta">Published on March 4, 2026 by John Doe</p>
    <p>Closures are one of the most powerful features in JavaScript...</p>
  </article>
</main>`,
                css: `.site-header {
  background: #1f2937;
  color: white;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  gap: 30px;
}
.logo a {
  color: white;
  text-decoration: none;
  font-size: 24px;
  font-weight: bold;
}
.main-nav {
  display: flex;
  gap: 20px;
  flex: 1;
}
.main-nav a {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
}
.search {
  display: flex;
  gap: 8px;
}
.search input {
  padding: 8px;
  border-radius: 4px;
  border: none;
}
.search button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.sidebar {
  float: left;
  width: 250px;
  padding: 20px;
  background: #f9fafb;
}
.sidebar h3 {
  margin-top: 0;
  color: #1f2937;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin-bottom: 10px;
}
.sidebar a {
  color: #3b82f6;
  text-decoration: none;
}
.content {
  margin-left: 290px;
  padding: 30px;
}
.content h1 {
  color: #1f2937;
  margin-top: 0;
}
.meta {
  color: #6b7280;
  font-size: 14px;
}`,
                js: "",
                context: "This blog page has no skip link. Keyboard users must tab through all navigation elements before reaching the article content: 1 logo link, 6 main navigation links, 1 search input, 1 search button, 6 category links, and 3 recent post links = 18 focusable elements. On every article page, keyboard users must navigate through this same repetitive structure. Screen reader users hear all these navigation announcements repeatedly before getting to the article they want to read. This is tedious and time-consuming, especially for users who read multiple articles."
            },
            after: {
                html: `<!-- Skip link should be the FIRST focusable element -->
<a href="#main-content" class="skip-link">Skip to Main Content</a>

<header class="site-header">
  <div class="logo">
    <a href="/">TechBlog</a>
  </div>
  <nav class="main-nav" aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/articles">Articles</a>
    <a href="/tutorials">Tutorials</a>
    <a href="/reviews">Reviews</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
  <div class="search">
    <input type="search" placeholder="Search articles..." aria-label="Search articles">
    <button>Search</button>
  </div>
</header>

<aside class="sidebar">
  <h3>Categories</h3>
  <ul>
    <li><a href="/category/javascript">JavaScript</a></li>
    <li><a href="/category/python">Python</a></li>
    <li><a href="/category/css">CSS</a></li>
    <li><a href="/category/html">HTML</a></li>
    <li><a href="/category/react">React</a></li>
    <li><a href="/category/nodejs">Node.js</a></li>
  </ul>
  
  <h3>Recent Posts</h3>
  <ul>
    <li><a href="/post1">Getting Started with React Hooks</a></li>
    <li><a href="/post2">CSS Grid Layout Guide</a></li>
    <li><a href="/post3">Python Best Practices</a></li>
  </ul>
</aside>

<main class="content" id="main-content" tabindex="-1">
  <article>
    <h1>Understanding JavaScript Closures</h1>
    <p class="meta">Published on March 4, 2026 by John Doe</p>
    <p>Closures are one of the most powerful features in JavaScript...</p>
  </article>
</main>`,
                css: `/* Skip link - hidden by default, visible on focus */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000000;
  color: #ffffff;
  padding: 8px 16px;
  text-decoration: none;
  font-weight: 600;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
}

.site-header {
  background: #1f2937;
  color: white;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  gap: 30px;
}
.logo a {
  color: white;
  text-decoration: none;
  font-size: 24px;
  font-weight: bold;
}
.main-nav {
  display: flex;
  gap: 20px;
  flex: 1;
}
.main-nav a {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
}
.search {
  display: flex;
  gap: 8px;
}
.search input {
  padding: 8px;
  border-radius: 4px;
  border: none;
}
.search button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.sidebar {
  float: left;
  width: 250px;
  padding: 20px;
  background: #f9fafb;
}
.sidebar h3 {
  margin-top: 0;
  color: #1f2937;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin-bottom: 10px;
}
.sidebar a {
  color: #3b82f6;
  text-decoration: none;
}
.content {
  margin-left: 290px;
  padding: 30px;
}
/* Ensure skip link target can receive focus */
.content:focus {
  outline: none;
}
.content h1 {
  color: #1f2937;
  margin-top: 0;
}
.meta {
  color: #6b7280;
  font-size: 14px;
}`,
                js: "",
                context: "The page now includes a skip link as the very first focusable element. The link is visually hidden (positioned off-screen) but becomes visible when focused with the keyboard. When a keyboard user presses Tab, the skip link appears at the top of the page. Pressing Enter activates it and jumps directly to the main content (the article), bypassing all 18 navigation elements. The main element has id='main-content' and tabindex='-1' to receive focus programmatically. This saves significant time and effort for keyboard and screen reader users, especially when reading multiple articles on the site."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["keyboard users", "screen reader users", "users with motor disabilities", "power users"],
            keySummary: [
                "Provide skip links to bypass repetitive navigation",
                "Place skip link as first focusable element on page",
                "Use proper heading structure to allow navigation",
                "Implement ARIA landmarks (main, nav, aside)",
                "Ensure skip links are keyboard accessible"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.4.2",
        principle: "Operable",
        title: "Page Titled",
        level: "A",
        description: "Web pages have titles that describe topic or purpose.",
        techniques: ["G88", "H25"],
        before: `<title>Untitled Document</title>`,
        after: `<title>Checkout - TechStore</title>`,
        explanation: "Every page needs a descriptive <title>. Screen reader users hear this first. Make titles meaningful and put the most important word first.",
        examples: {
            before: {
                html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Untitled Document</title>
</head>
<body>
  <div class="browser-mockup">
    <div class="browser-chrome">
      <div class="chrome-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="browser-tabs">
        <div class="tab active bad-title">
          <span class="favicon">📄</span>
          <span class="tab-text">Untitled Document</span>
        </div>
        <div class="tab inactive">
          <span class="favicon">🏠</span>
          <span class="tab-text">Home</span>
        </div>
      </div>
    </div>
    <div class="browser-content">
      <h1>Product Checkout</h1>
      <p>Complete your purchase by entering payment information below.</p>
      <p><strong>Total: $299.99</strong></p>
    </div>
  </div>
</body>
</html>`,
                css: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 20px;
  background: #f9fafb;
  margin: 0;
}
.browser-mockup {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.browser-chrome {
  background: #e5e7eb;
  padding: 10px 12px 0;
}
.chrome-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.dot.red { background: #ff5f57; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #28ca42; }
.browser-tabs {
  display: flex;
  gap: 4px;
}
.tab {
  background: #d1d5db;
  padding: 8px 16px;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  min-width: 180px;
}
.tab.active {
  background: white;
  color: #1f2937;
}
.tab.active.bad-title {
  color: #dc2626;
  font-weight: 600;
}
.favicon {
  font-size: 14px;
}
.tab-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.browser-content {
  padding: 30px;
  background: white;
}
.browser-content h1 {
  margin: 0 0 15px 0;
  color: #1f2937;
}`,
                js: "",
                context: "This checkout page has a generic title 'Untitled Document' shown in the browser tab. Screen reader users hear this meaningless title first when the page loads. Users with multiple tabs open cannot identify which tab is the checkout page. The browser tab provides no information about the page's purpose. Users cannot find this page in their browser history or bookmarks. This is especially problematic during checkout when users might switch tabs to get payment information."
            },
            after: {
                html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkout - TechStore</title>
</head>
<body>
  <div class="browser-mockup">
    <div class="browser-chrome">
      <div class="chrome-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="browser-tabs">
        <div class="tab active good-title">
          <span class="favicon">🛒</span>
          <span class="tab-text">Checkout - TechStore</span>
        </div>
        <div class="tab inactive">
          <span class="favicon">🏠</span>
          <span class="tab-text">Home - TechStore</span>
        </div>
      </div>
    </div>
    <div class="browser-content">
      <h1>Product Checkout</h1>
      <p>Complete your purchase by entering payment information below.</p>
      <p><strong>Total: $299.99</strong></p>
    </div>
  </div>
</body>
</html>`,
                css: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 20px;
  background: #f9fafb;
  margin: 0;
}
.browser-mockup {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.browser-chrome {
  background: #e5e7eb;
  padding: 10px 12px 0;
}
.chrome-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.dot.red { background: #ff5f57; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #28ca42; }
.browser-tabs {
  display: flex;
  gap: 4px;
}
.tab {
  background: #d1d5db;
  padding: 8px 16px;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  min-width: 180px;
}
.tab.active {
  background: white;
  color: #1f2937;
}
.tab.active.good-title {
  color: #16a34a;
  font-weight: 600;
}
.favicon {
  font-size: 14px;
}
.tab-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.browser-content {
  padding: 30px;
  background: white;
}
.browser-content h1 {
  margin: 0 0 15px 0;
  color: #1f2937;
}`,
                js: "",
                context: "The page now has a descriptive title 'Checkout - TechStore' displayed in the browser tab. Screen readers announce this meaningful title immediately when the page loads, providing instant context. Users can easily identify the checkout tab among multiple open tabs. The title follows best practices: most specific information first (Checkout), followed by the site name (TechStore). Users can find this page in browser history and bookmarks. When users switch tabs to get payment information, they can quickly return to the correct checkout tab."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "all users", "users with cognitive disabilities", "users with multiple tabs open"],
            keySummary: [
                "Every page must have a unique, descriptive title element",
                "Page title should describe the page topic or purpose",
                "Include site name at the end of title for context",
                "Update title dynamically in single-page applications",
                "Keep titles concise (under 60 characters when possible)"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.4.3",
        principle: "Operable",
        title: "Focus Order",
        level: "A",
        description: "If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.",
        techniques: ["G59", "H4", "C27", "ARIA11"],
        before: `<input placeholder="Name" tabindex="1">
<input placeholder="Email" tabindex="-1"> <!-- Skipped! -->
<input placeholder="Address" tabindex="5">
<input placeholder="City" tabindex="3">
<button tabindex="6">Submit</button>`,
        after: `<label for="name">Name</label>
<input id="name" type="text">
<label for="email">Email</label>
<input id="email" type="email">
<label for="address">Address</label>
<input id="address" type="text">
<label for="city">City</label>
<input id="city" type="text">
<button type="submit">Submit</button>`,
        explanation: "Focus order should follow a logical sequence that preserves meaning. Avoid arbitrary tabindex values and never use tabindex='-1' on interactive elements. Let the natural DOM order determine focus flow.",
        examples: {
            before: {
                html: `<div class="bad-layout">
  <!-- Promo banner positioned absolutely - appears last in DOM but visually first -->
  <div class="promo-banner">
    <strong>Special Offer!</strong>
    <p>Save 20% on your order</p>
    <a href="#promo" tabindex="0">Apply Coupon</a>
  </div>
  
  <form class="cart-form bad-tabindex">
    <h3>Shipping Information</h3>
    
    <div class="form-row">
      <label for="bad-name">Full Name</label>
      <input type="text" id="bad-name" tabindex="1">
    </div>
    
    <!-- Email has tabindex -1, making it unfocusable via keyboard -->
    <div class="form-row">
      <label for="bad-email">Email Address</label>
      <input type="email" id="bad-email" tabindex="-1" placeholder="Skipped in tab order!">
    </div>
    
    <div class="form-row">
      <label for="bad-address">Street Address</label>
      <input type="text" id="bad-address" tabindex="5">
    </div>
    
    <div class="form-row">
      <label for="bad-city">City</label>
      <input type="text" id="bad-city" tabindex="3">
    </div>
    
    <div class="form-row">
      <label for="bad-state">State</label>
      <select id="bad-state" tabindex="4">
        <option>Select State</option>
        <option>California</option>
        <option>New York</option>
      </select>
    </div>
    
    <div class="form-row">
      <label for="bad-zip">ZIP Code</label>
      <input type="text" id="bad-zip" tabindex="2">
    </div>
    
    <div class="button-group">
      <button type="button" class="btn-secondary" tabindex="8">Cancel</button>
      <button type="submit" class="btn-primary" tabindex="6">Continue to Payment</button>
      <button type="button" class="btn-link" tabindex="7">Save for Later</button>
    </div>
  </form>
</div>`,
                css: `.bad-layout {
  position: relative;
  min-height: 400px;
}
.bad-layout .promo-banner {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  padding: 15px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
}
.cart-form {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
}
.form-row {
  margin-bottom: 15px;
}
.form-row label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}
.form-row input,
.form-row select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.bad-tabindex input[tabindex="-1"] {
  background: #ffebee;
}
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background: #2196f3;
  color: white;
}
.btn-secondary {
  background: #757575;
  color: white;
}`,
                js: "",
                context: "This checkout form has multiple focus order problems. Arbitrary tabindex values create chaotic navigation: Name → ZIP → City → State → Address (jumping randomly). The email field has tabindex='-1', making it completely unreachable via keyboard. The promo banner appears visually at the top but receives focus last due to absolute positioning. Button order is illogical with Cancel focused after Submit. Keyboard users experience a confusing, disorienting flow that doesn't match the visual layout or logical sequence."
            },
            after: {
                html: `<div class="good-layout">
  <form class="cart-form">
    <h3>Shipping Information</h3>
    
    <div class="form-row">
      <label for="good-name">Full Name</label>
      <input type="text" id="good-name">
    </div>
    
    <div class="form-row">
      <label for="good-email">Email Address</label>
      <input type="email" id="good-email">
    </div>
    
    <div class="form-row">
      <label for="good-address">Street Address</label>
      <input type="text" id="good-address">
    </div>
    
    <div class="form-row">
      <label for="good-city">City</label>
      <input type="text" id="good-city">
    </div>
    
    <div class="form-row">
      <label for="good-state">State</label>
      <select id="good-state">
        <option>Select State</option>
        <option>California</option>
        <option>New York</option>
      </select>
    </div>
    
    <div class="form-row">
      <label for="good-zip">ZIP Code</label>
      <input type="text" id="good-zip">
    </div>
    
    <div class="button-group">
      <button type="submit" class="btn-primary">Continue to Payment</button>
      <button type="button" class="btn-secondary">Cancel</button>
      <button type="button" class="btn-link">Save for Later</button>
    </div>
  </form>
  
  <!-- Promo section in logical DOM order -->
  <div class="promo-section">
    <strong>💰 Special Offer!</strong>
    <p>Save 20% on your order today</p>
    <a href="#promo">Apply Coupon Code</a>
  </div>
</div>`,
                css: `.good-layout {
  display: flex;
  flex-direction: column;
}
.cart-form {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
}
.form-row {
  margin-bottom: 15px;
}
.form-row label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}
.form-row input,
.form-row select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background: #2196f3;
  color: white;
}
.btn-secondary {
  background: #757575;
  color: white;
}
.promo-section {
  order: 2;
  margin-top: 20px;
  padding: 15px;
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 4px;
}`,
                js: "",
                context: "The form now has a logical, predictable focus order. No tabindex attributes are used - the browser follows natural DOM order. All fields are keyboard accessible. Focus flows top-to-bottom: Name → Email → Address → City → State → ZIP → Submit → Cancel → Save for Later → Promo link. The DOM structure matches the visual layout. Primary action (Submit) comes before secondary actions. The promo section follows the main form content. Users can complete the form efficiently with a predictable, intuitive navigation sequence."
            },
            interactive: {
                enabled: true,
                instructions: "Press Tab repeatedly to navigate through both examples. In the inaccessible version, notice the chaotic focus order and the skipped email field. In the accessible version, focus follows a natural, predictable path."
            },
            userGroups: ["keyboard users", "screen reader users", "users with motor disabilities", "users with cognitive disabilities"],
            keySummary: [
                "Ensure keyboard focus order matches visual order",
                "Avoid using tabindex values greater than 0",
                "Test tab order with keyboard navigation",
                "Keep related elements together in focus sequence",
                "Ensure focus moves logically through forms and interactive elements"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.4.4",
        principle: "Operable",
        title: "Link Purpose (In Context)",
        level: "A",
        description: "Link purpose can be determined from link text or context.",
        techniques: ["G91", "H30", "H77", "ARIA7", "ARIA8"],
        before: `<a href="/about">Click here</a>`,
        after: `<a href="/about">Learn more about our company</a>`,
        explanation: "Link text should describe destination or action. Never use \"Click here\" or \"Read more\". Screen reader users only hear link text, name it accordingly.",
        examples: {
            before: {
                html: `<div class="article-list">
  <article>
    <h3>New Product Launch</h3>
    <p>We're excited to announce our latest innovation in sustainable technology...</p>
    <a href="/products/eco-device">Click here</a>
  </article>
  <article>
    <h3>Company Milestone</h3>
    <p>Celebrating 10 years of serving our customers with excellence...</p>
    <a href="/about/milestone">Read more</a>
  </article>
  <article>
    <h3>Career Opportunities</h3>
    <p>Join our growing team and make a difference in the tech industry...</p>
    <a href="/careers">Learn more</a>
  </article>
</div>`,
                css: `.article-list {
  max-width: 600px;
}
article {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
article h3 {
  margin-top: 0;
}
article a {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 600;
}`,
                js: "",
                context: "These links use generic text like \"Click here\", \"Read more\", and \"Learn more\" that doesn't describe the destination. Screen reader users who navigate by links hear a list of meaningless phrases without context. They must read the surrounding text to understand where each link goes, which is inefficient and frustrating. The links are not self-descriptive."
            },
            after: {
                html: `<div class="article-list">
  <article>
    <h3>New Product Launch</h3>
    <p>We're excited to announce our latest innovation in sustainable technology...</p>
    <a href="/products/eco-device">View the new Eco Device product</a>
  </article>
  <article>
    <h3>Company Milestone</h3>
    <p>Celebrating 10 years of serving our customers with excellence...</p>
    <a href="/about/milestone">Read about our 10-year milestone</a>
  </article>
  <article>
    <h3>Career Opportunities</h3>
    <p>Join our growing team and make a difference in the tech industry...</p>
    <a href="/careers">Explore career opportunities at our company</a>
  </article>
</div>`,
                css: `.article-list {
  max-width: 600px;
}
article {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
article h3 {
  margin-top: 0;
}
article a {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 600;
}`,
                js: "",
                context: "Each link now has descriptive text that clearly indicates its destination and purpose. Screen reader users can understand where each link goes without needing surrounding context. When navigating by links, users hear meaningful descriptions like \"View the new Eco Device product\" instead of generic \"Click here\". This makes navigation more efficient and reduces cognitive load."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "users with cognitive disabilities", "all users"],
            keySummary: [
                "Make link text descriptive of the link destination",
                "Avoid generic link text like \"click here\" or \"read more\"",
                "Include context in the link text itself",
                "Use aria-label or aria-labelledby for additional context",
                "Ensure link purpose is clear from link text alone"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.4.5",
        principle: "Operable",
        title: "Multiple Ways",
        level: "AA",
        description: "Multiple ways exist to locate pages within site.",
        techniques: ["G125", "G63", "G64", "G161"],
        before: `<!-- Only navigation menu -->
<nav><a href="/page">Page</a></nav>`,
        after: `<nav><!-- Navigation menu --></nav>
<form action="/search"><input type="search"></form>
<a href="/sitemap">Site Map</a>
<a href="/index">A-Z Index</a>`,
        explanation: "Provide multiple navigation paths: menus, search, site map, and index. Different users find content differently. Some scan, others search.",
        examples: {
            before: {
                html: `<header>
  <h1>Company Website</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/services">Services</a>
    <a href="/contact">Contact</a>
  </nav>
</header>
<main>
  <h2>Welcome</h2>
  <p>Find information about our services and company.</p>
</main>`,
                css: `header {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}
nav a {
  margin-right: 15px;
  color: #0d6efd;
  text-decoration: none;
}
main {
  padding: 20px;
}`,
                js: "",
                context: "This website only provides a single navigation menu to find content. Users who don't know the site structure or can't find what they need in the menu have no alternative way to locate pages. Users with cognitive disabilities may struggle to navigate hierarchical menus. Power users who know what they're looking for can't quickly search. There's no overview of the entire site structure."
            },
            after: {
                html: `<header>
  <h1>Company Website</h1>
  <div class="search-bar">
    <form action="/search" role="search">
      <label for="search">Search site:</label>
      <input id="search" type="search" placeholder="Search...">
      <button type="submit">Search</button>
    </form>
  </div>
  <nav aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/services">Services</a>
    <a href="/contact">Contact</a>
  </nav>
</header>
<main>
  <h2>Welcome</h2>
  <p>Find information about our services and company.</p>
</main>
<footer>
  <nav aria-label="Additional navigation">
    <a href="/sitemap">Site Map</a>
    <a href="/az-index">A-Z Index</a>
  </nav>
</footer>`,
                css: `header {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}
.search-bar {
  margin-bottom: 15px;
}
.search-bar form {
  display: flex;
  gap: 10px;
  align-items: center;
}
.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  max-width: 300px;
}
.search-bar button {
  padding: 8px 16px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
nav a {
  margin-right: 15px;
  color: #0d6efd;
  text-decoration: none;
}
main {
  padding: 20px;
}
footer {
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}`,
                js: "",
                context: "Users now have multiple ways to find content: a hierarchical navigation menu for browsing, a search function for direct queries, a site map for viewing the complete structure, and an A-Z index for alphabetical access. Different users can choose the method that works best for their needs and cognitive style. This flexibility improves findability and reduces frustration."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with cognitive disabilities", "users unfamiliar with the site", "power users", "all users"],
            keySummary: [
                "Provide multiple ways to find pages (search, sitemap, navigation)",
                "Include a search function for large sites",
                "Provide a sitemap or table of contents",
                "Use consistent navigation across all pages",
                "Offer breadcrumb navigation for hierarchical sites"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.4.6",
        principle: "Operable",
        title: "Headings and Labels",
        level: "AA",
        description: "Headings and labels describe topic or purpose.",
        techniques: ["G130", "G131", "ARIA9"],
        before: `<h1>Contact</h1>
<label>Email</label>
<input type="text">`,
        after: `<h1>Contact Us</h1>
<label for="email">Email Address</label>
<input id="email" type="email">`,
        explanation: "Use descriptive headings and labels. Avoid generic \"Info\" or \"Field\". Users scan headings to navigate. Labels must be associated with inputs using <label for>.",
        examples: {
            before: {
                html: `<div class="form-container">
  <h2>Form</h2>
  <div class="form-section">
    <h3>Section 1</h3>
    <label>Field 1</label>
    <input type="text">
    <label>Field 2</label>
    <input type="text">
  </div>
  <div class="form-section">
    <h3>Section 2</h3>
    <label>Input</label>
    <input type="text">
    <label>Data</label>
    <input type="text">
  </div>
  <button>Submit</button>
</div>`,
                css: `.form-container {
  max-width: 500px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-section {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-top: 10px;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}`,
                js: "",
                context: "This form uses generic, non-descriptive headings and labels like \"Form\", \"Section 1\", \"Field 1\", and \"Input\". Users cannot understand what information is required without reading surrounding context. Screen reader users who navigate by headings or form fields will hear meaningless labels that don't describe the purpose of each field. This creates confusion and increases the likelihood of errors."
            },
            after: {
                html: `<div class="form-container">
  <h2>Customer Registration Form</h2>
  <div class="form-section">
    <h3>Personal Information</h3>
    <label for="fullname">Full Name</label>
    <input id="fullname" type="text">
    <label for="email">Email Address</label>
    <input id="email" type="email">
  </div>
  <div class="form-section">
    <h3>Shipping Address</h3>
    <label for="street">Street Address</label>
    <input id="street" type="text">
    <label for="city">City</label>
    <input id="city" type="text">
  </div>
  <button type="submit">Complete Registration</button>
</div>`,
                css: `.form-container {
  max-width: 500px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-section {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: 600;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}`,
                js: "",
                context: "Descriptive headings and labels clearly communicate the purpose of each section and field. \"Customer Registration Form\" tells users what the form is for. \"Personal Information\" and \"Shipping Address\" organize the form into logical sections. Each label like \"Full Name\", \"Email Address\", \"Street Address\" explicitly describes what data is expected. Screen reader users can navigate by headings to jump to relevant sections and understand each field's purpose immediately. This reduces errors and improves form completion rates."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "users with cognitive disabilities", "all users scanning content", "users navigating by headings"],
            keySummary: [
                "Use descriptive headings that clearly describe content",
                "Write clear, specific labels for form inputs",
                "Ensure headings and labels are unique and meaningful",
                "Use heading hierarchy (h1, h2, h3) properly",
                "Make labels visible and adjacent to their controls"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.4.7",
        principle: "Operable",
        title: "Focus Visible",
        level: "AA",
        description: "Keyboard focus indicator is visible.",
        techniques: ["G149", "G165", "C15", "ARIA2"],
        before: `<style>
  button, a, input {
    outline: none;
  }
  button:focus, a:focus, input:focus {
    outline: none;
  }
</style>
<nav>
  <a href="#home" style="padding: 10px; margin: 5px; display: inline-block;">Home</a>
  <a href="#about" style="padding: 10px; margin: 5px; display: inline-block;">About</a>
  <a href="#contact" style="padding: 10px; margin: 5px; display: inline-block;">Contact</a>
</nav>
<button style="padding: 10px 20px; margin: 10px;">Submit</button>`,
        after: `<style>
  button:focus, a:focus, input:focus {
    outline: 3px solid #4A90E2;
    outline-offset: 2px;
  }
</style>
<nav>
  <a href="#home" style="padding: 10px; margin: 5px; display: inline-block;">Home</a>
  <a href="#about" style="padding: 10px; margin: 5px; display: inline-block;">About</a>
  <a href="#contact" style="padding: 10px; margin: 5px; display: inline-block;">Contact</a>
</nav>
<button style="padding: 10px 20px; margin: 10px;">Submit</button>`,
        explanation: "Always show visible focus indicators. Don't remove outlines. Keyboard users need to know which element has focus. Test Tab key navigation.",
        examples: {
            before: {
                html: `<div class="navigation-demo">
  <h3>Navigation Without Focus Indicators</h3>
  <nav class="no-focus">
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#contact">Contact</a>
  </nav>
  <div class="form-section">
    <input type="text" placeholder="Search..." class="no-focus">
    <button class="no-focus">Search</button>
  </div>
</div>`,
                css: `.navigation-demo {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.navigation-demo h3 {
  margin-top: 0;
  font-size: 16px;
}
nav.no-focus a {
  display: inline-block;
  padding: 10px 15px;
  margin: 5px;
  background: #f8f9fa;
  text-decoration: none;
  color: #007bff;
  border-radius: 4px;
}
.no-focus:focus {
  outline: none !important;
}
.form-section {
  margin-top: 20px;
}
input.no-focus {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}
button.no-focus {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
                js: "",
                context: "This example removes all focus indicators using outline: none. Keyboard users cannot see which element currently has focus when they press Tab. This creates a significant barrier for keyboard navigation, as users lose track of their position on the page. Users with motor disabilities who rely on keyboard navigation, as well as power users who prefer keyboard shortcuts, cannot effectively navigate the interface. The lack of visual feedback makes it impossible to know where you are or what will happen when you press Enter or Space."
            },
            after: {
                html: `<div class="navigation-demo">
  <h3>Navigation With Clear Focus Indicators</h3>
  <nav class="with-focus">
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#contact">Contact</a>
  </nav>
  <div class="form-section">
    <input type="text" placeholder="Search..." class="with-focus">
    <button class="with-focus">Search</button>
  </div>
</div>`,
                css: `.navigation-demo {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.navigation-demo h3 {
  margin-top: 0;
  font-size: 16px;
}
nav.with-focus a {
  display: inline-block;
  padding: 10px 15px;
  margin: 5px;
  background: #f8f9fa;
  text-decoration: none;
  color: #007bff;
  border-radius: 4px;
}
.with-focus:focus {
  outline: 3px solid #4A90E2;
  outline-offset: 2px;
}
.form-section {
  margin-top: 20px;
}
input.with-focus {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}
button.with-focus {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
                js: "",
                context: "Clear, visible focus indicators show keyboard users exactly which element has focus. The 3px blue outline with 2px offset provides strong visual feedback that works on various backgrounds. Keyboard users can confidently navigate through links, inputs, and buttons, always knowing their current position. This benefits users with motor disabilities, power users, and anyone who prefers or requires keyboard navigation. The consistent focus styling creates a predictable, accessible experience throughout the interface."
            },
            interactive: {
                enabled: true,
                instructions: "Press Tab repeatedly to navigate through the links, input field, and button. Notice how the accessible version shows a clear blue outline around the focused element, while the inaccessible version provides no visual feedback. Try navigating with your eyes closed to experience the difference."
            },
            userGroups: ["keyboard users", "users with motor disabilities", "power users", "users with low vision"],
            keySummary: [
                "Ensure keyboard focus indicator is clearly visible",
                "Use CSS :focus styles with sufficient contrast",
                "Never remove focus outlines without providing alternatives",
                "Make focus indicators at least 2px thick",
                "Test focus visibility on all interactive elements"
            ],
            principle: "Operable"
        }
    },
    {
        id: "2.5.1",
        principle: "Operable",
        title: "Pointer Gestures",
        level: "A",
        description: "Functionality using multi-point/path gestures can be operated by single pointer.",
        techniques: ["G215", "ARIA24"],
        before: `<!-- Requires 2-finger pinch -->
<div id="map">Map content</div>`,
        after: `<div id="map">Map content</div>
<button onclick="zoomIn()">+ Zoom In</button>
<button onclick="zoomOut()">- Zoom Out</button>`,
        explanation: "Provide single-click alternatives to complex gestures. Users with limited mobility can't perform pinching or swiping. Use buttons for zoom/scroll.",
        examples: {
            before: {
                html: `<div class="map-container">
  <h3>Interactive Map</h3>
  <div id="map" class="map-view">
    <img src="map-placeholder.png" alt="City map" style="width: 100%; height: auto;">
    <div class="map-instructions">
      <p>Use two-finger pinch to zoom</p>
      <p>Swipe with two fingers to pan</p>
    </div>
  </div>
</div>`,
                css: `.map-container {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.map-view {
  position: relative;
  border: 2px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  min-height: 400px;
  background: #f0f0f0;
}
.map-instructions {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255,255,255,0.9);
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}`,
                js: "",
                context: "This map requires multi-touch gestures (two-finger pinch to zoom, two-finger swipe to pan) that many users cannot perform. Users with motor disabilities, users with tremors, users with one hand, and users with mobility aids cannot use these gestures. Desktop users with a mouse have no way to zoom or pan. There are no alternative single-pointer controls, making the map completely unusable for these users."
            },
            after: {
                html: `<div class="map-container">
  <h3>Interactive Map</h3>
  <div class="map-controls">
    <button onclick="zoomIn()" aria-label="Zoom in">
      <span aria-hidden="true">+</span> Zoom In
    </button>
    <button onclick="zoomOut()" aria-label="Zoom out">
      <span aria-hidden="true">−</span> Zoom Out
    </button>
    <button onclick="resetZoom()" aria-label="Reset zoom">
      <span aria-hidden="true">⟲</span> Reset
    </button>
  </div>
  <div id="map" class="map-view">
    <img src="map-placeholder.png" alt="City map" id="mapImage" style="width: 100%; height: auto;">
  </div>
  <div class="map-instructions">
    <p><strong>Controls:</strong> Use buttons to zoom, or pinch/scroll on touch devices</p>
  </div>
</div>`,
                css: `.map-container {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.map-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.map-controls button {
  padding: 10px 15px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.map-controls button:hover {
  background: #0b5ed7;
}
.map-view {
  position: relative;
  border: 2px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  min-height: 400px;
  background: #f0f0f0;
}
.map-instructions {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
}`,
                js: `let zoomLevel = 1;

function zoomIn() {
  zoomLevel = Math.min(zoomLevel + 0.2, 3);
  updateZoom();
}

function zoomOut() {
  zoomLevel = Math.max(zoomLevel - 0.2, 0.5);
  updateZoom();
}

function resetZoom() {
  zoomLevel = 1;
  updateZoom();
}

function updateZoom() {
  const mapImage = document.getElementById('mapImage');
  mapImage.style.transform = \`scale(\${zoomLevel})\`;
  mapImage.style.transformOrigin = 'center';
}`,
                context: "The map now provides single-click button controls for zoom in, zoom out, and reset. Users can operate all functionality with a single pointer (mouse click, single tap, or keyboard). The buttons have clear labels and ARIA attributes for screen readers. Multi-touch gestures still work for users who can use them, but they're no longer required. This makes the map accessible to users with motor disabilities, desktop users, and anyone who cannot perform complex gestures."
            },
            interactive: {
                enabled: true,
                instructions: "Use the Zoom In, Zoom Out, and Reset buttons to control the map. Notice how all functionality is available through simple single-click actions."
            },
            userGroups: ["users with motor disabilities", "users with tremors", "users with one hand", "desktop mouse users", "users with mobility aids"],
            keySummary: [
                "Provide alternatives to complex multi-point gestures",
                "Support single-pointer alternatives for all gestures",
                "Avoid requiring path-based gestures (swipe, drag)",
                "Provide buttons or controls as alternatives to gestures",
                "Test with users who have motor impairments"
            ],
            principle: "Operable"
        }
    },
    {
        id: "3.1.1",
        principle: "Understandable",
        title: "Language of Page",
        level: "A",
        description: "Default language of page can be programmatically determined.",
        techniques: ["H57", "ARIA2"],
        before: `<html>
...content...
</html>`,
        after: `<html lang="en">
...content...
</html>`,
        explanation: "Set lang attribute on <html>. Screen readers use this for correct pronunciation. Translators use this to identify language for processing.",
        examples: {
            before: {
                html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Our Website</title>
</head>
<body>
  <h1>Welcome to Our Website</h1>
  <p>We provide excellent services to our customers worldwide.</p>
</body>
</html>`,
                css: `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
h1 {
  color: #333;
  margin-bottom: 15px;
}`,
                js: "",
                context: "This HTML document lacks a lang attribute on the html element. Screen readers cannot determine the page language and may use incorrect pronunciation rules, making content difficult to understand. Translation tools also cannot reliably detect the language, and search engines may not properly index the content for language-specific searches."
            },
            after: {
                html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Our Website</title>
</head>
<body>
  <h1>Welcome to Our Website</h1>
  <p>We provide excellent services to our customers worldwide.</p>
</body>
</html>`,
                css: `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
h1 {
  color: #333;
  margin-bottom: 15px;
}`,
                js: "",
                context: "The lang=\"en\" attribute on the html element declares that the page content is in English. Screen readers will use English pronunciation rules, ensuring words are spoken correctly. Translation tools can accurately detect the source language, and assistive technologies can provide language-appropriate features. This simple attribute significantly improves accessibility for international users and those using assistive technologies."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "users with cognitive disabilities", "international users", "users of translation tools"],
            keySummary: [
                "Set the lang attribute on the html element",
                "Use correct ISO language codes (en, es, fr, etc.)",
                "Declare the primary language of the page",
                "This helps screen readers pronounce content correctly",
                "Update lang attribute if page language changes dynamically"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.1.2",
        principle: "Understandable",
        title: "Language of Parts",
        level: "AA",
        description: "Language of passages in different languages can be identified.",
        techniques: ["H58", "ARIA11"],
        before: `<p>Welcome! Bienvenue! Bienvenido!</p>`,
        after: `<p>
  Welcome! 
  <span lang="fr">Bienvenue!</span> 
  <span lang="es">Bienvenido!</span>
</p>`,
        explanation: "Mark content in different languages with lang attributes. Helps screen readers switch pronunciation and improves translation tool accuracy.",
        examples: {
            before: {
                html: `<div class="welcome-message">
  <h2>Welcome to Our International Site</h2>
  <p class="greeting">
    Welcome! Bienvenue! Bienvenido! Willkommen! Benvenuto!
  </p>
  <div class="quote">
    <p>"C'est la vie" - that's life, as they say in France.</p>
    <p>Our motto: "Carpe diem" - seize the day!</p>
  </div>
</div>`,
                css: `.welcome-message {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 600px;
}
.greeting {
  font-size: 1.2em;
  font-weight: 600;
  color: #0d6efd;
  margin: 15px 0;
}
.quote {
  background: #f8f9fa;
  padding: 15px;
  border-left: 4px solid #0d6efd;
  margin-top: 15px;
}
.quote p {
  margin: 10px 0;
  font-style: italic;
}`,
                js: "",
                context: "This content mixes multiple languages (English, French, Spanish, German, Italian, Latin) without marking the language changes. Screen readers will attempt to pronounce all text using English pronunciation rules, resulting in incorrect and confusing pronunciation of foreign words and phrases. Users who speak these languages will hear garbled pronunciation. Translation tools cannot accurately identify which parts are in which language."
            },
            after: {
                html: `<div class="welcome-message">
  <h2>Welcome to Our International Site</h2>
  <p class="greeting">
    Welcome! 
    <span lang="fr">Bienvenue!</span> 
    <span lang="es">¡Bienvenido!</span> 
    <span lang="de">Willkommen!</span> 
    <span lang="it">Benvenuto!</span>
  </p>
  <div class="quote">
    <p><span lang="fr">C'est la vie</span> - that's life, as they say in France.</p>
    <p>Our motto: <span lang="la">Carpe diem</span> - seize the day!</p>
  </div>
</div>`,
                css: `.welcome-message {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 600px;
}
.greeting {
  font-size: 1.2em;
  font-weight: 600;
  color: #0d6efd;
  margin: 15px 0;
}
.quote {
  background: #f8f9fa;
  padding: 15px;
  border-left: 4px solid #0d6efd;
  margin-top: 15px;
}
.quote p {
  margin: 10px 0;
  font-style: italic;
}`,
                js: "",
                context: "Each foreign language phrase is now wrapped in a span element with the appropriate lang attribute (fr for French, es for Spanish, de for German, it for Italian, la for Latin). Screen readers will switch to the correct pronunciation rules for each language, ensuring accurate pronunciation. Translation tools can identify and properly translate each phrase. Users who speak these languages will hear correct pronunciation, improving comprehension and user experience."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "multilingual users", "users of translation tools", "international users"],
            keySummary: [
                "Use lang attribute on elements with different language",
                "Mark foreign words and phrases with appropriate lang",
                "Helps screen readers switch pronunciation",
                "Use correct ISO language codes for each language",
                "Don't mark proper nouns or technical terms"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.2.1",
        principle: "Understandable",
        title: "On Focus",
        level: "A",
        description: "When component receives focus, no change of context occurs.",
        techniques: ["G107", "ARIA15"],
        before: `<select onchange="this.form.submit()">
  <option>Select...</option>
  <option value="/page1">Page 1</option>
</select>`,
        after: `<label for="pages">Go to page:</label>
<select id="pages">
  <option>Select...</option>
  <option value="/page1">Page 1</option>
</select>
<button onclick="goToPage()">Go</button>`,
        explanation: "Don't auto-submit or auto-navigate on focus. Users should initiate changes deliberately via clicking a button, not just tabbing through fields.",
        examples: {
            before: {
                html: `<form action="/navigate">
  <label for="pageSelect">Jump to page:</label>
  <select id="pageSelect" onchange="window.location.href=this.value">
    <option value="">Select a page...</option>
    <option value="/home">Home</option>
    <option value="/about">About Us</option>
    <option value="/services">Services</option>
    <option value="/contact">Contact</option>
  </select>
</form>`,
                css: `form {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}`,
                js: "",
                context: "This dropdown menu automatically navigates to a new page as soon as the user changes the selection. Keyboard users who tab through options to read them will trigger unwanted navigation. Users with motor disabilities who accidentally select the wrong option are immediately taken away. Screen reader users exploring options will be interrupted. There's no way to cancel or review the selection before navigating."
            },
            after: {
                html: `<form action="/navigate">
  <label for="pageSelect">Jump to page:</label>
  <select id="pageSelect">
    <option value="">Select a page...</option>
    <option value="/home">Home</option>
    <option value="/about">About Us</option>
    <option value="/services">Services</option>
    <option value="/contact">Contact</option>
  </select>
  <button type="button" onclick="navigateToPage()">Go</button>
</form>`,
                css: `form {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 10px;
}
button {
  padding: 10px 20px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}`,
                js: `function navigateToPage() {
  const select = document.getElementById('pageSelect');
  const url = select.value;
  if (url) {
    window.location.href = url;
  } else {
    alert('Please select a page first.');
  }
}`,
                context: "Users can now explore all dropdown options without triggering navigation. They must explicitly click the \"Go\" button to navigate, giving them full control. Keyboard users can arrow through options to read them, then Tab to the button and press Enter to navigate. Users who accidentally select the wrong option can change their selection before clicking Go. This predictable behavior reduces errors and gives users confidence to explore options."
            },
            interactive: {
                enabled: true,
                instructions: "Use the dropdown to select different pages. In the before example, selecting an option immediately navigates. In the after example, you must click the Go button to navigate, giving you control."
            },
            userGroups: ["keyboard users", "users with motor disabilities", "screen reader users", "users with cognitive disabilities"],
            keySummary: [
                "Ensure focus alone does not trigger context changes",
                "Avoid auto-submitting forms when field receives focus",
                "Don't open new windows or dialogs on focus",
                "Provide explicit submit buttons for forms",
                "Warn users before automatic context changes"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.2.2",
        principle: "Understandable",
        title: "On Input",
        level: "A",
        description: "Changing form input doesn't automatically change context.",
        techniques: ["G80", "G13", "ARIA19"],
        before: `<input type="checkbox" onchange="this.form.submit()">
<label>Send notifications</label>`,
        after: `<input type="checkbox" id="notify">
<label for="notify">Send notifications</label>
<button type="submit">Save Settings</button>`,
        explanation: "Don't auto-submit on input change. Users need explicit confirmation. This is especially important for users with cognitive disabilities who may accidentally change values.",
        examples: {
            before: {
                html: `<form action="/save-settings" method="post">
  <h3>Notification Settings</h3>
  <div class="setting-item">
    <input type="checkbox" id="emailNotif" name="emailNotif" onchange="this.form.submit()">
    <label for="emailNotif">Email notifications</label>
  </div>
  <div class="setting-item">
    <input type="checkbox" id="smsNotif" name="smsNotif" onchange="this.form.submit()">
    <label for="smsNotif">SMS notifications</label>
  </div>
  <div class="setting-item">
    <input type="checkbox" id="pushNotif" name="pushNotif" onchange="this.form.submit()">
    <label for="pushNotif">Push notifications</label>
  </div>
</form>`,
                css: `form {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
}
h3 {
  margin-top: 0;
}
.setting-item {
  margin-bottom: 12px;
}
input[type="checkbox"] {
  margin-right: 8px;
}
label {
  cursor: pointer;
}`,
                js: "",
                context: "Each checkbox automatically submits the form when changed, causing immediate page reloads or navigation. Users who accidentally check/uncheck a box trigger unwanted submissions. Users exploring options with keyboard or screen readers will trigger multiple submissions. There's no way to review changes before saving, and no confirmation that settings were saved. This creates a confusing, error-prone experience."
            },
            after: {
                html: `<form action="/save-settings" method="post">
  <h3>Notification Settings</h3>
  <div class="setting-item">
    <input type="checkbox" id="emailNotif" name="emailNotif">
    <label for="emailNotif">Email notifications</label>
  </div>
  <div class="setting-item">
    <input type="checkbox" id="smsNotif" name="smsNotif">
    <label for="smsNotif">SMS notifications</label>
  </div>
  <div class="setting-item">
    <input type="checkbox" id="pushNotif" name="pushNotif">
    <label for="pushNotif">Push notifications</label>
  </div>
  <button type="submit">Save Settings</button>
  <div id="saveConfirmation" role="status" aria-live="polite" style="display: none; margin-top: 10px; color: #16a34a; font-weight: 600;">
    Settings saved successfully!
  </div>
</form>`,
                css: `form {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
}
h3 {
  margin-top: 0;
}
.setting-item {
  margin-bottom: 12px;
}
input[type="checkbox"] {
  margin-right: 8px;
}
label {
  cursor: pointer;
}
button {
  margin-top: 15px;
  padding: 10px 20px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}`,
                js: "",
                context: "Users can now check/uncheck multiple options and review their choices before clicking the \"Save Settings\" button. Accidental changes can be corrected before submission. The explicit save action gives users control and confidence. A confirmation message (with role='status' and aria-live='polite') announces the successful save to screen readers. This predictable, user-controlled behavior reduces errors and anxiety."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with cognitive disabilities", "users with motor disabilities", "keyboard users", "all users"],
            keySummary: [
                "Ensure changing input values doesn't cause unexpected changes",
                "Avoid auto-submitting forms on select change",
                "Provide submit button for form submission",
                "Warn users before automatic updates",
                "Use onchange events carefully and predictably"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.2.3",
        principle: "Understandable",
        title: "Consistent Navigation",
        level: "AA",
        description: "Repeated navigation occurs in same relative order.",
        techniques: ["G61", "ARIA11"],
        before: `<!-- Page 1: Home, About, Services -->
<!-- Page 2: Services, About, Home -->`,
        after: `<!-- All pages: Home, About, Services, Contact -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/services">Services</a>
  <a href="/contact">Contact</a>
</nav>`,
        explanation: "Keep navigation in same order across all pages. Consistency helps users learn site structure and navigate more efficiently without confusion.",
        examples: {
            before: {
                html: `<!-- Simulating inconsistent navigation across pages -->
<div class="page-demo">
  <div class="page-example">
    <h3>Homepage Navigation</h3>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/services">Services</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>
  <div class="page-example">
    <h3>About Page Navigation</h3>
    <nav>
      <a href="/services">Services</a>
      <a href="/">Home</a>
      <a href="/contact">Contact</a>
      <a href="/about">About</a>
    </nav>
  </div>
  <div class="page-example">
    <h3>Services Page Navigation</h3>
    <nav>
      <a href="/contact">Contact</a>
      <a href="/about">About</a>
      <a href="/">Home</a>
      <a href="/services">Services</a>
    </nav>
  </div>
</div>`,
                css: `.page-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-example {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 4px;
}
.page-example h3 {
  margin-top: 0;
  font-size: 14px;
  color: #666;
}
nav {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}
nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #007bff;
}`,
                js: "",
                context: "This example shows navigation menus that change order on different pages. Users must relearn the navigation structure on each page, which is confusing and inefficient. Users with cognitive disabilities may struggle to remember where items are located. Screen reader users who memorize the position of navigation items will be disoriented when the order changes. This inconsistency increases cognitive load and makes navigation unpredictable."
            },
            after: {
                html: `<!-- Consistent navigation across all pages -->
<div class="page-demo">
  <div class="page-example">
    <h3>Homepage Navigation</h3>
    <nav>
      <a href="/" class="active">Home</a>
      <a href="/about">About</a>
      <a href="/services">Services</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>
  <div class="page-example">
    <h3>About Page Navigation</h3>
    <nav>
      <a href="/">Home</a>
      <a href="/about" class="active">About</a>
      <a href="/services">Services</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>
  <div class="page-example">
    <h3>Services Page Navigation</h3>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/services" class="active">Services</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>
</div>`,
                css: `.page-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-example {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 4px;
}
.page-example h3 {
  margin-top: 0;
  font-size: 14px;
  color: #666;
}
nav {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}
nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #007bff;
}
nav a.active {
  font-weight: bold;
  color: #0056b3;
}`,
                js: "",
                context: "The navigation menu maintains the same order (Home, About, Services, Contact) across all pages. Only the active page indicator changes. Users can learn the navigation structure once and rely on it throughout the site. This consistency reduces cognitive load, improves navigation efficiency, and helps users with cognitive disabilities navigate confidently. Screen reader users can memorize the position of navigation items and navigate more quickly. The predictable structure makes the entire site easier to use for everyone."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with cognitive disabilities", "screen reader users", "all users", "older users"],
            keySummary: [
                "Keep navigation menus in the same location across pages",
                "Maintain consistent order of navigation items",
                "Use same navigation structure throughout site",
                "Repeated components should appear in same relative order",
                "Consistency helps users build mental models"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.2.4",
        principle: "Understandable",
        title: "Consistent Identification",
        level: "AA",
        description: "Components with same functionality identified consistently.",
        techniques: ["G197", "ARIA7", "ARIA8"],
        before: `<!-- Page 1: \"Email Us\" button -->
<!-- Page 2: \"Contact\" button -->
<!-- Page 3: \"Send Message\" button -->`,
        after: `<!-- All pages: \"Contact Us\" button with same icon -->
<button class="contact-button">
  [Mail] Contact Us
</button>`,
        explanation: "Use consistent labels and icons for the same function everywhere. Users expect \"Contact Us\" to work the same way on every page.",
        examples: {
            before: {
                html: `<!-- Simulating inconsistent identification across pages -->
<div class="pages-demo">
  <div class="page-example">
    <h4>Homepage</h4>
    <button class="action-btn">
      <span>📧</span> Email Us
    </button>
    <button class="action-btn">
      <span>🔍</span> Find
    </button>
  </div>
  
  <div class="page-example">
    <h4>About Page</h4>
    <button class="action-btn">
      <span>✉️</span> Contact
    </button>
    <button class="action-btn">
      <span>🔎</span> Search
    </button>
  </div>
  
  <div class="page-example">
    <h4>Services Page</h4>
    <button class="action-btn">
      <span>💬</span> Send Message
    </button>
    <button class="action-btn">
      <span>🔍</span> Lookup
    </button>
  </div>
</div>`,
                css: `.pages-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-example {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
}
.page-example h4 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}
.action-btn {
  padding: 10px 15px;
  margin-right: 10px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}`,
                js: "",
                context: "The same functionality (contacting the company and searching) is labeled differently on each page: 'Email Us', 'Contact', 'Send Message' for contact; 'Find', 'Search', 'Lookup' for search. Different icons are also used. Users must relearn what each button does on every page. Users with cognitive disabilities struggle with this inconsistency. Screen reader users hear different labels for the same function, creating confusion about whether these are different features or the same one."
            },
            after: {
                html: `<!-- Consistent identification across all pages -->
<div class="pages-demo">
  <div class="page-example">
    <h4>Homepage</h4>
    <button class="action-btn" aria-label="Contact us">
      <span aria-hidden="true">📧</span> Contact Us
    </button>
    <button class="action-btn" aria-label="Search site">
      <span aria-hidden="true">🔍</span> Search
    </button>
  </div>
  
  <div class="page-example">
    <h4>About Page</h4>
    <button class="action-btn" aria-label="Contact us">
      <span aria-hidden="true">📧</span> Contact Us
    </button>
    <button class="action-btn" aria-label="Search site">
      <span aria-hidden="true">🔍</span> Search
    </button>
  </div>
  
  <div class="page-example">
    <h4>Services Page</h4>
    <button class="action-btn" aria-label="Contact us">
      <span aria-hidden="true">📧</span> Contact Us
    </button>
    <button class="action-btn" aria-label="Search site">
      <span aria-hidden="true">🔍</span> Search
    </button>
  </div>
</div>`,
                css: `.pages-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-example {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
}
.page-example h4 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}
.action-btn {
  padding: 10px 15px;
  margin-right: 10px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}`,
                js: "",
                context: "The same functionality now uses consistent labels and icons across all pages: 'Contact Us' with the mail icon for contacting, 'Search' with the magnifying glass icon for searching. Users learn once and can confidently use these functions on any page. Users with cognitive disabilities benefit from the predictable, consistent interface. Screen reader users hear the same label for the same function throughout the site, reducing confusion and improving navigation efficiency."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with cognitive disabilities", "screen reader users", "all users", "users with memory impairments"],
            keySummary: [
                "Use same icons and labels for same functionality",
                "Consistent naming for repeated components",
                "Same visual appearance for same functions",
                "Use same wording for similar actions across site",
                "Helps users recognize familiar patterns"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.3.1",
        principle: "Understandable",
        title: "Error Identification",
        level: "A",
        description: "Errors identified and described to user in text.",
        techniques: ["G83", "G84", "G85", "ARIA18", "ARIA19"],
        before: `<input type="email" id="email">
<button>Submit</button>`,
        after: `<label for="email">Email Address</label>
<input type="email" id="email" aria-describedby="email-error">
<div id="email-error" role="alert"></div>
<button type="submit">Submit</button>`,
        explanation: "Identify errors clearly with text messages, not just red highlighting. Tell users what was wrong and how to fix it. Use role=\"alert\" for important errors.",
        examples: {
            before: {
                html: `<form>
  <h3>Contact Form</h3>
  <div class="form-field">
    <label for="email">Email</label>
    <input id="email" type="text" class="error-field">
  </div>
  <div class="form-field">
    <label for="phone">Phone</label>
    <input id="phone" type="text" class="error-field">
  </div>
  <button type="submit">Submit</button>
</form>`,
                css: `form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-field {
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
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error-field {
  border-color: #dc2626 !important;
  background: #fef2f2 !important;
}`,
                js: "",
                context: "This form indicates errors only through visual styling (red border and pink background). Users who are colorblind, have low vision, or use screen readers cannot identify which fields have errors or what the errors are. There's no text explanation of what went wrong or how to fix it. Users must guess what's invalid about their input."
            },
            after: {
                html: `<form>
  <h3>Contact Form</h3>
  <div id="errorSummary" role="alert" class="error-summary" style="display: none;">
    <h4>Please fix the following errors:</h4>
    <ul id="errorList"></ul>
  </div>
  <div class="form-field">
    <label for="email">Email</label>
    <input id="email" type="text" aria-describedby="email-error" aria-invalid="true">
    <div id="email-error" class="error-message">Please enter a valid email address (e.g., user@example.com)</div>
  </div>
  <div class="form-field">
    <label for="phone">Phone</label>
    <input id="phone" type="text" aria-describedby="phone-error" aria-invalid="true">
    <div id="phone-error" class="error-message">Please enter a valid phone number (e.g., 555-123-4567)</div>
  </div>
  <button type="submit">Submit</button>
</form>`,
                css: `form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.error-summary {
  background: #fef2f2;
  border: 2px solid #dc2626;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}
.error-summary h4 {
  margin: 0 0 10px 0;
  color: #dc2626;
}
.form-field {
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
  border: 1px solid #ccc;
  border-radius: 4px;
}
input[aria-invalid="true"] {
  border-color: #dc2626;
  background: #fef2f2;
}
.error-message {
  color: #dc2626;
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
}`,
                js: "",
                context: "Errors are now clearly identified with descriptive text messages that explain what's wrong and how to fix it. The error summary at the top (with role='alert') lists all errors and is announced to screen readers. Each field has an associated error message linked via aria-describedby, so screen readers announce the error when the field receives focus. The aria-invalid='true' attribute programmatically indicates the error state. Users of all abilities can identify and correct errors efficiently."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "colorblind users", "users with cognitive disabilities", "all users"],
            keySummary: [
                "Clearly identify and describe input errors",
                "Use text descriptions, not just color or icons",
                "Place error messages near the relevant field",
                "Use aria-invalid and aria-describedby for errors",
                "Provide error summary at top of form"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.3.2",
        principle: "Understandable",
        title: "Labels or Instructions",
        level: "A",
        description: "Labels or instructions provided for user input.",
        techniques: ["G131", "G162", "H90", "ARIA1", "ARIA9"],
        before: `<form class="registration-form">
  <div style="margin-bottom: 15px;">
    <input type="text" placeholder="Full Name" style="padding: 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  <div style="margin-bottom: 15px;">
    <input type="email" placeholder="Email Address" style="padding: 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  <div style="margin-bottom: 15px;">
    <input type="tel" placeholder="Phone" style="padding: 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  <button type="submit" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px;">Register</button>
</form>`,
        after: `<form class="registration-form">
  <div style="margin-bottom: 15px;">
    <label for="fullname" style="display: block; margin-bottom: 5px; font-weight: 600;">Full Name <span style="color: #dc3545;">*</span></label>
    <input id="fullname" type="text" required aria-required="true" style="padding: 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  <div style="margin-bottom: 15px;">
    <label for="email" style="display: block; margin-bottom: 5px; font-weight: 600;">Email Address <span style="color: #dc3545;">*</span></label>
    <input id="email" type="email" required aria-required="true" style="padding: 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  <div style="margin-bottom: 15px;">
    <label for="phone" style="display: block; margin-bottom: 5px; font-weight: 600;">Phone <span style="font-weight: normal; font-size: 0.9em;">(Format: 555-123-4567)</span></label>
    <input id="phone" type="tel" placeholder="555-123-4567" style="padding: 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  <button type="submit" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Register</button>
</form>`,
        explanation: "Use <label for> elements, not just placeholders. Include instructions about required fields and format (e.g., date format, phone format).",
        examples: {
            before: {
                html: `<form class="registration-form">
  <input type="text" placeholder="Full Name">
  <input type="email" placeholder="Email Address">
  <input type="tel" placeholder="Phone">
  <input type="password" placeholder="Password">
  <button type="submit">Register</button>
</form>`,
                css: `.registration-form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 12px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
                js: "",
                context: "This form relies solely on placeholder text for labels. Placeholders disappear when users start typing, making it impossible to verify which field they're filling out. Screen readers may not announce placeholders reliably. There's no indication of which fields are required or what format is expected. Users with cognitive disabilities may forget what information was requested once they start typing."
            },
            after: {
                html: `<form class="registration-form">
  <div class="form-field">
    <label for="fullname">Full Name <span class="required" aria-label="required">*</span></label>
    <input id="fullname" type="text" required aria-required="true">
  </div>
  <div class="form-field">
    <label for="email">Email Address <span class="required" aria-label="required">*</span></label>
    <input id="email" type="email" required aria-required="true" aria-describedby="email-help">
    <small id="email-help">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-field">
    <label for="phone">Phone Number</label>
    <input id="phone" type="tel" placeholder="555-123-4567" aria-describedby="phone-help">
    <small id="phone-help">Format: 555-123-4567 (optional)</small>
  </div>
  <div class="form-field">
    <label for="password">Password <span class="required" aria-label="required">*</span></label>
    <input id="password" type="password" required aria-required="true" aria-describedby="password-help">
    <small id="password-help">Must be at least 8 characters with one number and one special character.</small>
  </div>
  <button type="submit">Register</button>
</form>`,
                css: `.registration-form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-field {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
.required {
  color: #dc2626;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
small {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 14px;
}
button {
  width: 100%;
  padding: 12px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
                js: "",
                context: "Each field now has a persistent label that remains visible when typing. Required fields are clearly marked with an asterisk and aria-required='true'. Help text provides format instructions and additional context, linked via aria-describedby so screen readers announce it. Users always know what information is requested, which fields are required, and what format is expected. This reduces errors and improves form completion rates."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "users with cognitive disabilities", "users with memory impairments", "all users"],
            keySummary: [
                "Provide visible labels for all form inputs",
                "Use label element properly associated with input",
                "Provide instructions for complex or required fields",
                "Use placeholder text as supplement, not replacement",
                "Indicate required fields clearly"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.3.3",
        principle: "Understandable",
        title: "Error Suggestion",
        level: "AA",
        description: "Error suggestions provided if known.",
        techniques: ["G85", "G177", "ARIA18"],
        before: `Error: Invalid input`,
        after: `Error: Invalid email format
Expected format: example@domain.com
Did you mean: john@gmail.com?`,
        explanation: "When errors occur, suggest corrections if possible. Detect typos and offer corrections. Help users fix errors easily without re-entering everything.",
        examples: {
            before: {
                html: `<form>
  <h3>Login</h3>
  <div class="form-field">
    <label for="username">Username</label>
    <input id="username" type="text" value="john.doe">
    <div class="error-message">Error: Invalid username</div>
  </div>
  <div class="form-field">
    <label for="email">Email</label>
    <input id="email" type="text" value="john@gmial.com">
    <div class="error-message">Error: Invalid email format</div>
  </div>
  <button type="submit">Login</button>
</form>`,
                css: `form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-field {
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
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error-message {
  color: #dc2626;
  font-size: 14px;
  margin-top: 5px;
}`,
                js: "",
                context: "These error messages only state that something is wrong without providing helpful suggestions. Users must figure out on their own what's invalid and how to fix it. The email has a common typo ('gmial' instead of 'gmail') that could be detected and suggested. Users with cognitive disabilities may struggle to identify and correct errors without specific guidance."
            },
            after: {
                html: `<form>
  <h3>Login</h3>
  <div class="form-field">
    <label for="username">Username</label>
    <input id="username" type="text" value="john.doe" aria-describedby="username-error" aria-invalid="true">
    <div id="username-error" class="error-message">
      <strong>Error:</strong> Username must be at least 6 characters long and contain only letters, numbers, and underscores.
      <br><strong>Suggestion:</strong> Try "john_doe" or "johndoe123"
    </div>
  </div>
  <div class="form-field">
    <label for="email">Email</label>
    <input id="email" type="text" value="john@gmial.com" aria-describedby="email-error" aria-invalid="true">
    <div id="email-error" class="error-message">
      <strong>Error:</strong> Email address appears to have a typo.
      <br><strong>Did you mean:</strong> <button type="button" class="suggestion-btn" onclick="document.getElementById('email').value='john@gmail.com'">john@gmail.com</button>?
    </div>
  </div>
  <button type="submit">Login</button>
</form>`,
                css: `form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-field {
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
  border: 1px solid #ccc;
  border-radius: 4px;
}
input[aria-invalid="true"] {
  border-color: #dc2626;
}
.error-message {
  color: #dc2626;
  font-size: 14px;
  margin-top: 5px;
  line-height: 1.5;
}
.suggestion-btn {
  background: none;
  border: none;
  color: #0d6efd;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}`,
                js: "",
                context: "Error messages now provide specific, actionable suggestions. The username error explains the requirements and offers example corrections. The email error detects the common typo and provides a clickable suggestion to fix it automatically. Users can quickly correct errors without guessing or re-typing everything. This reduces frustration and improves form completion rates, especially for users with cognitive disabilities."
            },
            interactive: {
                enabled: true,
                instructions: "Notice how the after example provides specific suggestions for fixing errors. Click the suggested email correction to automatically fix the typo."
            },
            userGroups: ["users with cognitive disabilities", "users with dyslexia", "all users", "non-native language speakers"],
            keySummary: [
                "Provide specific suggestions for fixing errors",
                "Explain what went wrong and how to fix it",
                "Offer examples of correct input format",
                "Use clear, non-technical language",
                "Provide suggestions unless it compromises security"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.3.4",
        principle: "Understandable",
        title: "Error Prevention (Legal, Financial, Data)",
        level: "AA",
        description: "Legal/financial transactions allow review, check, or confirmation.",
        techniques: ["G164", "G98", "G155"],
        before: `<form>
  <input type="hidden" name="amount" value="1000">
  <button>Pay Now</button>
</form>`,
        after: `<form>
  <h2>Confirm Purchase</h2>
  <p>Price: $1000.00</p>
  <button name="action" value="back">Back</button>
  <button name="action" value="confirm">Confirm</button>
</form>`,
        explanation: "Include review/confirmation steps for financial transactions. Provide undo capability. Prevent accidental submissions with explicit confirm buttons.",
        examples: {
            before: {
                html: `<form action="/process-payment" method="post">
  <h3>Complete Purchase</h3>
  <input type="hidden" name="amount" value="1299.99">
  <input type="hidden" name="item" value="Laptop Computer">
  <div class="payment-info">
    <p>Item: Laptop Computer</p>
    <p>Amount: $1,299.99</p>
  </div>
  <button type="submit">Pay Now</button>
</form>`,
                css: `form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.payment-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}
button {
  width: 100%;
  padding: 12px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}`,
                js: "",
                context: "This payment form immediately processes the transaction when the button is clicked, with no confirmation step. Users who accidentally click the button or misunderstand the amount will complete an unwanted purchase. There's no opportunity to review the details, no way to go back, and no undo option. This is especially problematic for users with motor disabilities who may click accidentally, or users with cognitive disabilities who need more time to review."
            },
            after: {
                html: `<div class="checkout-flow">
  <div class="step-indicator">
    <span class="step completed">1. Cart</span>
    <span class="step completed">2. Shipping</span>
    <span class="step active">3. Review & Confirm</span>
  </div>
  
  <form action="/process-payment" method="post">
    <h3>Review Your Order</h3>
    
    <div class="order-summary">
      <h4>Order Details</h4>
      <div class="summary-item">
        <span>Item:</span>
        <span>Laptop Computer</span>
      </div>
      <div class="summary-item">
        <span>Quantity:</span>
        <span>1</span>
      </div>
      <div class="summary-item">
        <span>Price:</span>
        <span>$1,299.99</span>
      </div>
      <div class="summary-item total">
        <span><strong>Total:</strong></span>
        <span><strong>$1,299.99</strong></span>
      </div>
    </div>
    
    <div class="confirmation-checkbox">
      <input type="checkbox" id="confirm" required>
      <label for="confirm">I have reviewed my order and confirm the purchase of $1,299.99</label>
    </div>
    
    <div class="button-group">
      <button type="button" class="btn-secondary" onclick="history.back()">
        ← Back to Edit
      </button>
      <button type="submit" class="btn-primary">
        Confirm Purchase
      </button>
    </div>
  </form>
</div>`,
                css: `.checkout-flow {
  max-width: 500px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.step-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #dee2e6;
}
.step {
  font-size: 14px;
  color: #666;
}
.step.completed {
  color: #16a34a;
}
.step.active {
  color: #0d6efd;
  font-weight: 600;
}
.order-summary {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}
.order-summary h4 {
  margin-top: 0;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #dee2e6;
}
.summary-item.total {
  border-bottom: none;
  padding-top: 12px;
  font-size: 1.1em;
}
.confirmation-checkbox {
  margin-bottom: 20px;
  padding: 15px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
}
.confirmation-checkbox input {
  margin-right: 8px;
}
.button-group {
  display: flex;
  gap: 10px;
}
.btn-secondary, .btn-primary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.btn-secondary {
  background: #6c757d;
  color: white;
}
.btn-primary {
  background: #16a34a;
  color: white;
}`,
                js: "",
                context: "Users now have a clear review and confirmation step before completing the purchase. The order details are displayed prominently for review. A required checkbox ensures users explicitly confirm they've reviewed the order. A \"Back to Edit\" button allows users to make changes before confirming. The step indicator shows progress through the checkout flow. This multi-step process with explicit confirmation prevents accidental purchases and gives users confidence in their transaction."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["users with motor disabilities", "users with cognitive disabilities", "all users making financial transactions"],
            keySummary: [
                "Allow users to review and confirm before final submission",
                "Provide ability to reverse or correct submissions",
                "Check data for errors before submission",
                "Especially important for legal, financial, or data deletion",
                "Provide clear confirmation pages"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "3.3.5",
        principle: "Understandable",
        title: "Help",
        level: "AAA",
        description: "Context-sensitive help is available.",
        techniques: ["G71", "G184", "G193"],
        before: `<label for="phone">Phone</label>
<input id="phone" type="tel">`,
        after: `<label for="phone">
  Phone
  <button type="button\" aria-label="Phone format help"> ? </button>
</label>
<input id="phone" type="tel" placeholder="(123) 456-7890">
<small id="phone-help">Format: (123) 456-7890</small>`,
        explanation: "Provide context-sensitive help for complex fields. Show format examples, tooltips, or help buttons. Users with cognitive disabilities benefit from accessible help.",
        examples: {
            before: {
                html: `<form>
  <h3>Account Settings</h3>
  <div class="form-field">
    <label for="password">New Password</label>
    <input id="password" type="password">
  </div>
  <div class="form-field">
    <label for="phone">Phone Number</label>
    <input id="phone" type="tel">
  </div>
  <div class="form-field">
    <label for="date">Birth Date</label>
    <input id="date" type="text">
  </div>
  <button type="submit">Save</button>
</form>`,
                css: `form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-field {
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
  border: 1px solid #ccc;
  border-radius: 4px;
}`,
                js: "",
                context: "This form provides no help or guidance for complex fields. Users must guess password requirements, phone number format, and date format. Users with cognitive disabilities may struggle to understand what's expected. There's no way to get help without leaving the form or making errors."
            },
            after: {
                html: `<form>
  <h3>Account Settings</h3>
  <div class="form-field">
    <label for="password">
      New Password
      <button type="button" class="help-btn" aria-label="Password requirements help" onclick="toggleHelp('password-help')">
        <span aria-hidden="true">?</span>
      </button>
    </label>
    <input id="password" type="password" aria-describedby="password-help">
    <div id="password-help" class="help-text">
      <strong>Password must contain:</strong>
      <ul>
        <li>At least 8 characters</li>
        <li>One uppercase letter</li>
        <li>One lowercase letter</li>
        <li>One number</li>
        <li>One special character (!@#$%^&*)</li>
      </ul>
    </div>
  </div>
  <div class="form-field">
    <label for="phone">
      Phone Number
      <button type="button" class="help-btn" aria-label="Phone format help" onclick="toggleHelp('phone-help')">
        <span aria-hidden="true">?</span>
      </button>
    </label>
    <input id="phone" type="tel" placeholder="(555) 123-4567" aria-describedby="phone-help">
    <div id="phone-help" class="help-text">
      Enter your phone number in the format: (555) 123-4567
    </div>
  </div>
  <div class="form-field">
    <label for="date">
      Birth Date
      <button type="button" class="help-btn" aria-label="Date format help" onclick="toggleHelp('date-help')">
        <span aria-hidden="true">?</span>
      </button>
    </label>
    <input id="date" type="text" placeholder="MM/DD/YYYY" aria-describedby="date-help">
    <div id="date-help" class="help-text">
      Enter your birth date in the format: MM/DD/YYYY (e.g., 01/15/1990)
    </div>
  </div>
  <button type="submit">Save</button>
</form>`,
                css: `form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-field {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
.help-btn {
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.help-text {
  background: #e7f3ff;
  border-left: 3px solid #0d6efd;
  padding: 10px;
  margin-top: 8px;
  font-size: 14px;
  border-radius: 4px;
}
.help-text ul {
  margin: 5px 0 0 20px;
  padding: 0;
}`,
                js: `function toggleHelp(id) {
  const helpText = document.getElementById(id);
  if (helpText.style.display === 'none') {
    helpText.style.display = 'block';
  } else {
    helpText.style.display = 'none';
  }
}`,
                context: "Each complex field now has context-sensitive help available through a help button (?) next to the label. The help text provides clear format requirements and examples. Help is linked to inputs via aria-describedby so screen readers announce it. Users can access help without leaving the form, reducing errors and improving completion rates. The help is always available but doesn't clutter the interface."
            },
            interactive: {
                enabled: true,
                instructions: "Click the ? buttons next to each label to view context-sensitive help for that field. The help provides format requirements and examples."
            },
            userGroups: ["users with cognitive disabilities", "users with memory impairments", "all users", "non-native language speakers"],
            keySummary: [
                "Provide context-sensitive help for complex forms",
                "Offer help text, tooltips, or help links",
                "Explain expected input format and requirements",
                "Provide examples of correct input",
                "Make help easily discoverable and accessible"
            ],
            principle: "Understandable"
        }
    },
    {
        id: "4.1.1",
        principle: "Robust",
        title: "Parsing",
        level: "A",
        description: "HTML elements have complete tags and proper nesting.",
        techniques: ["G134", "H88", "H93", "H94"],
        before: `<div>
  <p>Paragraph
  <span>Span
</div>`,
        after: `<div>
  <p>Paragraph</p>
  <span>Span</span>
</div>`,
        explanation: "Always close tags properly. Validate HTML with W3C Validator. Proper markup ensures assistive technologies can parse and interpret content correctly.",
        examples: {
            before: {
                html: `<div class="article">
  <h2>Article Title
  <p>This is the first paragraph of the article.
  <p>This is the second paragraph.
  <ul>
    <li>First item
    <li>Second item
    <li>Third item
  </div>
<div class="sidebar">
  <h3>Related Links
  <a href="/link1">Link 1
  <a href="/link2">Link 2</a>
</div>`,
                css: `.article {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
}
.sidebar {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}`,
                js: "",
                context: "This HTML has multiple parsing errors: unclosed h2, p, li, h3, and a tags, and improper nesting (ul not closed before closing div). While browsers may render this with error correction, assistive technologies may not parse it correctly. Screen readers might skip content, announce elements incorrectly, or become confused about the document structure. The DOM tree is ambiguous, leading to unpredictable behavior."
            },
            after: {
                html: `<div class="article">
  <h2>Article Title</h2>
  <p>This is the first paragraph of the article.</p>
  <p>This is the second paragraph.</p>
  <ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
  </ul>
</div>
<div class="sidebar">
  <h3>Related Links</h3>
  <a href="/link1">Link 1</a>
  <a href="/link2">Link 2</a>
</div>`,
                css: `.article {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
}
.sidebar {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}`,
                js: "",
                context: "All HTML tags are now properly closed and nested. The document structure is unambiguous and will be parsed consistently by all browsers and assistive technologies. Screen readers can correctly identify headings, paragraphs, lists, and links. The DOM tree is well-formed, ensuring predictable behavior. This valid HTML provides a reliable foundation for accessibility features to work correctly."
            },
            interactive: {
                enabled: false
            },
            userGroups: ["screen reader users", "users of assistive technologies", "all users"],
            keySummary: [
                "Ensure HTML is well-formed and valid",
                "Close all tags properly",
                "Use unique IDs for all elements",
                "Properly nest elements",
                "Validate HTML with W3C validator"
            ],
            principle: "Robust"
        }
    },
    {
        id: "4.1.2",
        principle: "Robust",
        title: "Name, Role, Value",
        level: "A",
        description: "Component name, role, and state can be programmatically determined.",
        techniques: ["G108", "H91", "ARIA4", "ARIA5", "ARIA16"],
        before: `<div class="button" onclick="submit()">Click</div>`,
        after: `<button type="submit" onclick="submit()" aria-label="Submit form">
  Click to Submit
</button>`,
        explanation: "Use semantic HTML so assistive tech understands role (button, link, etc). Add ARIA labels when needed. Screen readers announce role, name, and state.",
        examples: {
            before: {
                html: `<div class="custom-checkbox" onclick="toggleCheckbox(this)">
  <span class="checkbox-icon">☐</span>
  <span class="checkbox-label">I agree to the terms and conditions</span>
</div>
<div class="custom-button" onclick="submitForm()">
  Submit
</div>`,
                css: `.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
}
.checkbox-icon {
  font-size: 24px;
  margin-right: 10px;
}
.custom-button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  margin-top: 15px;
}`,
                js: `function toggleCheckbox(element) {
  const icon = element.querySelector('.checkbox-icon');
  if (icon.textContent === '☐') {
    icon.textContent = '☑';
  } else {
    icon.textContent = '☐';
  }
}`,
                context: "These custom controls use div elements styled to look like a checkbox and button, but they lack semantic meaning. Screen readers cannot identify them as interactive controls, announce their roles, or communicate their states. Keyboard users cannot focus on them or activate them. The checkbox state change is purely visual with no programmatic indication, making it impossible for assistive technologies to detect whether it's checked or unchecked."
            },
            after: {
                html: `<div class="form-group">
  <input type="checkbox" id="terms" class="custom-checkbox-input">
  <label for="terms" class="custom-checkbox-label">
    I agree to the terms and conditions
  </label>
</div>
<button type="submit" class="custom-button" onclick="submitForm()">
  Submit
</button>`,
                css: `.form-group {
  padding: 10px;
}
.custom-checkbox-input {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
}
.custom-checkbox-label {
  cursor: pointer;
  font-size: 16px;
}
.custom-button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 16px;
  margin-top: 15px;
}
.custom-button:focus,
.custom-checkbox-input:focus {
  outline: 2px solid #0056b3;
  outline-offset: 2px;
}`,
                js: `function submitForm() {
  const checkbox = document.getElementById('terms');
  if (checkbox.checked) {
    alert('Form submitted!');
  } else {
    alert('Please agree to terms first');
  }
}`,
                context: "Using semantic HTML elements provides proper name, role, and value information. The input type=\"checkbox\" element has an implicit role of checkbox that screen readers announce. The label element provides the accessible name through its for attribute. The checked state is programmatically available and announced by assistive technologies. The button element has an implicit role of button. Both controls are keyboard accessible and their states can be queried programmatically by assistive technologies."
            },
            interactive: {
                enabled: true,
                instructions: "Press Tab to navigate to the checkbox and button. Use Space to toggle the checkbox and Enter to activate the button. Screen readers will announce the role and state of each control."
            },
            userGroups: ["screen reader users", "keyboard users", "users with motor disabilities", "voice control users"],
            keySummary: [
                "Use proper ARIA roles, states, and properties",
                "Ensure name and role can be programmatically determined",
                "Use native HTML elements when possible",
                "Provide accessible names for custom controls",
                "Test with screen readers to verify announcements"
            ],
            principle: "Robust"
        }
    },
    {
        id: "4.1.3",
        principle: "Robust",
        title: "Status Messages",
        level: "AA",
        description: "Status messages can be programmatically determined.",
        techniques: ["G83", "ARIA19", "ARIA22", "ARIA23"],
        before: `<div class="save-panel">
  <button type="button" class="btn btn-primary btn-sm">Save Settings</button>
  <div class="alert alert-secondary mt-2 mb-0">
    Saved! (visual message only, no live announcement)
  </div>
</div>`,
        after: `<div class="save-panel">
  <button type="button" class="btn btn-primary btn-sm">Save Settings</button>
  <div class="alert alert-success mt-2 mb-0" role="status" aria-live="polite" aria-atomic="true">
    File saved successfully!
  </div>
</div>`,
        explanation: "Use ARIA live regions (role=\"status\") to announce updates. Screen readers automatically read status messages. Use aria-live=\"polite\" for non-critical updates.",
        examples: {
            before: {
                html: `<div class="status-demo">
  <h3>Form Submission Demo</h3>
  <form id="demoForm">
    <label for="username">Username:</label>
    <input type="text" id="username" required>
    <button type="submit">Save</button>
  </form>
  <div id="statusMessage" class="status-message" style="display: none;">
    Settings saved successfully!
  </div>
</div>`,
                css: `.status-demo {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
}
.status-demo h3 {
  margin-top: 0;
  font-size: 16px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.status-message {
  margin-top: 15px;
  padding: 10px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}`,
                js: `document.getElementById('demoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const statusMsg = document.getElementById('statusMessage');
  statusMsg.style.display = 'block';
  setTimeout(() => {
    statusMsg.style.display = 'none';
  }, 3000);
});`,
                context: "This status message appears visually when the form is submitted, but it lacks ARIA live region attributes. Screen readers will not announce the message because they are not monitoring this element for changes. Users who cannot see the screen will not know that their action was successful. They may submit the form multiple times or assume it failed, creating confusion and a poor user experience."
            },
            after: {
                html: `<div class="status-demo">
  <h3>Form Submission Demo</h3>
  <form id="demoFormAccessible">
    <label for="usernameAccessible">Username:</label>
    <input type="text" id="usernameAccessible" required>
    <button type="submit">Save</button>
  </form>
  <div id="statusMessageAccessible" class="status-message" role="status" aria-live="polite" aria-atomic="true" style="display: none;">
    Settings saved successfully!
  </div>
</div>`,
                css: `.status-demo {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
}
.status-demo h3 {
  margin-top: 0;
  font-size: 16px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.status-message {
  margin-top: 15px;
  padding: 10px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}`,
                js: `document.getElementById('demoFormAccessible').addEventListener('submit', function(e) {
  e.preventDefault();
  const statusMsg = document.getElementById('statusMessageAccessible');
  statusMsg.style.display = 'block';
  setTimeout(() => {
    statusMsg.style.display = 'none';
  }, 3000);
});`,
                context: "The status message now includes role=\"status\", aria-live=\"polite\", and aria-atomic=\"true\". When the message appears, screen readers will automatically announce it to users without interrupting their current task. The aria-live=\"polite\" attribute ensures the announcement happens at a natural pause, not immediately. The aria-atomic=\"true\" ensures the entire message is read, not just the changed portion. This provides essential feedback to screen reader users, confirming their action was successful."
            },
            interactive: {
                enabled: true,
                instructions: "Enter a username and click Save. Watch for the success message. With a screen reader enabled, the accessible version will announce \"Settings saved successfully!\" automatically, while the inaccessible version will remain silent. Try this with NVDA, JAWS, or VoiceOver to experience the difference."
            },
            userGroups: ["screen reader users", "users with visual impairments", "users relying on assistive technologies"],
            keySummary: [
                "Use ARIA live regions for status messages",
                "Announce success, error, and warning messages",
                "Use role=\"status\" or role=\"alert\" appropriately",
                "Don't require focus for status message announcement",
                "Test with screen readers to verify announcements"
            ],
            principle: "Robust"
        }
    }
];

const wcagTechniqueDetails = {
    "ARIA1": {
        title: "Associate help text with inputs using aria-describedby",
        description: "Connect instructions or error text to form controls so assistive technology reads them at the right time."
    },
    "ARIA10": {
        title: "Provide longer descriptions with aria-describedby",
        description: "Link descriptive text to non-text content so the full meaning is announced by screen readers."
    },
    "ARIA11": {
        title: "Use ARIA landmarks and roles to identify regions",
        description: "Mark navigation, main content, and complementary regions so relationships are programmatically determined."
    },
    "ARIA15": {
        title: "Expose and manage keyboard shortcuts with aria-keyshortcuts",
        description: "Document shortcuts and allow users to disable or remap single-character keys."
    },
    "ARIA16": {
        title: "Expose name, role, and value for custom components",
        description: "Use ARIA attributes so assistive technology can announce what a control is and its current state."
    },
    "ARIA18": {
        title: "Announce errors and suggestions with role=alert or aria-live",
        description: "Ensure error feedback is read without requiring users to move focus."
    },
    "ARIA19": {
        title: "Use aria-live for dynamic updates",
        description: "Announce status changes or validation results when content updates without a page reload."
    },
    "ARIA2": {
        title: "Provide ARIA semantics and keyboard support for custom widgets",
        description: "When using custom components, ensure keyboard operability and expose accessible names and roles."
    },
    "ARIA22": {
        title: "Use aria-atomic so full status messages are announced",
        description: "Ensure the complete message is read when any part of the live region changes."
    },
    "ARIA23": {
        title: "Use role=status for non-disruptive updates",
        description: "Announce status messages politely without moving focus away from the user."
    },
    "ARIA24": {
        title: "Provide ARIA semantics for gesture-based widgets",
        description: "Expose controls and instructions so single-pointer alternatives are discoverable."
    },
    "ARIA4": {
        title: "Assign appropriate ARIA roles to custom controls",
        description: "Give widgets roles like button, dialog, or menu so assistive tech recognizes them."
    },
    "ARIA5": {
        title: "Expose state and value with ARIA properties",
        description: "Use aria-expanded, aria-pressed, aria-valuenow, and similar attributes to reflect state."
    },
    "ARIA6": {
        title: "Provide accessible names with aria-label or aria-labelledby",
        description: "Label icon-only controls or non-text content so the purpose is announced."
    },
    "ARIA7": {
        title: "Provide descriptive accessible names for links",
        description: "Use ARIA to make link purpose clear when visible text is not enough."
    },
    "ARIA8": {
        title: "Combine text for link purpose using aria-labelledby",
        description: "Reference multiple elements to create a meaningful link or control name."
    },
    "ARIA9": {
        title: "Label form controls using aria-labelledby",
        description: "Associate visible labels with inputs programmatically when needed."
    },
    "C12": {
        title: "Use relative units for font size",
        description: "Use em, rem, or percentages so text can resize up to 200% without breaking layout."
    },
    "C13": {
        title: "Use relative units for layout sizing",
        description: "Allow containers and spacing to scale with text size rather than staying fixed."
    },
    "C14": {
        title: "Use flexible layouts that reflow",
        description: "Ensure content reflows at high zoom without horizontal scrolling."
    },
    "C15": {
        title: "Use CSS to provide visible focus indicators",
        description: "Style focus outlines so keyboard users can always see where they are."
    },
    "C22": {
        title: "Use CSS to style text instead of images",
        description: "Apply visual effects to real text so it remains selectable and scalable."
    },
    "C27": {
        title: "Avoid CSS reordering that breaks focus order",
        description: "Keep the visual order aligned with DOM order for predictable tabbing."
    },
    "C30": {
        title: "Use CSS effects on real text",
        description: "Keep text as text (not an image) while still achieving visual styling."
    },
    "C6": {
        title: "Position content without changing meaning",
        description: "Use CSS layout while keeping the source order meaningful."
    },
    "C8": {
        title: "Ensure visual order matches source order",
        description: "Do not use CSS to reorder content when sequence affects meaning."
    },
    "FLASH17": {
        title: "Ensure embedded content is keyboard accessible",
        description: "Provide keyboard focus and a clear way to exit embedded media."
    },
    "G1": {
        title: "Provide a mechanism to bypass repeated content",
        description: "Use skip links, landmarks, or other ways to jump past repeated blocks."
    },
    "G107": {
        title: "Avoid changes of context on focus",
        description: "Do not auto-submit or navigate when a component receives focus."
    },
    "G108": {
        title: "Use standard controls or expose name/role/value",
        description: "Prefer native elements, or add ARIA so custom widgets are understandable."
    },
    "G11": {
        title: "Provide controls for auto-updating content",
        description: "Let users pause, stop, or hide moving or updating regions."
    },
    "G111": {
        title: "Provide non-color cues",
        description: "Use text labels, icons, or patterns alongside color."
    },
    "G115": {
        title: "Use semantic structure to convey relationships",
        description: "Use proper markup so relationships can be programmatically determined."
    },
    "G123": {
        title: "Provide a skip link to main content",
        description: "Allow users to jump directly to the primary content area."
    },
    "G124": {
        title: "Provide links to sections within content",
        description: "Offer a table of contents or in-page section links."
    },
    "G125": {
        title: "Provide multiple ways to locate content",
        description: "Use site maps, search, or indexes in addition to navigation menus."
    },
    "G13": {
        title: "Require explicit user action for changes",
        description: "Use submit or confirm actions so changes happen only when users choose."
    },
    "G130": {
        title: "Provide descriptive headings",
        description: "Headings should clearly identify the topic or section."
    },
    "G131": {
        title: "Provide descriptive labels for form fields",
        description: "Labels should clearly describe the expected input."
    },
    "G133": {
        title: "Warn users of time limits",
        description: "Give notice and allow extension before time runs out."
    },
    "G134": {
        title: "Validate and correct HTML for proper parsing",
        description: "Ensure tags are complete, nested correctly, and markup is valid."
    },
    "G14": {
        title: "Do not rely on color alone",
        description: "Provide text or symbols in addition to color cues."
    },
    "G140": {
        title: "Use text instead of images of text",
        description: "Keep text selectable, scalable, and accessible."
    },
    "G142": {
        title: "Use relative font sizing",
        description: "Support text resizing up to 200% without loss of content."
    },
    "G145": {
        title: "Ensure sufficient contrast for text",
        description: "Choose color combinations that meet minimum contrast ratios."
    },
    "G148": {
        title: "Ensure adequate contrast for images of text",
        description: "Make sure images of text meet the same contrast requirements."
    },
    "G149": {
        title: "Provide a visible focus indicator",
        description: "Highlight the focused element clearly for keyboard users."
    },
    "G152": {
        title: "Provide controls to stop moving content",
        description: "Let users pause or stop animations or scrolling elements."
    },
    "G155": {
        title: "Provide a review or confirmation step",
        description: "Allow users to check and correct data before final submission."
    },
    "G158": {
        title: "Provide transcripts for audio-only content",
        description: "Offer a text transcript that covers all meaningful audio information."
    },
    "G159": {
        title: "Provide a text alternative for video-only content",
        description: "Offer a description that conveys the video's information."
    },
    "G161": {
        title: "Provide an index or site map",
        description: "Give users a structured list of pages or sections."
    },
    "G162": {
        title: "Provide clear instructions for input",
        description: "Explain required formats, constraints, or examples."
    },
    "G164": {
        title: "Provide confirmation for legal or financial transactions",
        description: "Let users review, confirm, and correct before finalizing."
    },
    "G165": {
        title: "Provide highly visible focus styles",
        description: "Use strong outlines or highlights to show keyboard focus."
    },
    "G166": {
        title: "Provide alternatives for time-based media",
        description: "Offer transcripts or descriptions for prerecorded media."
    },
    "G17": {
        title: "Provide enhanced contrast for text",
        description: "Use a contrast ratio of at least 7:1 for AAA compliance."
    },
    "G170": {
        title: "Provide a way to turn off background audio",
        description: "Allow users to stop or mute audio that plays automatically."
    },
    "G171": {
        title: "Provide clear play/pause controls for audio",
        description: "Give users direct control over audio playback."
    },
    "G176": {
        title: "Keep flashing below seizure thresholds",
        description: "Avoid patterns that flash more than three times per second."
    },
    "G177": {
        title: "Provide suggestions for error correction",
        description: "Explain how to fix input errors when the solution is known."
    },
    "G18": {
        title: "Provide minimum contrast for text",
        description: "Use a contrast ratio of at least 4.5:1 for normal text."
    },
    "G180": {
        title: "Allow users to extend time limits",
        description: "Provide controls to continue or adjust session timers."
    },
    "G182": {
        title: "Use labels or icons with color cues",
        description: "Make meaning clear even for users who cannot perceive color."
    },
    "G183": {
        title: "Use patterns or text to reinforce color meaning",
        description: "Do not rely on color alone for charts, statuses, or categories."
    },
    "G184": {
        title: "Provide help for form completion",
        description: "Offer inline help, examples, or tooltips near inputs."
    },
    "G186": {
        title: "Provide pause or stop for moving content",
        description: "Allow users to control auto-updating or moving regions."
    },
    "G19": {
        title: "Avoid flashing more than three times per second",
        description: "Use static or gentle alternatives to avoid seizure risk."
    },
    "G193": {
        title: "Provide context-sensitive help",
        description: "Offer guidance near complex inputs or tasks."
    },
    "G197": {
        title: "Use consistent identification for controls",
        description: "Keep labels and icons the same for the same functionality."
    },
    "G198": {
        title: "Warn users before timeouts",
        description: "Give notice and allow additional time when limits apply."
    },
    "G202": {
        title: "Ensure all functionality is keyboard accessible",
        description: "Every action should be operable without a mouse."
    },
    "G21": {
        title: "Ensure focus can move away from components",
        description: "Do not trap keyboard focus inside any single element."
    },
    "G215": {
        title: "Provide single-pointer alternatives for gestures",
        description: "Support tap or click controls in addition to multi-touch gestures."
    },
    "G217": {
        title: "Allow single-character shortcuts to be disabled or remapped",
        description: "Avoid conflicts with assistive technology and user expectations."
    },
    "G4": {
        title: "Provide a mechanism to pause or stop moving content",
        description: "Give users control over blinking, scrolling, or auto-updating content."
    },
    "G57": {
        title: "Provide content in a meaningful sequence",
        description: "Order content logically in the source so reading order is correct."
    },
    "G59": {
        title: "Provide a logical focus order",
        description: "Tabbing should follow the visual and reading order."
    },
    "G60": {
        title: "Provide controls for background audio",
        description: "Allow users to pause or stop audio that plays automatically."
    },
    "G61": {
        title: "Maintain consistent navigation order",
        description: "Keep repeated navigation in the same relative order."
    },
    "G63": {
        title: "Provide a site map or table of contents",
        description: "Offer another way for users to locate pages."
    },
    "G64": {
        title: "Provide a search function",
        description: "Allow users to find content with search."
    },
    "G71": {
        title: "Provide help and guidance for tasks",
        description: "Offer support information where users need it."
    },
    "G80": {
        title: "Require explicit user action before changes",
        description: "Avoid changing context automatically on input."
    },
    "G83": {
        title: "Provide text descriptions for errors",
        description: "Make errors and status messages clear in text."
    },
    "G84": {
        title: "Identify required fields and errors in text",
        description: "Do not rely on color alone to indicate requirements or errors."
    },
    "G85": {
        title: "Provide suggestions for correcting errors",
        description: "Tell users how to fix issues when possible."
    },
    "G87": {
        title: "Provide captions for prerecorded video",
        description: "Include synchronized captions for all important audio."
    },
    "G88": {
        title: "Provide descriptive page titles",
        description: "Use unique titles that describe the page topic."
    },
    "G91": {
        title: "Provide descriptive link text",
        description: "Links should make sense out of context."
    },
    "G93": {
        title: "Provide synchronized captions for video",
        description: "Ensure captions match spoken dialogue and important sounds."
    },
    "G94": {
        title: "Provide short text alternatives for non-text content",
        description: "Add concise alt text so the purpose of images is clear."
    },
    "G95": {
        title: "Provide equivalent short text alternatives",
        description: "Ensure the text alternative conveys the same function or purpose."
    },
    "G98": {
        title: "Provide confirmation for important submissions",
        description: "Allow users to review and confirm before finalizing actions."
    },
    "H25": {
        title: "Provide a descriptive title element",
        description: "Use the HTML title tag to describe the page content."
    },
    "H30": {
        title: "Provide descriptive link text",
        description: "Use link text that clearly states the destination or action."
    },
    "H34": {
        title: "Use a meaningful source order",
        description: "Ensure the HTML order matches the intended reading sequence."
    },
    "H4": {
        title: "Create a logical tab order",
        description: "Let the DOM order define a predictable keyboard navigation order."
    },
    "H42": {
        title: "Use heading elements to identify sections",
        description: "Headings help users understand page structure and navigate quickly."
    },
    "H48": {
        title: "Use list markup for related items",
        description: "Group related content with ul, ol, or dl elements."
    },
    "H57": {
        title: "Set the language of the page with lang",
        description: "Declare the primary language so screen readers pronounce correctly."
    },
    "H58": {
        title: "Identify language changes with lang",
        description: "Mark passages in a different language so pronunciation changes."
    },
    "H69": {
        title: "Provide a skip link to bypass repeated content",
        description: "Let users jump directly to main content."
    },
    "H77": {
        title: "Provide link text that works with surrounding context",
        description: "Combine link text with nearby text to clarify purpose."
    },
    "H88": {
        title: "Use valid, properly nested HTML",
        description: "Ensure start and end tags are complete and correctly nested."
    },
    "H90": {
        title: "Use label elements to label form controls",
        description: "Associate inputs with labels using for and id."
    },
    "H91": {
        title: "Use native HTML controls",
        description: "Native buttons, links, and inputs provide keyboard support by default."
    },
    "H93": {
        title: "Ensure id attributes are unique and valid",
        description: "Unique ids prevent parsing and labeling conflicts."
    },
    "H94": {
        title: "Use elements according to specification",
        description: "Avoid invalid markup that can confuse assistive technologies."
    }
};

// window.wcagTechniqueDetails = wcagTechniqueDetails; // Commented for Node.js compatibility



// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { wcagGuidelines, wcagTechniqueDetails };
}
