<?php
session_start();
header('Cache-Control: no-store, private');

function escapeReviewValue($value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$token = $_GET['token'] ?? '';
$token = is_string($token) && preg_match('/^[a-f0-9]{64}$/', $token) ? $token : '';
$now = time();
$storedReviews = $_SESSION['quiz_review_tokens'] ?? [];
if (!is_array($storedReviews)) {
    $storedReviews = [];
}

foreach ($storedReviews as $storedToken => $storedReview) {
    if (!is_array($storedReview) || ($now - (int) ($storedReview['created_at'] ?? 0)) > 1800) {
        unset($storedReviews[$storedToken]);
    }
}

$_SESSION['quiz_review_tokens'] = $storedReviews;
$reviewData = $token !== '' ? ($storedReviews[$token] ?? null) : null;
session_write_close();

$reviewAnswers = is_array($reviewData['review_answers'] ?? null) ? $reviewData['review_answers'] : [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Quiz Answer Review | Web Accessibility Evaluator</title>
    <link rel="icon" type="image/png" href="logo.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="style.css">
    <style>
        :root {
            --review-bg: #f5f7fb;
            --review-border: #dfe7f5;
            --review-text: #1b2430;
            --review-muted: #5d697a;
            --review-green: #198754;
            --review-red: #dc3545;
        }

        body { background: var(--review-bg); color: var(--review-text); }
        .review-shell { padding: 7rem 0 3rem; }
        .review-header { margin-bottom: 1.5rem; }
        .review-item {
            background: #fff;
            border: 1px solid var(--review-border);
            border-left: 5px solid var(--review-muted);
            border-radius: 0.75rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
        }
        .review-item.is-correct { border-left-color: var(--review-green); }
        .review-item.is-incorrect { border-left-color: var(--review-red); }
        .review-status {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.35rem 0.7rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 750;
            text-transform: uppercase;
        }
        .review-status.is-correct { color: var(--review-green); background: #eaf6ef; }
        .review-status.is-incorrect { color: var(--review-red); background: #fff0f1; }
        .review-answer { padding: 0.8rem 1rem; border-radius: 0.55rem; margin: 0.5rem 0; }
        .review-answer.user-answer { background: #f3f6fa; }
        .review-answer.correct-answer { background: #eaf6ef; }
        .review-code {
            overflow-x: auto;
            padding: 1rem;
            color: #e2e8f0;
            background: #0f172a;
            border-radius: 0.6rem;
        }
        .review-explanation {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8fafc;
            border-left: 4px solid #0d6efd;
            border-radius: 0.5rem;
        }
        @media (max-width: 575px) {
            .review-shell { padding-top: 6rem; }
            .review-item { padding: 1rem; }
        }
    </style>
</head>
<body class="contact-page">
    <header>
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="assessment.php">
                    <img src="logo.png" alt="" width="48" height="48" class="mx-3 me-2">
                    Web Accessibility Evaluator
                </a>
            </div>
        </nav>
    </header>

    <main class="review-shell">
        <div class="container">
            <?php if ($reviewData === null || $reviewAnswers === []): ?>
                <section class="bg-white border rounded-3 p-4 p-md-5" aria-labelledby="reviewUnavailableTitle">
                    <h1 id="reviewUnavailableTitle" class="h3">Answer review unavailable</h1>
                    <p class="text-muted">This review link is invalid or has expired. Submit the assessment again to create a new review.</p>
                    <a class="btn btn-primary" href="assessment.php">Return to Assessment</a>
                </section>
            <?php else: ?>
                <div class="review-header d-flex flex-wrap justify-content-between align-items-end gap-3">
                    <div>
                        <p class="text-uppercase small fw-bold text-primary mb-2">Assessment</p>
                        <h1 class="h2 mb-1">Answer Review</h1>
                        <p class="text-muted mb-0">Correct answers, explanations, and WCAG references.</p>
                    </div>
                    <a class="btn btn-outline-primary" href="assessment.php">
                        <i class="bi bi-arrow-left me-2" aria-hidden="true"></i>Return to Assessment
                    </a>
                </div>

                <section aria-label="Quiz answers">
                    <?php foreach ($reviewAnswers as $entry): ?>
                        <?php
                        $isCorrect = !empty($entry['is_correct']);
                        $statusClass = $isCorrect ? 'is-correct' : 'is-incorrect';
                        $options = is_array($entry['options'] ?? null) ? $entry['options'] : [];
                        $userAnswer = (string) ($entry['user_answer'] ?? 'Not answered');
                        $correctAnswer = strtoupper((string) ($entry['correct_answer'] ?? ''));
                        $userAnswerText = isset($options[$userAnswer]) ? $userAnswer . ' - ' . $options[$userAnswer] : $userAnswer;
                        $correctAnswerText = isset($options[$correctAnswer]) ? $correctAnswer . ' - ' . $options[$correctAnswer] : $correctAnswer;
                        ?>
                        <article class="review-item <?= $statusClass ?>">
                            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                <h2 class="h5 mb-0">Question <?= escapeReviewValue($entry['question_number'] ?? '') ?></h2>
                                <span class="review-status <?= $statusClass ?>">
                                    <i class="bi <?= $isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill' ?>" aria-hidden="true"></i>
                                    <?= $isCorrect ? 'Correct' : 'Incorrect' ?>
                                </span>
                            </div>
                            <p class="small text-muted mb-3">
                                <strong>Principle:</strong> <?= escapeReviewValue($entry['principle'] ?? '') ?>
                                <span aria-hidden="true"> | </span>
                                <strong>Guideline:</strong> <?= escapeReviewValue($entry['guideline_code'] ?? '') ?> - <?= escapeReviewValue($entry['guideline_name'] ?? '') ?>
                                <span aria-hidden="true"> | </span>
                                <strong>Success criterion:</strong> <?= escapeReviewValue($entry['success_criterion'] ?? '') ?>
                            </p>
                            <p><strong>Question:</strong> <?= nl2br(escapeReviewValue($entry['question'] ?? '')) ?></p>
                            <?php if (!empty($entry['code_snippet'])): ?>
                                <pre class="review-code"><code><?= escapeReviewValue($entry['code_snippet']) ?></code></pre>
                            <?php endif; ?>
                            <p class="review-answer user-answer mb-2"><strong>Your answer:</strong> <?= escapeReviewValue($userAnswerText) ?></p>
                            <p class="review-answer correct-answer mb-0"><strong>Correct answer:</strong> <?= escapeReviewValue($correctAnswerText) ?></p>
                            <div class="review-explanation"><strong>Explanation:</strong> <?= nl2br(escapeReviewValue($entry['explanation'] ?? '')) ?></div>
                        </article>
                    <?php endforeach; ?>
                </section>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>