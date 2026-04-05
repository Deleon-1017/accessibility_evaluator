// BATCH 4: Understandable Guidelines - Examples to Add
// Copy these into wcag-data.js for each corresponding guideline

// ============================================================================
// 3.1.2 - Language of Parts
// ============================================================================
examples: {
    before: {
        html: `<article>
  <h2>International Business Expansion</h2>
  <p>Our company is expanding globally. We now operate in:</p>
  <ul>
    <li>France - "Bienvenue à notre entreprise"</li>
    <li>Spain - "Bienvenido a nuestra empresa"</li>
    <li>Germany - "Willkommen in unserem Unternehmen"</li>
  </ul>
  <p>Contact us for more information about our services.</p>
</article>`,
        css: `article {
  max-width: 700px;
  padding: 20px;
  line-height: 1.6;
}`,
        js: "",
        context: "Foreign language phrases are not marked with lang attributes. Screen readers will attempt to pronounce them using English pronunciation rules, making them incomprehensible. Translation tools also cannot identify these sections for translation."
    },
    after: {
        html: `<article lang="en">
  <h2>International Business Expansion</h2>
  <p>Our company is expanding globally. We now operate in:</p>
  <ul>
    <li>France - <span lang="fr">"Bienvenue à notre entreprise"</span> (Welcome to our company)</li>
    <li>Spain - <span lang="es">"Bienvenido a nuestra empresa"</span> (Welcome to our company)</li>
    <li>Germany - <span lang="de">"Willkommen in unserem Unternehmen"</span> (Welcome to our company)</li>
  </ul>
  <p>Contact us for more information about our services.</p>
</article>`,
        css: `article {
  max-width: 700px;
  padding: 20px;
  line-height: 1.6;
}
[lang]:not([lang="en"]) {
  font-style: italic;
}`,
        js: "",
        context: "Each foreign language phrase is marked with the appropriate lang attribute (fr, es, de). Screen readers will use the correct pronunciation for each language. Translation tools can identify and translate these sections accurately."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["screen reader users", "users who rely on translation tools", "multilingual users"],
    principle: "Understandable"
},

// ============================================================================
// 3.2.1 - On Focus
// ============================================================================
examples: {
    before: {
        html: `<form class="newsletter-form">
  <h3>Subscribe to Newsletter</h3>
  <input type="email" 
         id="email" 
         placeholder="Enter your email"
         onfocus="this.form.submit()">
  <button type="submit">Subscribe</button>
</form>`,
        css: `.newsletter-form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ced4da;
  border-radius: 4px;
}`,
        js: "",
        context: "The form submits automatically when the email field receives focus. Users who tab through the form accidentally trigger submission before entering any data. This unexpected behavior is disorienting and prevents users from completing the form properly."
    },
    after: {
        html: `<form class="newsletter-form-accessible">
  <h3>Subscribe to Newsletter</h3>
  
  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="email" 
           id="email" 
           placeholder="Enter your email"
           required
           aria-describedby="emailHelp">
    <small id="emailHelp" class="form-text">
      We'll never share your email with anyone else.
    </small>
  </div>
  
  <button type="submit">Subscribe</button>
</form>`,
        css: `.newsletter-form-accessible {
  max-width: 400px;
  padding: 20px;
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
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}
input:focus {
  border-color: #0d6efd;
  outline: none;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
}
.form-text {
  display: block;
  margin-top: 5px;
  color: #6c757d;
  font-size: 0.875rem;
}
button {
  padding: 10px 20px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}`,
        js: "",
        context: "Focusing on the input field only provides visual feedback (border highlight). No context change occurs. Users can tab through, enter data, and explicitly submit the form by clicking the button. Behavior is predictable and under user control."
    },
    interactive: {
        enabled: true,
        instructions: "Tab to the email field. Notice how focusing doesn't trigger any unexpected actions - you maintain full control."
    },
    userGroups: ["keyboard users", "screen reader users", "users with cognitive disabilities", "all users"],
    principle: "Understandable"
},

// ============================================================================
// 3.2.2 - On Input
// ============================================================================
examples: {
    before: {
        html: `<form class="settings-form">
  <h3>Notification Settings</h3>
  
  <label>
    <input type="checkbox" 
           id="emailNotif"
           onchange="window.location.href='/settings/email'">
    Email Notifications
  </label>
  
  <label>
    <input type="checkbox" 
           id="smsNotif"
           onchange="window.location.href='/settings/sms'">
    SMS Notifications
  </label>
</form>`,
        css: `.settings-form {
  max-width: 400px;
  padding: 20px;
}
label {
  display: block;
  padding: 10px;
  margin: 10px 0;
  cursor: pointer;
}
input[type="checkbox"] {
  margin-right: 10px;
}`,
        js: "",
        context: "Checking a checkbox immediately navigates to a different page without warning. Users lose their place and any unsaved changes. This unexpected behavior is confusing and prevents users from reviewing multiple settings before saving."
    },
    after: {
        html: `<form class="settings-form-accessible">
  <h3>Notification Settings</h3>
  
  <div class="setting-group">
    <label>
      <input type="checkbox" id="emailNotif">
      Email Notifications
    </label>
    <p class="setting-description">
      Receive updates and alerts via email
    </p>
  </div>
  
  <div class="setting-group">
    <label>
      <input type="checkbox" id="smsNotif">
      SMS Notifications
    </label>
    <p class="setting-description">
      Receive urgent alerts via text message
    </p>
  </div>
  
  <div class="form-actions">
    <button type="submit" class="btn-primary">Save Changes</button>
    <button type="button" class="btn-secondary">Cancel</button>
  </div>
  
  <div id="saveStatus" role="status" aria-live="polite" class="save-status"></div>
</form>`,
        css: `.settings-form-accessible {
  max-width: 500px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.setting-group {
  padding: 15px;
  margin: 15px 0;
  background: #f8f9fa;
  border-radius: 6px;
}
label {
  display: flex;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
}
input[type="checkbox"] {
  margin-right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.setting-description {
  margin: 5px 0 0 30px;
  color: #6c757d;
  font-size: 0.9rem;
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.btn-primary {
  background: #0d6efd;
  color: white;
}
.btn-secondary {
  background: #6c757d;
  color: white;
}
.save-status {
  margin-top: 15px;
  padding: 10px;
  border-radius: 6px;
}
.save-status.success {
  background: #d1e7dd;
  color: #0f5132;
}`,
        js: `document.querySelector('.settings-form-accessible').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const statusDiv = document.getElementById('saveStatus');
  statusDiv.textContent = 'Saving settings...';
  statusDiv.className = 'save-status';
  
  // Simulate save
  setTimeout(() => {
    statusDiv.textContent = '✓ Settings saved successfully!';
    statusDiv.className = 'save-status success';
  }, 1000);
});`,
        context: "Changing checkbox values only updates the form state. No context change occurs until the user explicitly clicks 'Save Changes'. Users can review and modify multiple settings before committing changes. Status messages provide clear feedback."
    },
    interactive: {
        enabled: true,
        instructions: "Check or uncheck the boxes. Notice nothing happens until you click 'Save Changes'. You maintain full control over when changes are applied."
    },
    userGroups: ["users with cognitive disabilities", "keyboard users", "screen reader users", "all users"],
    principle: "Understandable"
},

// ============================================================================
// 3.2.4 - Consistent Identification
// ============================================================================
examples: {
    before: {
        html: `<!-- Page 1: Home -->
<nav>
  <button class="search-btn">
    <i class="bi bi-search"></i> Search
  </button>
</nav>

<!-- Page 2: Products -->
<nav>
  <button class="find-btn">
    <i class="bi bi-search"></i> Find Products
  </button>
</nav>

<!-- Page 3: Support -->
<nav>
  <button class="lookup-btn">
    <i class="bi bi-search"></i> Look Up
  </button>
</nav>`,
        css: `button {
  padding: 8px 15px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}`,
        js: "",
        context: "The same search functionality is labeled differently across pages: 'Search', 'Find Products', and 'Look Up'. Users must relearn the interface on each page. Screen reader users hear different labels for the same function, causing confusion."
    },
    after: {
        html: `<!-- Page 1: Home -->
<nav aria-label="Main navigation">
  <button class="search-btn" aria-label="Search site">
    <i class="bi bi-search" aria-hidden="true"></i>
    <span>Search</span>
  </button>
  <button class="cart-btn" aria-label="View shopping cart">
    <i class="bi bi-cart" aria-hidden="true"></i>
    <span>Cart</span>
  </button>
</nav>

<!-- Page 2: Products -->
<nav aria-label="Main navigation">
  <button class="search-btn" aria-label="Search site">
    <i class="bi bi-search" aria-hidden="true"></i>
    <span>Search</span>
  </button>
  <button class="cart-btn" aria-label="View shopping cart">
    <i class="bi bi-cart" aria-hidden="true"></i>
    <span>Cart</span>
  </button>
</nav>

<!-- Page 3: Support -->
<nav aria-label="Main navigation">
  <button class="search-btn" aria-label="Search site">
    <i class="bi bi-search" aria-hidden="true"></i>
    <span>Search</span>
  </button>
  <button class="cart-btn" aria-label="View shopping cart">
    <i class="bi bi-cart" aria-hidden="true"></i>
    <span>Cart</span>
  </button>
</nav>`,
        css: `nav {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
}
button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button i {
  font-size: 1.2rem;
}`,
        js: "",
        context: "The same functionality uses consistent labels across all pages: 'Search' and 'Cart'. Icons, text, and ARIA labels are identical. Users can predict where to find functions and how they're labeled, creating a consistent experience throughout the site."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["users with cognitive disabilities", "screen reader users", "all users"],
    principle: "Understandable"
},

// ============================================================================
// 3.3.1 - Error Identification
// ============================================================================
examples: {
    before: {
        html: `<form class="login-form">
  <h3>Login</h3>
  
  <input type="email" 
         placeholder="Email" 
         style="border-color: red;">
  
  <input type="password" 
         placeholder="Password"
         style="border-color: red;">
  
  <button type="submit">Login</button>
</form>`,
        css: `.login-form {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid #ced4da;
  border-radius: 4px;
}`,
        js: "",
        context: "Errors are indicated only by red borders. There's no text description of what's wrong. Users who are colorblind or using screen readers cannot identify which fields have errors or what needs to be fixed."
    },
    after: {
        html: `<form class="login-form-accessible" novalidate>
  <h3>Login</h3>
  
  <div id="formErrors" role="alert" class="error-summary" style="display: none;">
    <h4>Please fix the following errors:</h4>
    <ul id="errorList"></ul>
  </div>
  
  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="email" 
           id="email"
           aria-required="true"
           aria-invalid="false"
           aria-describedby="emailError">
    <div id="emailError" class="error-message" role="alert"></div>
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" 
           id="password"
           aria-required="true"
           aria-invalid="false"
           aria-describedby="passwordError">
    <div id="passwordError" class="error-message" role="alert"></div>
  </div>
  
  <button type="submit">Login</button>
</form>`,
        css: `.login-form-accessible {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
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
  width: 100%;
  padding: 10px;
  border: 2px solid #ced4da;
  border-radius: 4px;
}
input[aria-invalid="true"] {
  border-color: #dc3545;
  background: #fff5f5;
}
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.error-message::before {
  content: "⚠";
  font-weight: bold;
}
.error-summary {
  background: #fff5f5;
  border: 2px solid #dc3545;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
}
.error-summary h4 {
  color: #dc3545;
  margin: 0 0 10px 0;
  font-size: 1rem;
}
.error-summary ul {
  margin: 0;
  padding-left: 20px;
}`,
        js: `document.querySelector('.login-form-accessible').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const errors = [];
  
  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  document.querySelectorAll('input').forEach(el => el.setAttribute('aria-invalid', 'false'));
  
  // Validate email
  if (!email.value) {
    errors.push({ field: 'email', message: 'Email address is required' });
  } else if (!email.value.includes('@')) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  // Validate password
  if (!password.value) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.value.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  }
  
  if (errors.length > 0) {
    // Show error summary
    const errorList = document.getElementById('errorList');
    errorList.innerHTML = errors.map(e => 
      \`<li><a href="#\${e.field}">\${e.message}</a></li>\`
    ).join('');
    document.getElementById('formErrors').style.display = 'block';
    
    // Show individual field errors
    errors.forEach(error => {
      const field = document.getElementById(error.field);
      const errorDiv = document.getElementById(\`\${error.field}Error\`);
      field.setAttribute('aria-invalid', 'true');
      errorDiv.textContent = error.message;
    });
    
    // Focus first error
    document.getElementById(errors[0].field).focus();
  } else {
    alert('Login successful!');
  }
});`,
        context: "Errors are identified with clear text messages describing what's wrong. An error summary at the top lists all errors. Each field has an associated error message with an icon. ARIA attributes communicate errors to screen readers. Users understand exactly what needs to be fixed."
    },
    interactive: {
        enabled: true,
        instructions: "Try submitting the form without filling it in, or with invalid data. Notice the clear error messages that explain what's wrong."
    },
    userGroups: ["screen reader users", "colorblind users", "users with cognitive disabilities", "all users"],
    principle: "Understandable"
},

// ============================================================================
// 3.3.2 - Labels or Instructions
// ============================================================================
examples: {
    before: {
        html: `<form class="registration-form">
  <h3>Create Account</h3>
  
  <input type="text" placeholder="Username">
  <input type="password" placeholder="Password">
  <input type="password" placeholder="Confirm">
  <input type="tel" placeholder="Phone">
  
  <button type="submit">Register</button>
</form>`,
        css: `.registration-form {
  max-width: 400px;
  padding: 20px;
}
input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ced4da;
  border-radius: 4px;
}`,
        js: "",
        context: "Fields only have placeholder text, which disappears when users start typing. There are no labels or instructions about format requirements. Screen readers may not announce placeholders. Users don't know what format is expected for phone numbers or password requirements."
    },
    after: {
        html: `<form class="registration-form-accessible">
  <h3>Create Account</h3>
  <p class="form-intro">All fields are required unless marked optional.</p>
  
  <div class="form-group">
    <label for="username">
      Username
      <span class="required" aria-label="required">*</span>
    </label>
    <input type="text" 
           id="username"
           required
           aria-required="true"
           aria-describedby="usernameHelp">
    <small id="usernameHelp" class="form-help">
      3-20 characters, letters and numbers only
    </small>
  </div>
  
  <div class="form-group">
    <label for="password">
      Password
      <span class="required" aria-label="required">*</span>
    </label>
    <input type="password" 
           id="password"
           required
           aria-required="true"
           aria-describedby="passwordHelp">
    <small id="passwordHelp" class="form-help">
      Minimum 8 characters, include uppercase, lowercase, number, and special character
    </small>
  </div>
  
  <div class="form-group">
    <label for="confirmPassword">
      Confirm Password
      <span class="required" aria-label="required">*</span>
    </label>
    <input type="password" 
           id="confirmPassword"
           required
           aria-required="true"
           aria-describedby="confirmHelp">
    <small id="confirmHelp" class="form-help">
      Must match the password above
    </small>
  </div>
  
  <div class="form-group">
    <label for="phone">
      Phone Number
      <span class="optional">(optional)</span>
    </label>
    <input type="tel" 
           id="phone"
           aria-describedby="phoneHelp">
    <small id="phoneHelp" class="form-help">
      Format: (555) 123-4567
    </small>
  </div>
  
  <button type="submit">Register</button>
</form>`,
        css: `.registration-form-accessible {
  max-width: 500px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.form-intro {
  background: #e7f3ff;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #212529;
}
.required {
  color: #dc3545;
  font-weight: bold;
}
.optional {
  color: #6c757d;
  font-weight: normal;
  font-size: 0.9rem;
}
input {
  width: 100%;
  padding: 10px;
  border: 2px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}
input:focus {
  border-color: #0d6efd;
  outline: none;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
}
.form-help {
  display: block;
  margin-top: 5px;
  color: #6c757d;
  font-size: 0.875rem;
  line-height: 1.4;
}
button {
  width: 100%;
  padding: 12px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}`,
        js: "",
        context: "Every field has a clear label that remains visible. Detailed instructions explain format requirements and constraints. Required fields are marked with asterisks and ARIA attributes. Help text is associated with fields using aria-describedby. Users know exactly what to enter and in what format."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["screen reader users", "users with cognitive disabilities", "all users"],
    principle: "Understandable"
}

// Continue with remaining Understandable guidelines in next batch...
