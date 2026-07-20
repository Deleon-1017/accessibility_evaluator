# Quiz-Based Learning Feature — Design Discussion
**Date:** June 2, 2026  
**Project:** Web-Based Accessibility Evaluation Tool  
**Location:** Cavite State University — Dept. of Information Technology

---

## 📌 Topic 1: Where Should the Quiz Be Placed?

### Question
> *"If the developer applies quiz-based content for gaining knowledge about Web Accessibility, where should it be placed? On the WCAG Guidelines page or on a different page?"*

### Decision: Create a Separate `quiz.php` Page ✅

#### Why NOT on `wcag.php` (WCAG Guidelines Page)?

The existing [wcag.php](wcag.php) already serves as a **WCAG Guidelines Reference Module** with:
- A collapsible sidebar navigation
- Guideline detail view (dynamically loaded)
- Modal for guideline details
- A dedicated landing section with conformance level cards

Adding a quiz there would:
- Conflict with the page's **single responsibility** (reference/lookup)
- **Disrupt UX flow** — users browsing guidelines don't expect to be quizzed mid-browse
- **Clutter the layout** — sidebar + modal + detail view already fills the space

#### Reasons for a Dedicated `quiz.php`

| Factor | WCAG Guidelines Page | Dedicated Quiz Page |
|---|---|---|
| **Purpose** | Reference / Browse guidelines | Active learning / Knowledge check |
| **User intent** | "What does criterion 1.1.1 mean?" | "Do I understand what I've learned?" |
| **Page complexity** | Already has sidebar + modal + detail view | Clean, focused quiz experience |
| **Navigation flow** | Users come to look things up | Users come to test themselves |
| **Reusability** | Scope-limited to guidelines | Can cover all POUR principles broadly |

#### Alignment with Functional Requirements

From **Table 1 — Functions of the Proposed System** (Chapter 3 Methodology):

> **Educational Content Module** — *"Delivers tutorials on accessibility guidelines organized by WCAG principle. Provides before-and-after examples demonstrating accessible versus non-accessible design. Includes short lessons explaining individual accessibility rules."*

A quiz fits squarely under this module as a distinct educational activity.

#### How to Connect the Two Pages

- Add a **"Test Your Knowledge"** button at the bottom of the `wcag.php` landing page
- Add **"Quiz"** as a navbar item alongside Home, WCAG Guidelines, About, Contact
- After wrong quiz answers, **link back** to the relevant WCAG guideline on `wcag.php`

---

## 📌 Topic 2: Complete Quiz Question Flow

### Quiz Structure Overview

| Section | Topic | Questions | Points |
|---|---|---|---|
| Section 1 | Introduction to Web Accessibility | 5 | 5 |
| Section 2 | Perceivable | 6 | 6 |
| Section 3 | Operable | 5 | 5 |
| Section 4 | Understandable | 5 | 5 |
| Section 5 | Robust | 4 | 4 |
| **Total** | | **25** | **25** |

**Format:** Multiple choice (4 options each, 1 correct answer)  
**Navigation:** Linear with section intro cards; review available after submission

---

### Quiz Flow Diagram

```
[Welcome Screen]
      ↓
[Section Intro Card] → [Q1] → [Q2] → ... → [Section End Card]
      ↓ (repeat for each of the 5 sections)
[Final Score Screen]
      ↓
[Review Answers] ← optional
      ↓
[Back to WCAG Guidelines / Retake Quiz]
```

---

### SECTION 1 — Introduction to Web Accessibility (5 Questions)

| # | Question | Correct Answer | WCAG Ref | Difficulty |
|---|---|---|---|---|
| Q1 | What does WCAG stand for? | Web Content Accessibility Guidelines | General | Easy |
| Q2 | Who does web accessibility primarily benefit? | People with disabilities (visual, auditory, motor, cognitive) | General | Easy |
| Q3 | What are the four WCAG 2.1 principles? | Perceivable, Operable, Understandable, Robust | POUR | Medium |
| Q4 | Which conformance level is the industry standard? | Level AA | Conformance Levels | Medium |
| Q5 | Who is MOST likely to be completely unable to use an inaccessible site? | Blind users relying on a screen reader | General | Medium |

---

### SECTION 2 — Perceivable (6 Questions)

| # | Question | Correct Answer | WCAG Ref | Difficulty |
|---|---|---|---|---|
| Q6 | An image has no `alt` attribute. What is the problem? | Screen readers cannot describe the image | 1.1.1 — Level A | Easy |
| Q7 | Correct alt text for a decorative image? | `alt=""` (empty alt attribute) | 1.1.1 — Level A | Medium |
| Q8 | A video lecture has no captions. What criterion is violated? | 1.2.2 Captions (Prerecorded) | 1.2.2 — Level A | Medium |
| Q9 | A form uses only red border to indicate errors. Which principle is violated? | Perceivable — color alone conveys information | 1.4.1 — Level A | Medium |
| Q10 | Minimum contrast ratio for body text under Level AA? | 4.5:1 | 1.4.3 — Level AA | Hard |
| Q11 | A page auto-plays background music. What is the fix? | Add a pause/stop button for audio control | 1.4.2 — Level A | Medium |

---

### SECTION 3 — Operable (5 Questions)

| # | Question | Correct Answer | WCAG Ref | Difficulty |
|---|---|---|---|---|
| Q12 | A "Submit" button cannot be reached via Tab key. What is violated? | 2.1.1 Keyboard | 2.1.1 — Level A | Easy |
| Q13 | Keyboard focus gets trapped inside a modal. What criterion is violated? | 2.1.2 No Keyboard Trap | 2.1.2 — Level A | Hard |
| Q14 | A banner auto-rotates every 2 seconds with no pause. What criterion applies? | 2.2.2 Pause, Stop, Hide | 2.2.2 — Level A | Hard |
| Q15 | What is the purpose of a "Skip to main content" link? | Allow keyboard users to skip repetitive navigation | 2.4.1 — Level A | Medium |
| Q16 | Links labeled "Click here" repeated multiple times — what's wrong? | Screen readers cannot distinguish between links | 2.4.4 — Level A | Medium |

---

### SECTION 4 — Understandable (5 Questions)

| # | Question | Correct Answer | WCAG Ref | Difficulty |
|---|---|---|---|---|
| Q17 | A page has no `lang` attribute on `<html>`. Why is this a problem? | Screen readers cannot apply correct language pronunciation | 3.1.1 — Level A | Medium |
| Q18 | A form rejects entries without explaining why. Which criterion applies? | 3.3.1 Error Identification | 3.3.1 — Level A | Medium |
| Q19 | Which example meets WCAG 3.3.2 — Labels or Instructions? | Phone field with format hint "(09XX) XXX-XXXX" | 3.3.2 — Level A | Medium |
| Q20 | A link opens a new browser window unexpectedly. Which principle is violated? | Understandable — behavior was unpredictable | 3.2.2 — Level A | Hard |
| Q21 | Best way to help users who made a form error? | Display a specific error message with how to fix it | 3.3.3 — Level AA | Medium |

---

### SECTION 5 — Robust (4 Questions)

| # | Question | Correct Answer | WCAG Ref | Difficulty |
|---|---|---|---|---|
| Q22 | Which element should be used for a clickable button instead of a `<div>`? | `<button type="button">` | 4.1.2 — Level A | Medium |
| Q23 | A screen reader announces a custom dropdown as "group." What is the likely cause? | ARIA role attribute is missing or incorrect | 4.1.2 — Level A | Hard |
| Q24 | What does the `aria-label` attribute do? | Provides an accessible name announced by screen readers | 4.1.2 — Level A | Medium |
| Q25 | A `data-toggle` modal cannot be triggered by screen readers. What is the best fix? | Add proper `role`, `aria-expanded`, `aria-haspopup`, and ensure keyboard activation | 4.1.2 — Level A | Hard |

---

## 🏆 Scoring Tiers

| Score | Range | Badge | Feedback Message |
|---|---|---|---|
| 🌟 Expert | 23–25 | Accessibility Expert | *"Outstanding! You have a strong command of WCAG 2.1. You're ready to build truly inclusive web experiences."* |
| ✅ Proficient | 18–22 | Accessibility Proficient | *"Great work! You have a solid understanding. Review the questions you missed to fill the gaps."* |
| 📘 Developing | 12–17 | Still Learning | *"Good effort! We recommend exploring the WCAG Guidelines section to deepen your understanding."* |
| 🔰 Beginner | 0–11 | Accessibility Beginner | *"Don't worry — everyone starts somewhere! Review the WCAG Guidelines and try again."* |

---

## 🔄 Post-Quiz Actions

After the score screen, the user should be offered:

1. **📖 Review Answers** — Each question with selected answer, correct answer, and explanation
2. **🔗 Read the Guideline** — Wrong answers link directly to the relevant WCAG page on `wcag.php`
3. **🔁 Retake Quiz** — Restart with randomized question order
4. **🏠 Back to Home** — Return to main homepage

---

## 💡 UX Recommendations

- Show a **progress bar** (e.g., "Question 7 of 25") at the top
- Show a **section divider card** before each POUR section
- **Highlight the selected answer** immediately on click before moving forward
- Show a **quick result indicator** (✅ Correct / ❌ Incorrect) before revealing the explanation
- Show a **difficulty badge** per question (Easy / Medium / Hard)
- Allow users to **skip and return** to questions (optional)
- On mobile, display **one question at a time** as a card slide

---

## 📁 Related Files

| File | Purpose |
|---|---|
| [wcag.php](wcag.php) | WCAG Guidelines reference page (sidebar + modal) |
| [wcag-data.json](wcag-data.json) | Full WCAG 2.1 criteria data (used for quiz references) |
| [wcag-sidebar-app.js](wcag-sidebar-app.js) | Sidebar application logic |
| [style.css](style.css) | Global styles |
| `quiz.php` *(to be created)* | Dedicated quiz page |

---

## 🔮 Next Steps

- [ ] Create `quiz.php` — dedicated quiz page
- [ ] Create `quiz.js` — question logic, scoring, and review system
- [ ] Create `quiz.css` — quiz-specific styles (progress bar, question cards, score screen)
- [ ] Add "Test Your Knowledge" CTA button on `wcag.php` landing section
- [ ] Add "Quiz" link to the main navbar
