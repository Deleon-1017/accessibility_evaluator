<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WCAG 2.1 Accessibility Awareness Quiz | Web Accessibility Evaluator</title>
    <link rel="icon" type="image/png" href="logo.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
        crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <style>
        :root {
            --quiz-bg: #f5f7fb;
            --quiz-card: #ffffff;
            --quiz-primary: #0d6efd;
            --quiz-primary-soft: #eaf2ff;
            --quiz-success: #198754;
            --quiz-warning: #ffb703;
            --quiz-danger: #dc3545;
            --quiz-border: #dfe7f5;
            --quiz-text: #1b2430;
            --quiz-muted: #5d697a;
            --quiz-perceivable: #0d6efd;
            --quiz-operable: #6f42c1;
            --quiz-understandable: #198754;
            --quiz-robust: #d97706;
        }

        body {
            background: var(--quiz-bg);
            color: var(--quiz-text);
        }

        .skip-to-content {
            position: absolute;
            left: -9999px;
            top: 0;
            z-index: 9999;
            background: #111827;
            color: #fff;
            padding: 0.75rem 1rem;
            border-radius: 0 0 0.5rem 0.5rem;
        }

        .skip-to-content:focus {
            left: 1rem;
        }

        .quiz-shell {
            padding-top: 6rem;
            padding-bottom: 3rem;
        }

        .quiz-shell .container {
            margin-top: 2.5rem;
        }

        .quiz-status {
            margin-bottom: 1.25rem;
        }

        .quiz-page .card {
            border: 1px solid var(--quiz-border);
            border-radius: 1rem;
            box-shadow: 0 0.75rem 1.5rem rgba(15, 23, 42, 0.08);
        }

        .quiz-header-panel {
            color: var(--quiz-text);
            padding: 2rem;
        }

        .quiz-header-panel p,
        .quiz-header-panel h1 {
            margin-bottom: 0;
        }

        .principle-tab {
            border: 1px solid var(--quiz-border);
            background: #fff;
            color: var(--quiz-text);
            padding: 0.7rem 1rem;
            border-radius: 0.75rem;
            min-width: 140px;
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .principle-tab.active {
            box-shadow: inset 0 0 0 2px rgba(13, 110, 253, 0.2);
            border-color: var(--quiz-primary);
            background: var(--quiz-primary-soft);
        }

        .principle-tab[data-principle="Perceivable"].active {
            background: rgba(13, 110, 253, 0.08);
            border-color: var(--quiz-perceivable);
            color: var(--quiz-perceivable);
        }

        .principle-tab[data-principle="Operable"].active {
            background: rgba(111, 66, 193, 0.08);
            border-color: var(--quiz-operable);
            color: var(--quiz-operable);
        }

        .principle-tab[data-principle="Understandable"].active {
            background: rgba(25, 135, 84, 0.08);
            border-color: var(--quiz-understandable);
            color: var(--quiz-understandable);
        }

        .principle-tab[data-principle="Robust"].active {
            background: rgba(217, 119, 6, 0.08);
            border-color: var(--quiz-robust);
            color: var(--quiz-robust);
        }

        .quiz-card {
            background: var(--quiz-card);
        }

        .question-box {
            padding: 1.5rem;
        }

        .question-box h2 {
            font-size: clamp(1.35rem, 1.8vw, 2rem);
            margin-bottom: 1rem;
        }

        .code-snippet {
            background: #0f172a;
            color: #e2e8f0;
            border-radius: 0.75rem;
            padding: 1rem;
            overflow-x: auto;
            margin: 1.25rem 0;
            border: 1px solid rgba(148, 163, 184, 0.3);
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .option-item {
            width: 100%;
            text-align: left;
            border-radius: 0.85rem;
            border: 1px solid var(--quiz-border);
            background: #fff;
            padding: 1rem 1rem;
            margin-bottom: 0.75rem;
            transition: all 0.2s ease;
        }

        .option-item:hover,
        .option-item:focus-visible {
            border-color: var(--quiz-primary);
            box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.12);
        }

        .option-item.selected {
            border-color: var(--quiz-primary);
            background: var(--quiz-primary-soft);
        }

        .option-label {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background: #eef4ff;
            color: var(--quiz-primary);
            font-weight: 700;
            margin-right: 0.75rem;
        }

        .result-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 0.8rem;
            border-radius: 999px;
            font-weight: 700;
            letter-spacing: 0.04rem;
            text-transform: uppercase;
            font-size: 0.75rem;
        }

        .result-badge.correct {
            background: rgba(25, 135, 84, 0.1);
            color: var(--quiz-success);
        }

        .result-badge.incorrect {
            background: rgba(220, 53, 69, 0.1);
            color: var(--quiz-danger);
        }

        .explanation-box {
            background: #f8fafc;
            border-left: 4px solid #0d6efd;
            padding: 1rem 1.15rem;
            border-radius: 0.75rem;
            margin-top: 1.25rem;
        }

        .progress {
            height: 0.85rem;
        }

        .review-row {
            border: 1px solid var(--quiz-border);
            border-radius: 0.85rem;
            background: #fff;
            padding: 1rem 1.1rem;
            margin-bottom: 1rem;
        }

        .quiz-score {
            font-size: clamp(2.2rem, 4vw, 3.5rem);
            font-weight: 800;
            line-height: 1;
            margin: 0.4rem 0 0.75rem;
        }

        .weak-recommendation {
            border: 1px solid var(--quiz-border);
            border-radius: 0.85rem;
            background: #fff;
            padding: 1rem 1.1rem;
        }

        .guideline-link {
            display: inline-block;
            margin-top: 0.75rem;
            font-weight: 600;
        }

        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        .guideline-highlight {
            outline: 3px solid #f8c55a;
            outline-offset: 4px;
            background: rgba(248, 197, 90, 0.09);
            border-radius: 0.5rem;
        }

        .button-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
        }

        .form-check-input:focus,
        .btn:focus-visible,
        .principle-tab:focus-visible,
        .option-item:focus-visible,
        a:focus-visible {
            outline: 3px solid rgba(13, 110, 253, 0.6);
            outline-offset: 3px;
        }

        @media (max-width: 767px) {
            .principle-tab {
                min-width: 0;
                width: 48%;
            }

            .quiz-header-panel {
                padding: 1.4rem;
            }
        }
    </style>
</head>

<body class="contact-page quiz-page">
    <a href="#main-content" class="skip-to-content">Skip to main content</a>

    <header>
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php"><img src="logo.png" alt="Logo" width="60" height="60" class="mx-3 me-3">Web Accessibility Evaluator</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Web Accessibility Evaluator</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li class="nav-item"><a class="nav-link mx-lg-3" href="index.php">Home</a></li>
                            <li class="nav-item"><a class="nav-link mx-lg-3" href="wcag.php">WCAG Guidelines</a></li>
                            <li class="nav-item"><a class="nav-link mx-lg-3 active" aria-current="page" href="assessment.php">Assessment</a></li>
                            <li class="nav-item"><a class="nav-link mx-lg-3" href="about.html">About</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <main class="quiz-shell" id="main-content">
        <div class="container">
            <section id="quizIntro" class="mb-4">
                <div class="quiz-header-panel">
                    <h1 class="mb-3">WCAG 2.1 Accessibility Awareness Quiz</h1>
                    <p class="mb-0">Test your understanding of WCAG 2.1 principles, guidelines, and success criteria through practical accessibility scenarios.</p>
                </div>
                <div class="d-flex justify-content-end mt-3">
                    <button id="startQuizBtn" class="btn btn-primary btn-lg" type="button">Start Quiz</button>
                </div>
            </section>

            <section id="quizPanel" class="card quiz-card d-none" aria-live="polite">
                <div class="card-body p-4 p-md-5">
                    <div id="principleTabs" class="d-flex flex-wrap gap-2 mb-4" role="tablist" aria-label="WCAG principles"></div>

                    <div class="quiz-status">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="fw-semibold" id="questionCounter">Question 1 of 40</span>
                            <span id="questionProgressPct" class="text-muted small">2%</span>
                        </div>
                        <div class="progress" aria-label="Question progress">
                            <div id="overallProgressBar" class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="2" style="width: 2%;"></div>
                        </div>
                    </div>

                    <div id="questionCard" class="question-box" tabindex="-1"></div>
                </div>
            </section>

            <section id="reviewBeforeSubmit" class="card d-none mb-4">
                <div class="card-body p-4 p-md-5">
                    <h2 class="h4 mb-3">Review before submission</h2>
                    <p id="reviewSummary" class="mb-4"></p>
                    <div class="button-row">
                        <button id="returnToQuizBtn" type="button" class="btn btn-outline-primary">Return to Quiz</button>
                        <button id="reviewAnswersBtn" type="button" class="btn btn-outline-secondary">Review Answers</button>
                        <button id="submitQuizBtn" type="button" class="btn btn-primary">Submit Quiz</button>
                    </div>
                </div>
            </section>

            <section id="resultsPanel" class="card d-none quiz-card" aria-live="polite">
                <div class="card-body p-4 p-md-5">
                    <div class="text-center mb-4">
                        <h2 class="h1 mb-2">WCAG 2.1 Quiz Results</h2>
                        <div id="resultScore" class="quiz-score"></div>
                        <div id="resultPercent" class="fs-3 fw-bold mb-3"></div>
                        <div id="awarenessLevel" class="result-badge"></div>
                    </div>

                    <div id="awarenessDescription" class="mb-4 text-center"></div>

                    <div class="mb-4">
                        <h3 class="h4 mb-3">Performance by Principle</h3>
                        <div id="principleResults"></div>
                    </div>

                    <div class="mb-4">
                        <h3 class="h4 mb-3">Recommended Topics to Review</h3>
                        <div id="recommendations"></div>
                    </div>

                    <div class="mb-4">
                        <h3 class="h4 mb-3">Answer Review</h3>
                        <div id="reviewAnswersContainer"></div>
                    </div>

                    <div class="button-row justify-content-center">
                        <button id="retakeQuizBtn" type="button" class="btn btn-primary btn-lg">Retake Quiz</button>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <footer class="bg-white shadow-mt-auto">
        <div class="container py-5">
            <div class="row">
                <div class="col-md-4 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">About</h6>
                    <p class="small text-muted">Web Accessibility Evaluator helps you check your website's compliance with WCAG 2.1 guidelines. Get actionable insights to improve accessibility for all users.</p>
                </div>
                <div class="col-md-3 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">WCAG 2.1 Guidelines</h6>
                    <ul class="list-unstyled small">
                        <li><a href="wcag.php?level=A" class="text-decoration-none text-muted d-block mb-2">Level A</a></li>
                        <li><a href="wcag.php?level=AA" class="text-decoration-none text-muted d-block mb-2">Level AA</a></li>
                        <li><a href="wcag.php?level=AAA" class="text-decoration-none text-muted d-block mb-2">Level AAA</a></li>
                    </ul>
                </div>
                <div class="col-md-3 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">WCAG 2.1 Principles</h6>
                    <ul class="list-unstyled small">
                        <li><a href="wcag.php?principle=Perceivable" class="text-decoration-none text-muted d-block mb-2">Perceivable</a></li>
                        <li><a href="wcag.php?principle=Operable" class="text-decoration-none text-muted d-block mb-2">Operable</a></li>
                        <li><a href="wcag.php?principle=Understandable" class="text-decoration-none text-muted d-block mb-2">Understandable</a></li>
                        <li><a href="wcag.php?principle=Robust" class="text-decoration-none text-muted d-block mb-2">Robust</a></li>
                    </ul>
                </div>
                <div class="col-md-2 mb-4">
                    <h6 class="fw-bold text-uppercase mb-3">Product</h6>
                    <ul class="list-unstyled small">
                        <li><a href="index.php" class="text-decoration-none text-muted d-block mb-2">Scanner</a></li>
                        <li><a href="wcag.php" class="text-decoration-none text-muted d-block mb-2">Guidelines</a></li>
                    </ul>
                </div>
                <hr class="border-secondary-subtle">
                <div class="text-center">
                    <p class="small text-muted">This tool is for educational purposes.</p>
                    <p class="small text-muted mb-1">Copyright &copy; 2026 All Rights Reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <script>
        const wcagGuidelines = {
            '1.1': { name: 'Text Alternatives', url: 'wcag.php#guideline-1-1' },
            '1.2': { name: 'Time-based Media', url: 'wcag.php#guideline-1-2' },
            '1.3': { name: 'Adaptable', url: 'wcag.php#guideline-1-3' },
            '1.4': { name: 'Distinguishable', url: 'wcag.php#guideline-1-4' },
            '2.1': { name: 'Keyboard Accessible', url: 'wcag.php#guideline-2-1' },
            '2.2': { name: 'Enough Time', url: 'wcag.php#guideline-2-2' },
            '2.3': { name: 'Seizures and Physical Reactions', url: 'wcag.php#guideline-2-3' },
            '2.4': { name: 'Navigable', url: 'wcag.php#guideline-2-4' },
            '2.5': { name: 'Input Modalities', url: 'wcag.php#guideline-2-5' },
            '3.1': { name: 'Readable', url: 'wcag.php#guideline-3-1' },
            '3.2': { name: 'Predictable', url: 'wcag.php#guideline-3-2' },
            '3.3': { name: 'Input Assistance', url: 'wcag.php#guideline-3-3' },
            '4.1': { name: 'Compatible', url: 'wcag.php#guideline-4-1' }
        };

        const quizState = {
            questions: [],
            currentIndex: 0,
            answers: {},
            results: null,
            initialized: false
        };

        const ui = {
            intro: document.getElementById('quizIntro'),
            panel: document.getElementById('quizPanel'),
            reviewBeforeSubmit: document.getElementById('reviewBeforeSubmit'),
            results: document.getElementById('resultsPanel'),
            startBtn: document.getElementById('startQuizBtn'),
            principleTabs: document.getElementById('principleTabs'),
            currentPrincipleLabel: document.getElementById('currentPrincipleLabel'),
            questionCounter: document.getElementById('questionCounter'),
            overallProgressBar: document.getElementById('overallProgressBar'),
            principleProgressText: document.getElementById('principleProgressText'),
            principleProgressBar: document.getElementById('principleProgressBar'),
            principleProgressPct: document.getElementById('principleProgressPct'),
            questionProgressPct: document.getElementById('questionProgressPct'),
            questionCard: document.getElementById('questionCard'),
            reviewSummary: document.getElementById('reviewSummary'),
            submitQuizBtn: document.getElementById('submitQuizBtn'),
            returnToQuizBtn: document.getElementById('returnToQuizBtn'),
            reviewAnswersBtn: document.getElementById('reviewAnswersBtn'),
            resultScore: document.getElementById('resultScore'),
            resultPercent: document.getElementById('resultPercent'),
            awarenessLevel: document.getElementById('awarenessLevel'),
            awarenessDescription: document.getElementById('awarenessDescription'),
            principleResults: document.getElementById('principleResults'),
            recommendations: document.getElementById('recommendations'),
            reviewAnswersContainer: document.getElementById('reviewAnswersContainer'),
            retakeQuizBtn: document.getElementById('retakeQuizBtn')
        };

        function buildPrincipleTabs() {
            const principles = ['Perceivable', 'Operable', 'Understandable', 'Robust'];
            ui.principleTabs.innerHTML = '';

            principles.forEach((principle) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'principle-tab';
                button.dataset.principle = principle;
                button.textContent = principle;
                button.setAttribute('role', 'tab');
                button.setAttribute('aria-selected', 'false');
                button.addEventListener('click', () => {
                    const startIndex = getPrincipleStartIndex(principle);
                    if (typeof startIndex === 'number') {
                        quizState.currentIndex = startIndex;
                        renderCurrentQuestion();
                    }
                });
                ui.principleTabs.appendChild(button);
            });
        }

        function getPrincipleStartIndex(principle) {
            let index = 0;
            for (const question of quizState.questions) {
                if (question.principle === principle) {
                    return index;
                }
                index += 1;
            }
            return null;
        }

        function getPrincipleQuestions(principle) {
            return quizState.questions.filter(question => question.principle === principle);
        }

        function currentQuestion() {
            return quizState.questions[quizState.currentIndex] || null;
        }

        function renderCurrentQuestion() {
            const question = currentQuestion();
            if (!question) {
                return;
            }

            const allQuestions = getPrincipleQuestions(question.principle);
            const questionIndexInPrinciple = allQuestions.findIndex(item => item.id === question.id);
            const principleProgress = ((questionIndexInPrinciple + 1) / allQuestions.length) * 100;
            const overallProgress = ((quizState.currentIndex + 1) / quizState.questions.length) * 100;
            const principleName = question.principle;

            ui.questionCounter.textContent = `Question ${quizState.currentIndex + 1} of ${quizState.questions.length}`;
            ui.overallProgressBar.style.width = `${overallProgress}%`;
            ui.overallProgressBar.setAttribute('aria-valuenow', String(Math.round(overallProgress)));
            ui.questionProgressPct.textContent = `${Math.round(overallProgress)}%`;

            Array.from(ui.principleTabs.querySelectorAll('.principle-tab')).forEach((tab) => {
                const isActive = tab.dataset.principle === principleName;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', String(isActive));
            });

            const selectedAnswer = quizState.answers[question.id] || null;
            const questionText = question.question || '';
            const snippet = question.code_snippet ? `<pre class="code-snippet" aria-label="Code example"><code>${escapeHtml(question.code_snippet)}</code></pre>` : '';

            const optionMarkup = ['option_a', 'option_b', 'option_c', 'option_d']
                .map((key) => {
                    const optionText = question[key];
                    const optionKey = key.replace('option_', '').toUpperCase();
                    const value = optionKey;
                    const isSelected = selectedAnswer === value;
                    return `
                        <button type="button" class="option-item ${isSelected ? 'selected' : ''}" data-answer="${value}" aria-pressed="${isSelected}">
                            <span class="option-label">${value}</span>
                            <span>${escapeHtml(optionText)}</span>
                        </button>
                    `;
                })
                .join('');

            ui.questionCard.innerHTML = `
                <h2>${escapeHtml(questionText)}</h2>
                ${snippet}

                <div class="mt-3" role="radiogroup" aria-label="Answer choices for this question">
                    ${optionMarkup}
                </div>

                <div class="button-row mt-4">
                    <button type="button" id="previousQuestionBtn" class="btn btn-outline-secondary" ${quizState.currentIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <button type="button" id="nextQuestionBtn" class="btn btn-primary">${quizState.currentIndex === quizState.questions.length - 1 ? 'Review Answers' : 'Next'}</button>
                </div>
            `;

            const optionButtons = ui.questionCard.querySelectorAll('.option-item');
            optionButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const selected = button.dataset.answer;
                    quizState.answers[question.id] = selected;
                    renderCurrentQuestion();
                });
            });

            const prevButton = document.getElementById('previousQuestionBtn');
            const nextButton = document.getElementById('nextQuestionBtn');
            prevButton?.addEventListener('click', () => {
                if (quizState.currentIndex > 0) {
                    quizState.currentIndex -= 1;
                    renderCurrentQuestion();
                }
            });
            nextButton?.addEventListener('click', () => {
                if (quizState.currentIndex < quizState.questions.length - 1) {
                    quizState.currentIndex += 1;
                    renderCurrentQuestion();
                } else {
                    showReviewBeforeSubmit();
                }
            });

            ui.questionCard.focus();
        }

        function escapeHtml(value) {
            const text = String(value ?? '');
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, (char) => map[char]);
        }

        function showReviewBeforeSubmit() {
            const answeredCount = Object.keys(quizState.answers).length;
            const unanswered = quizState.questions.length - answeredCount;
            ui.reviewSummary.textContent = `You have answered ${answeredCount} of ${quizState.questions.length} questions. ${unanswered} question${unanswered === 1 ? '' : 's'} remain${unanswered === 1 ? 's' : ''} unanswered.`;

            if (unanswered > 0) {
                ui.submitQuizBtn.disabled = true;
                ui.submitQuizBtn.textContent = 'Answer all questions to submit';
            } else {
                ui.submitQuizBtn.disabled = false;
                ui.submitQuizBtn.textContent = 'Submit Quiz';
            }

            ui.panel.classList.add('d-none');
            ui.reviewBeforeSubmit.classList.remove('d-none');
        }

        function startQuiz() {
            ui.intro.classList.add('d-none');
            ui.panel.classList.remove('d-none');
            ui.results.classList.add('d-none');
            ui.reviewBeforeSubmit.classList.add('d-none');
            quizState.currentIndex = 0;
            renderCurrentQuestion();
        }

        function reviewAnswers() {
            ui.reviewBeforeSubmit.classList.add('d-none');
            ui.panel.classList.remove('d-none');
            renderCurrentQuestion();
        }

        function submitQuiz() {
            const answeredCount = Object.keys(quizState.answers).length;
            if (answeredCount !== quizState.questions.length) {
                showReviewBeforeSubmit();
                return;
            }

            const payload = {
                answers: quizState.answers
            };

            ui.submitQuizBtn.disabled = true;
            ui.submitQuizBtn.textContent = 'Submitting…';

            fetch('api/submit-quiz.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(payload)
            })
                .then(async (response) => {
                    const data = await response.json();
                    if (!response.ok || !data.success) {
                        throw new Error(data.message || 'Unable to submit quiz.');
                    }
                    return data;
                })
                .then((data) => {
                    quizState.results = data;
                    renderResults(data);
                })
                .catch((error) => {
                    console.error(error);
                    alert('The quiz could not be submitted. Please try again.');
                    ui.submitQuizBtn.disabled = false;
                    ui.submitQuizBtn.textContent = 'Submit Quiz';
                });
        }

        function renderResults(results) {
            ui.reviewBeforeSubmit.classList.add('d-none');
            ui.panel.classList.add('d-none');
            ui.results.classList.remove('d-none');

            const total = quizState.questions.length;
            const correct = results.score;
            const percentage = Number(results.percentage || 0);
            let awarenessClass = 'Unaware';
            if (percentage >= 75) awarenessClass = 'Aware';
            else if (percentage >= 40) awarenessClass = 'Developing Awareness';

            ui.resultScore.textContent = `${correct} / ${total}`;
            ui.resultPercent.textContent = `${Math.round(percentage)}%`;

            const badgeClass = percentage >= 75 ? 'correct' : percentage >= 40 ? 'correct' : 'incorrect';
            ui.awarenessLevel.className = `result-badge ${badgeClass}`;
            ui.awarenessLevel.textContent = `Accessibility Awareness: ${awarenessClass}`;

            const descriptionMap = {
                Unaware: 'Your results indicate that you currently have limited familiarity with important WCAG 2.1 accessibility concepts. Reviewing the WCAG Principles, Guidelines, and Success Criteria related to the questions you answered incorrectly can help you build a stronger foundation in accessible web development.',
                'Developing Awareness': 'Your results indicate that you have a developing understanding of web accessibility. You demonstrate knowledge of several WCAG concepts, but some areas would benefit from further study and practical application.',
                Aware: 'Your results indicate a good understanding of fundamental WCAG 2.1 accessibility principles and their application to web development. Continue reviewing specific guidelines and success criteria to strengthen your accessibility knowledge further.'
            };
            ui.awarenessDescription.textContent = descriptionMap[awarenessClass] || descriptionMap.Unaware;

            ui.principleResults.innerHTML = '';
            const principleOrder = ['Perceivable', 'Operable', 'Understandable', 'Robust'];
            principleOrder.forEach((principle) => {
                const item = results.principle_scores[principle];
                const width = item.percent;
                const row = document.createElement('div');
                row.className = 'mb-3';
                row.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="fw-semibold">${principle}</span>
                        <span>${item.correct} / 10 (${item.percent}%)</span>
                    </div>
                    <div class="progress" aria-label="${principle} score">
                        <div class="progress-bar" role="progressbar" aria-valuenow="${item.percent}" aria-valuemin="0" aria-valuemax="100" style="width: ${item.percent}%"></div>
                    </div>
                `;
                ui.principleResults.appendChild(row);
            });

            if (results.recommendations && results.recommendations.length > 0) {
                ui.recommendations.innerHTML = results.recommendations.map((recommendation) => `
                    <div class="weak-recommendation mb-3">
                        <h4 class="h5 mb-1">Guideline ${recommendation.guideline_code} — ${escapeHtml(recommendation.guideline_name)}</h4>
                        <p class="mb-1">Score: ${recommendation.score}%</p>
                        <p class="mb-0">${escapeHtml(recommendation.message)}</p>
                        <a class="guideline-link" href="${recommendation.url}">Review Guideline ${recommendation.guideline_code} — ${escapeHtml(recommendation.guideline_name)}</a>
                    </div>
                `).join('');
            } else {
                ui.recommendations.innerHTML = '<div class="weak-recommendation"><strong>Excellent Performance</strong><p class="mb-0">You demonstrated strong awareness across the WCAG 2.1 Principles covered by this quiz. Continue exploring the WCAG Guidelines and Success Criteria to deepen your accessibility knowledge.</p><a class="guideline-link" href="wcag.php">Explore WCAG Guidelines</a></div>';
            }

            ui.reviewAnswersContainer.innerHTML = results.review_answers.map((entry) => {
                const status = entry.is_correct ? 'Correct' : 'Incorrect';
                const statusClass = entry.is_correct ? 'correct' : 'incorrect';
                return `
                    <div class="review-row">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                            <h4 class="h5 mb-0">Question ${entry.question_number}</h4>
                            <span class="result-badge ${statusClass}">${status}</span>
                        </div>
                        <p class="mb-2"><strong>Principle:</strong> ${escapeHtml(entry.principle)}<br>
                        <strong>Guideline:</strong> ${escapeHtml(entry.guideline_code)} — ${escapeHtml(entry.guideline_name)}<br>
                        <strong>Success Criterion:</strong> ${escapeHtml(entry.success_criterion)}</p>
                        <p class="mb-2"><strong>Question:</strong> ${escapeHtml(entry.question)}</p>
                        ${entry.code_snippet ? `<pre class="code-snippet"><code>${escapeHtml(entry.code_snippet)}</code></pre>` : ''}
                        <p class="mb-1"><strong>Your answer:</strong> ${escapeHtml(entry.user_answer || 'Not answered')}</p>
                        <p class="mb-1"><strong>Correct answer:</strong> ${escapeHtml(entry.correct_answer)}</p>
                        <div class="explanation-box"><strong>Explanation:</strong> ${escapeHtml(entry.explanation)}</div>
                    </div>
                `;
            }).join('');
        }

        function resetQuiz() {
            quizState.answers = {};
            quizState.currentIndex = 0;
            quizState.results = null;
            ui.results.classList.add('d-none');
            ui.reviewBeforeSubmit.classList.add('d-none');
            ui.intro.classList.remove('d-none');
            ui.panel.classList.add('d-none');
        }

        function loadQuizData() {
            fetch('api/get-quiz-questions.php')
                .then((response) => response.json())
                .then((data) => {
                    if (!data.success || !Array.isArray(data.questions) || data.questions.length !== 40) {
                        throw new Error('The quiz dataset is incomplete.');
                    }
                    quizState.questions = data.questions;
                    buildPrincipleTabs();
                    renderCurrentQuestion();
                    ui.startBtn.disabled = false;
                    quizState.initialized = true;
                })
                .catch((error) => {
                    console.error(error);
                    ui.questionCard.innerHTML = '<div class="alert alert-danger" role="alert">The quiz could not be loaded. Please refresh the page or check the database configuration.</div>';
                });
        }

        ui.startBtn.addEventListener('click', startQuiz);
        ui.submitQuizBtn.addEventListener('click', submitQuiz);
        ui.returnToQuizBtn.addEventListener('click', reviewAnswers);
        ui.reviewAnswersBtn.addEventListener('click', reviewAnswers);
        ui.retakeQuizBtn.addEventListener('click', resetQuiz);

        loadQuizData();
    </script>
</body>

</html>


