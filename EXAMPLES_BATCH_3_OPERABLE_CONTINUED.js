// BATCH 3: Operable Guidelines (Continued) - Examples to Add
// Copy these into wcag-data.js for each corresponding guideline

// ============================================================================
// 2.3.1 - Three Flashes or Below Threshold
// ============================================================================
examples: {
    before: {
        html: `<div class="alert-banner">
  <div class="flashing-alert">
    ⚠️ URGENT SYSTEM ALERT ⚠️
  </div>
  <p>Critical system maintenance in progress</p>
</div>`,
        css: `.alert-banner {
  background: #000;
  color: #fff;
  padding: 20px;
  text-align: center;
}
.flashing-alert {
  font-size: 2rem;
  font-weight: bold;
  animation: flash 0.3s infinite;
}
@keyframes flash {
  0%, 100% { opacity: 1; background: #dc3545; }
  50% { opacity: 0; background: #000; }
}`,
        js: "",
        context: "This alert flashes more than 3 times per second, which can trigger seizures in users with photosensitive epilepsy. The rapid flashing between red and black creates a dangerous strobe effect."
    },
    after: {
        html: `<div class="alert-banner-safe" role="alert" aria-live="assertive">
  <div class="alert-content">
    <i class="bi bi-exclamation-triangle-fill alert-icon"></i>
    <div class="alert-text">
      <strong>URGENT SYSTEM ALERT</strong>
      <p>Critical system maintenance in progress</p>
    </div>
  </div>
</div>`,
        css: `.alert-banner-safe {
  background: #dc3545;
  color: #fff;
  padding: 20px;
  border-left: 5px solid #fff;
  animation: gentle-pulse 3s ease-in-out infinite;
}
@keyframes gentle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
.alert-content {
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 800px;
  margin: 0 auto;
}
.alert-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}
.alert-text strong {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 5px;
}`,
        js: "",
        context: "The alert uses a gentle pulse animation (once every 3 seconds) that stays well below the 3-flashes-per-second threshold. The alert is still visually prominent through color, size, and icon, but safe for all users including those with photosensitive epilepsy."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["users with photosensitive epilepsy", "users sensitive to flashing", "all users"],
    principle: "Operable"
},

// ============================================================================
// 2.4.2 - Page Titled
// ============================================================================
examples: {
    before: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page</title>
</head>
<body>
  <h1>Contact Us</h1>
  <p>Get in touch with our support team...</p>
</body>
</html>`,
        css: `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}`,
        js: "",
        context: "The page title is generic ('Page') and doesn't describe the page content or purpose. Users with multiple tabs open cannot distinguish this page from others. Screen reader users hear an unhelpful title when the page loads."
    },
    after: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us - Customer Support | TechCorp</title>
</head>
<body>
  <h1>Contact Us</h1>
  <p>Get in touch with our support team...</p>
</body>
</html>`,
        css: `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}`,
        js: "",
        context: "The page title is descriptive and follows the pattern: 'Page Topic - Section | Site Name'. This helps users identify the page in browser tabs, bookmarks, and search results. Screen readers announce a meaningful title that describes the page purpose."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["screen reader users", "users with cognitive disabilities", "all users with multiple tabs"],
    principle: "Operable"
},

// ============================================================================
// 2.4.3 - Focus Order
// ============================================================================
examples: {
    before: {
        html: `<div class="form-layout">
  <div style="float: right; width: 200px;">
    <button tabindex="1">Submit</button>
  </div>
  
  <h2>Registration Form</h2>
  
  <input type="text" placeholder="Name" tabindex="3">
  <input type="email" placeholder="Email" tabindex="2">
  <input type="password" placeholder="Password" tabindex="4">
  
  <div style="clear: both;"></div>
</div>`,
        css: `.form-layout {
  max-width: 600px;
  padding: 20px;
}
input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ced4da;
  border-radius: 4px;
}`,
        js: "",
        context: "The focus order is manipulated with tabindex values that don't match the visual layout. Users tab to Submit first, then Email, then Name, then Password - a confusing and illogical sequence that doesn't match what they see."
    },
    after: {
        html: `<form class="form-layout-accessible">
  <h2>Registration Form</h2>
  
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" required>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" required>
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" required>
  </div>
  
  <button type="submit">Submit</button>
</form>`,
        css: `.form-layout-accessible {
  max-width: 600px;
  padding: 20px;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
input {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}
button {
  padding: 10px 30px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}`,
        js: "",
        context: "The focus order follows the natural DOM order and matches the visual layout. No tabindex manipulation is used. Users tab through fields in a logical sequence: Name → Email → Password → Submit button, matching their visual expectations."
    },
    interactive: {
        enabled: true,
        instructions: "Press Tab to navigate through the form. Notice how the focus order matches the visual layout from top to bottom."
    },
    userGroups: ["keyboard users", "screen reader users", "users with motor disabilities"],
    principle: "Operable"
},

// ============================================================================
// 2.4.4 - Link Purpose (In Context)
// ============================================================================
examples: {
    before: {
        html: `<div class="article-list">
  <article>
    <h3>Understanding Web Accessibility</h3>
    <p>Learn about making websites accessible to everyone...</p>
    <a href="/article1">Click here</a>
  </article>
  
  <article>
    <h3>WCAG 2.1 Guidelines</h3>
    <p>Comprehensive guide to WCAG success criteria...</p>
    <a href="/article2">Read more</a>
  </article>
  
  <article>
    <h3>Accessible Forms Tutorial</h3>
    <p>Step-by-step guide to creating accessible forms...</p>
    <a href="/article3">More info</a>
  </article>
</div>`,
        css: `.article-list article {
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
a {
  color: #0d6efd;
  text-decoration: none;
}`,
        js: "",
        context: "Links use generic text like 'Click here', 'Read more', and 'More info'. Screen reader users navigating by links hear these unhelpful phrases without context. The link purpose is not clear from the link text alone."
    },
    after: {
        html: `<div class="article-list">
  <article>
    <h3 id="article1-title">Understanding Web Accessibility</h3>
    <p>Learn about making websites accessible to everyone...</p>
    <a href="/article1" aria-labelledby="article1-title">
      Read: Understanding Web Accessibility
    </a>
  </article>
  
  <article>
    <h3 id="article2-title">WCAG 2.1 Guidelines</h3>
    <p>Comprehensive guide to WCAG success criteria...</p>
    <a href="/article2" aria-labelledby="article2-title">
      Read: WCAG 2.1 Guidelines
    </a>
  </article>
  
  <article>
    <h3 id="article3-title">Accessible Forms Tutorial</h3>
    <p>Step-by-step guide to creating accessible forms...</p>
    <a href="/article3" aria-labelledby="article3-title">
      Read: Accessible Forms Tutorial
    </a>
  </article>
</div>`,
        css: `.article-list article {
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #0d6efd;
  text-decoration: none;
  font-weight: 600;
}
a::after {
  content: "→";
}
a:hover {
  text-decoration: underline;
}`,
        js: "",
        context: "Each link includes the article title in its text, making the purpose clear. The aria-labelledby attribute connects the link to the heading for additional context. Screen reader users can understand where each link goes without needing surrounding context."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["screen reader users", "users with cognitive disabilities", "all users"],
    principle: "Operable"
},

// ============================================================================
// 2.4.5 - Multiple Ways
// ============================================================================
examples: {
    before: {
        html: `<nav class="main-nav">
  <a href="/">Home</a>
  <a href="/products">Products</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<main>
  <h1>Welcome to Our Store</h1>
  <p>Browse our products using the navigation menu above.</p>
</main>`,
        css: `.main-nav {
  background: #f8f9fa;
  padding: 15px;
  display: flex;
  gap: 20px;
}
.main-nav a {
  color: #0d6efd;
  text-decoration: none;
}`,
        js: "",
        context: "The site only provides one way to find content: the main navigation menu. Users cannot search, view a sitemap, or access content through alternative navigation methods. This limits how users can explore and find information."
    },
    after: {
        html: `<header>
  <div class="header-top">
    <div class="logo">TechStore</div>
    <div class="search-bar">
      <input type="search" placeholder="Search products..." aria-label="Search">
      <button aria-label="Search">
        <i class="bi bi-search"></i>
      </button>
    </div>
  </div>
  
  <nav class="main-nav" aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/products">Products</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</header>

<main>
  <h1>Welcome to Our Store</h1>
  <p>Find what you need using:</p>
  <ul>
    <li>Search bar above</li>
    <li>Main navigation menu</li>
    <li><a href="/sitemap">Site map</a></li>
    <li><a href="/categories">Browse by category</a></li>
  </ul>
</main>

<footer>
  <nav aria-label="Footer navigation">
    <h3>Quick Links</h3>
    <a href="/sitemap">Site Map</a>
    <a href="/help">Help Center</a>
    <a href="/faq">FAQ</a>
  </nav>
</footer>`,
        css: `.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #fff;
}
.search-bar {
  display: flex;
  gap: 5px;
}
.search-bar input {
  padding: 8px 15px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  width: 300px;
}
.main-nav {
  background: #f8f9fa;
  padding: 15px;
  display: flex;
  gap: 20px;
}
footer {
  background: #212529;
  color: white;
  padding: 30px;
  margin-top: 40px;
}
footer a {
  color: white;
  display: block;
  margin: 5px 0;
}`,
        js: "",
        context: "The site provides multiple ways to find content: search functionality, main navigation, sitemap, category browsing, and footer links. Users can choose their preferred method of navigation based on their needs and preferences."
    },
    interactive: {
        enabled: true,
        instructions: "Notice the multiple navigation options: search bar, main menu, sitemap link, and category browsing. Each provides a different way to find content."
    },
    userGroups: ["users with cognitive disabilities", "users with different navigation preferences", "all users"],
    principle: "Operable"
},

// ============================================================================
// 2.5.1 - Pointer Gestures
// ============================================================================
examples: {
    before: {
        html: `<div class="image-gallery">
  <img src="photo1.jpg" alt="Mountain landscape" class="gallery-image">
  <p class="instructions">Swipe left or right to view more photos</p>
</div>`,
        css: `.image-gallery {
  max-width: 600px;
  text-align: center;
  padding: 20px;
}
.gallery-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
.instructions {
  color: #6c757d;
  font-style: italic;
  margin-top: 10px;
}`,
        js: `let currentImage = 0;
const images = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];
const imgElement = document.querySelector('.gallery-image');

let touchStartX = 0;
let touchEndX = 0;

imgElement.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

imgElement.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    // Swipe left
    currentImage = (currentImage + 1) % images.length;
    imgElement.src = images[currentImage];
  }
  if (touchEndX > touchStartX + 50) {
    // Swipe right
    currentImage = (currentImage - 1 + images.length) % images.length;
    imgElement.src = images[currentImage];
  }
}`,
        context: "The gallery requires multi-point or path-based gestures (swiping). Users with motor disabilities who cannot perform swipe gestures, or those using assistive technologies, cannot navigate the gallery. There's no alternative single-point interaction."
    },
    after: {
        html: `<div class="image-gallery-accessible">
  <button class="nav-btn prev-btn" aria-label="Previous image">
    <i class="bi bi-chevron-left"></i>
  </button>
  
  <div class="image-container">
    <img src="photo1.jpg" alt="Mountain landscape" class="gallery-image">
    <div class="image-counter" aria-live="polite">
      Image <span id="currentNum">1</span> of <span id="totalNum">3</span>
    </div>
  </div>
  
  <button class="nav-btn next-btn" aria-label="Next image">
    <i class="bi bi-chevron-right"></i>
  </button>
  
  <div class="thumbnail-nav">
    <button class="thumbnail" data-index="0" aria-label="View image 1">
      <img src="photo1-thumb.jpg" alt="">
    </button>
    <button class="thumbnail" data-index="1" aria-label="View image 2">
      <img src="photo2-thumb.jpg" alt="">
    </button>
    <button class="thumbnail" data-index="2" aria-label="View image 3">
      <img src="photo3-thumb.jpg" alt="">
    </button>
  </div>
</div>`,
        css: `.image-gallery-accessible {
  max-width: 600px;
  padding: 20px;
  position: relative;
}
.image-container {
  position: relative;
  text-align: center;
}
.gallery-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  padding: 15px;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  z-index: 10;
}
.prev-btn { left: 10px; }
.next-btn { right: 10px; }
.image-counter {
  margin-top: 10px;
  color: #6c757d;
}
.thumbnail-nav {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}
.thumbnail {
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;
}
.thumbnail.active {
  border-color: #0d6efd;
}
.thumbnail img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}`,
        js: `let currentImage = 0;
const images = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];
const imgElement = document.querySelector('.gallery-image');
const thumbnails = document.querySelectorAll('.thumbnail');

function showImage(index) {
  currentImage = index;
  imgElement.src = images[index];
  document.getElementById('currentNum').textContent = index + 1;
  
  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

document.querySelector('.prev-btn').addEventListener('click', () => {
  showImage((currentImage - 1 + images.length) % images.length);
});

document.querySelector('.next-btn').addEventListener('click', () => {
  showImage((currentImage + 1) % images.length);
});

thumbnails.forEach((thumb, index) => {
  thumb.addEventListener('click', () => showImage(index));
});

// Optional: Still support swipe for those who can use it
let touchStartX = 0;
imgElement.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

imgElement.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) showImage((currentImage + 1) % images.length);
  if (touchEndX > touchStartX + 50) showImage((currentImage - 1 + images.length) % images.length);
});`,
        context: "The gallery provides multiple single-point alternatives: previous/next buttons, thumbnail navigation, and keyboard support. Swipe gestures still work but are not required. All users can navigate using simple clicks or taps."
    },
    interactive: {
        enabled: true,
        instructions: "Click the arrow buttons or thumbnails to navigate. Swipe gestures also work but aren't required."
    },
    userGroups: ["users with motor disabilities", "users with tremors", "users of assistive technologies", "older users"],
    principle: "Operable"
}
