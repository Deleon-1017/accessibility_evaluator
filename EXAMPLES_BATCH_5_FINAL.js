// BATCH 5: Final Guidelines - Examples to Add
// Copy these into wcag-data.js for each corresponding guideline

// ============================================================================
// 3.3.3 - Error Suggestion
// ============================================================================
examples: {
    before: {
        html: `<form class="booking-form">
  <h3>Book Appointment</h3>
  
  <div class="form-group">
    <label for="date">Appointment Date</label>
    <input type="text" id="date" value="2024-13-45">
    <div class="error">Invalid date</div>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input type="text" id="email" value="john@invalid">
    <div class="error">Invalid email</div>
  </div>
  
  <button type="submit">Book Now</button>
</form>`,
        css: `.booking-form {
  max-width: 400px;
  padding: 20px;
}
.error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
}`,
        js: "",
        context: "Error messages only state that input is invalid without suggesting how to fix it. Users must guess the correct format. This is especially problematic for users with cognitive disabilities who may not understand what's wrong."
    },
    after: {
        html: `<form class="booking-form-accessible">
  <h3>Book Appointment</h3>
  
  <div class="form-group">
    <label for="date">Appointment Date</label>
    <input type="text" 
           id="date" 
           value="2024-13-45"
           aria-invalid="true"
           aria-describedby="dateError dateHelp">
    <small id="dateHelp" class="form-help">
      Format: MM/DD/YYYY (e.g., 12/25/2024)
    </small>
    <div id="dateError" class="error-message" role="alert">
      <i class="bi bi-exclamation-circle"></i>
      The date "2024-13-45" is not valid. Please use the format MM/DD/YYYY. 
      For example: 12/25/2024
    </div>
  </div>
  
  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="text" 
           id="email" 
           value="john@invalid"
           aria-invalid="true"
           aria-describedby="emailError emailHelp">
    <small id="emailHelp" class="form-help">
      Example: name@example.com
    </small>
    <div id="emailError" class="error-message" role="alert">
      <i class="bi bi-exclamation-circle"></i>
      The email "john@invalid" is incomplete. Did you mean "john@invalid.com"? 
      Please include a complete domain (e.g., @gmail.com, @yahoo.com)
    </div>
  </div>
  
  <button type="submit">Book Now</button>
</form>`,
        css: `.booking-form-accessible {
  max-width: 500px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 25px;
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
.form-help {
  display: block;
  margin-top: 5px;
  color: #6c757d;
  font-size: 0.875rem;
}
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
  padding: 10px;
  background: #fff5f5;
  border-left: 3px solid #dc3545;
  border-radius: 4px;
  color: #dc3545;
  font-size: 0.875rem;
  line-height: 1.5;
}
.error-message i {
  flex-shrink: 0;
  margin-top: 2px;
}`,
        js: "",
        context: "Error messages explain what's wrong AND provide specific suggestions for fixing it. Examples of correct format are shown. For the email, a suggestion is offered based on the input. Users understand both the problem and the solution."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["users with cognitive disabilities", "all users", "non-native speakers"],
    principle: "Understandable"
},

// ============================================================================
// 3.3.4 - Error Prevention (Legal, Financial, Data)
// ============================================================================
examples: {
    before: {
        html: `<form class="purchase-form">
  <h3>Complete Purchase</h3>
  
  <div class="order-summary">
    <p>Total: $1,299.99</p>
  </div>
  
  <div class="form-group">
    <label for="cardNumber">Credit Card Number</label>
    <input type="text" id="cardNumber">
  </div>
  
  <button type="submit">Purchase Now</button>
</form>`,
        css: `.purchase-form {
  max-width: 500px;
  padding: 20px;
}
.order-summary {
  background: #f8f9fa;
  padding: 15px;
  margin-bottom: 20px;
}`,
        js: "",
        context: "The purchase form submits immediately without confirmation. Users cannot review their order or verify payment details before committing to the transaction. Mistakes in financial transactions can have serious consequences."
    },
    after: {
        html: `<div class="purchase-flow">
  <!-- Step 1: Order Entry -->
  <form id="purchaseForm" class="purchase-form-accessible" style="display: block;">
    <h3>Complete Purchase</h3>
    
    <div class="order-summary">
      <h4>Order Summary</h4>
      <div class="order-item">
        <span>Premium Laptop</span>
        <span>$1,299.99</span>
      </div>
      <div class="order-total">
        <strong>Total:</strong>
        <strong>$1,299.99</strong>
      </div>
    </div>
    
    <div class="form-group">
      <label for="cardNumber">Credit Card Number</label>
      <input type="text" 
             id="cardNumber" 
             placeholder="1234 5678 9012 3456"
             required>
    </div>
    
    <div class="form-group">
      <label for="cardName">Name on Card</label>
      <input type="text" id="cardName" required>
    </div>
    
    <div class="form-actions">
      <button type="button" class="btn-secondary">Cancel</button>
      <button type="submit" class="btn-primary">Review Order</button>
    </div>
  </form>
  
  <!-- Step 2: Review and Confirm -->
  <div id="reviewStep" class="review-step" style="display: none;">
    <h3>Review Your Order</h3>
    
    <div class="review-section">
      <h4>Order Details</h4>
      <dl>
        <dt>Item:</dt>
        <dd>Premium Laptop</dd>
        <dt>Price:</dt>
        <dd>$1,299.99</dd>
        <dt>Total:</dt>
        <dd><strong>$1,299.99</strong></dd>
      </dl>
    </div>
    
    <div class="review-section">
      <h4>Payment Method</h4>
      <dl>
        <dt>Card Number:</dt>
        <dd id="reviewCard">•••• •••• •••• 3456</dd>
        <dt>Name:</dt>
        <dd id="reviewName">John Doe</dd>
      </dl>
    </div>
    
    <div class="alert alert-warning">
      <i class="bi bi-exclamation-triangle-fill"></i>
      <strong>Important:</strong> Please review all details carefully. 
      This purchase is final and cannot be undone.
    </div>
    
    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" id="confirmPurchase" required>
        I have reviewed my order and confirm all details are correct
      </label>
    </div>
    
    <div class="form-actions">
      <button type="button" id="backBtn" class="btn-secondary">
        <i class="bi bi-arrow-left"></i> Back to Edit
      </button>
      <button type="button" id="confirmBtn" class="btn-primary" disabled>
        <i class="bi bi-check-circle"></i> Confirm Purchase
      </button>
    </div>
  </div>
  
  <!-- Step 3: Success -->
  <div id="successStep" class="success-step" style="display: none;">
    <div class="success-message">
      <i class="bi bi-check-circle-fill"></i>
      <h3>Purchase Successful!</h3>
      <p>Your order has been confirmed. A confirmation email has been sent.</p>
    </div>
  </div>
</div>`,
        css: `.purchase-flow {
  max-width: 600px;
  padding: 20px;
}
.purchase-form-accessible,
.review-step {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
}
.order-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}
.order-summary h4 {
  margin-top: 0;
  font-size: 1.1rem;
}
.order-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #dee2e6;
}
.order-total {
  display: flex;
  justify-content: space-between;
  padding: 15px 0 0 0;
  font-size: 1.2rem;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 2px solid #ced4da;
  border-radius: 4px;
}
.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-primary {
  background: #0d6efd;
  color: white;
}
.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}
.btn-secondary {
  background: #6c757d;
  color: white;
}
.review-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}
.review-section h4 {
  margin-top: 0;
  font-size: 1rem;
}
.review-section dl {
  margin: 0;
}
.review-section dt {
  font-weight: 600;
  margin-top: 10px;
}
.review-section dd {
  margin: 5px 0 0 0;
}
.alert {
  padding: 15px;
  border-radius: 6px;
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.alert-warning {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
}
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}
.checkbox-label input {
  margin-top: 3px;
  width: 20px;
  height: 20px;
}
.success-step {
  text-align: center;
  padding: 40px 20px;
}
.success-message i {
  font-size: 4rem;
  color: #28a745;
}
.success-message h3 {
  color: #28a745;
  margin: 20px 0 10px 0;
}`,
        js: `const purchaseForm = document.getElementById('purchaseForm');
const reviewStep = document.getElementById('reviewStep');
const successStep = document.getElementById('successStep');
const confirmCheckbox = document.getElementById('confirmPurchase');
const confirmBtn = document.getElementById('confirmBtn');

// Step 1 to Step 2: Review
purchaseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Populate review data
  const cardNumber = document.getElementById('cardNumber').value;
  const cardName = document.getElementById('cardName').value;
  
  document.getElementById('reviewCard').textContent = 
    '•••• •••• •••• ' + cardNumber.slice(-4);
  document.getElementById('reviewName').textContent = cardName;
  
  // Show review step
  purchaseForm.style.display = 'none';
  reviewStep.style.display = 'block';
  reviewStep.scrollIntoView({ behavior: 'smooth' });
});

// Enable confirm button when checkbox is checked
confirmCheckbox.addEventListener('change', () => {
  confirmBtn.disabled = !confirmCheckbox.checked;
});

// Back to edit
document.getElementById('backBtn').addEventListener('click', () => {
  reviewStep.style.display = 'none';
  purchaseForm.style.display = 'block';
  purchaseForm.scrollIntoView({ behavior: 'smooth' });
});

// Confirm purchase
confirmBtn.addEventListener('click', () => {
  reviewStep.style.display = 'none';
  successStep.style.display = 'block';
  successStep.scrollIntoView({ behavior: 'smooth' });
});`,
        context: "The purchase process has three steps: 1) Enter payment details, 2) Review all information with a confirmation checkbox, 3) Success confirmation. Users can go back to edit at any time. A warning alerts users that the purchase is final. The confirm button is disabled until the user checks the confirmation box, ensuring they've reviewed the order."
    },
    interactive: {
        enabled: true,
        instructions: "Fill in the form, click 'Review Order', check the confirmation box, then confirm. Notice how you can review and go back to edit before finalizing."
    },
    userGroups: ["all users", "users with cognitive disabilities", "users making financial transactions"],
    principle: "Understandable"
},

// ============================================================================
// 3.3.5 - Help
// ============================================================================
examples: {
    before: {
        html: `<form class="tax-form">
  <h3>Tax Information</h3>
  
  <div class="form-group">
    <label for="ssn">Social Security Number</label>
    <input type="text" id="ssn">
  </div>
  
  <div class="form-group">
    <label for="ein">Employer Identification Number</label>
    <input type="text" id="ein">
  </div>
  
  <button type="submit">Submit</button>
</form>`,
        css: `.tax-form {
  max-width: 500px;
  padding: 20px;
}`,
        js: "",
        context: "Complex form fields have no help or explanation. Users may not understand what an EIN is or where to find it. No context-sensitive help is available for these technical terms."
    },
    after: {
        html: `<form class="tax-form-accessible">
  <div class="form-header">
    <h3>Tax Information</h3>
    <a href="/help/tax-forms" class="help-link" target="_blank">
      <i class="bi bi-question-circle"></i> Tax Form Help Guide
    </a>
  </div>
  
  <div class="form-group">
    <label for="ssn">
      Social Security Number
      <button type="button" 
              class="help-btn" 
              aria-label="Help for Social Security Number"
              data-help="ssn">
        <i class="bi bi-info-circle"></i>
      </button>
    </label>
    <input type="text" 
           id="ssn"
           placeholder="XXX-XX-XXXX"
           aria-describedby="ssnHelp">
    <div id="ssnHelp" class="help-text">
      <strong>What is this?</strong> Your 9-digit Social Security Number issued by the Social Security Administration.
      <br><strong>Where to find it:</strong> On your Social Security card or previous tax returns.
      <br><strong>Format:</strong> XXX-XX-XXXX
    </div>
  </div>
  
  <div class="form-group">
    <label for="ein">
      Employer Identification Number (EIN)
      <button type="button" 
              class="help-btn" 
              aria-label="Help for Employer Identification Number"
              data-help="ein">
        <i class="bi bi-info-circle"></i>
      </button>
    </label>
    <input type="text" 
           id="ein"
           placeholder="XX-XXXXXXX"
           aria-describedby="einHelp">
    <div id="einHelp" class="help-text">
      <strong>What is this?</strong> A 9-digit number assigned by the IRS to business entities.
      <br><strong>Where to find it:</strong> On your IRS confirmation letter (CP 575) or previous business tax returns.
      <br><strong>Format:</strong> XX-XXXXXXX
      <br><strong>Don't have one?</strong> <a href="/apply-ein" target="_blank">Apply for an EIN</a>
    </div>
  </div>
  
  <div class="help-panel">
    <h4><i class="bi bi-lightbulb"></i> Need More Help?</h4>
    <ul>
      <li><a href="/help/faq">Frequently Asked Questions</a></li>
      <li><a href="/help/contact">Contact Support</a></li>
      <li><a href="/help/video-tutorials">Video Tutorials</a></li>
    </ul>
  </div>
  
  <button type="submit">Submit</button>
</form>`,
        css: `.tax-form-accessible {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #dee2e6;
}
.form-header h3 {
  margin: 0;
}
.help-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}
.form-group {
  margin-bottom: 25px;
}
label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
}
.help-btn {
  background: none;
  border: none;
  color: #0d6efd;
  cursor: pointer;
  padding: 0;
  font-size: 1.1rem;
}
.help-btn:hover {
  color: #0a58ca;
}
input {
  width: 100%;
  padding: 10px;
  border: 2px solid #ced4da;
  border-radius: 4px;
}
.help-text {
  background: #e7f3ff;
  border-left: 3px solid #0d6efd;
  padding: 12px;
  margin-top: 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  line-height: 1.6;
}
.help-text strong {
  color: #0a58ca;
}
.help-text a {
  color: #0d6efd;
  font-weight: 600;
}
.help-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin: 20px 0;
}
.help-panel h4 {
  margin-top: 0;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
}
.help-panel ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}
.help-panel li {
  margin: 8px 0;
}
.help-panel a {
  color: #0d6efd;
  text-decoration: none;
}
.help-panel a:hover {
  text-decoration: underline;
}`,
        js: "",
        context: "Context-sensitive help is available for each complex field. Help text explains what the field is, where to find the information, and the expected format. A help panel provides links to additional resources. Users can access help without leaving the form."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["users with cognitive disabilities", "users unfamiliar with technical terms", "all users"],
    principle: "Understandable"
},

// ============================================================================
// 4.1.1 - Parsing
// ============================================================================
examples: {
    before: {
        html: `<div class="content">
  <h2>Welcome</h2>
  <p>This is a paragraph with <strong>bold text</p></strong>
  <ul>
    <li>Item 1
    <li>Item 2</li>
    <li>Item 3
  </ul>
  <div id="main">
    <div id="main">Duplicate ID</div>
  </div>
</div>`,
        css: `.content {
  padding: 20px;
}`,
        js: "",
        context: "The HTML has multiple parsing errors: mismatched tags (strong), missing closing tags (li), and duplicate IDs. These errors can cause assistive technologies to misinterpret the content structure, leading to unpredictable behavior and accessibility issues."
    },
    after: {
        html: `<div class="content">
  <h2>Welcome</h2>
  <p>This is a paragraph with <strong>bold text</strong></p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
  <div id="main-container">
    <div id="main-content">Unique IDs</div>
  </div>
</div>`,
        css: `.content {
  padding: 20px;
}`,
        js: "",
        context: "The HTML is well-formed with properly nested and closed tags. All IDs are unique. The markup follows HTML specifications, ensuring assistive technologies can parse and interpret the content correctly. This provides a reliable foundation for accessibility."
    },
    interactive: {
        enabled: false
    },
    userGroups: ["screen reader users", "users of assistive technologies", "all users"],
    principle: "Robust"
}

// ============================================================================
// ALL EXAMPLES COMPLETE!
// ============================================================================
// You now have examples for all 28 remaining guidelines.
// Total: 39 guidelines with complete before/after code examples.
