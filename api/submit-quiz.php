<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/quiz-data.php';

function normalizeAnswer($raw): string
{
    if (!is_scalar($raw)) {
        return '';
    }
    return strtoupper(trim((string) $raw));
}

function resolveCriterionIdForGuideline(string $guidelineCode): string
{
    $questions = getQuizQuestions();

    foreach ($questions as $question) {
        if ((string) $question['guideline_code'] !== $guidelineCode) {
            continue;
        }

        if (preg_match('/\d+\.\d+\.\d+/', (string) $question['success_criterion'], $matches)) {
            return $matches[0];
        }
    }

    return $guidelineCode . '.1';
}

function guidelineUrl(string $guidelineCode, ?string $criterionId = null): string
{
    $targetCriterion = $criterionId;

    if (empty($targetCriterion)) {
        $targetCriterion = resolveCriterionIdForGuideline($guidelineCode);
    }

    if (preg_match('/^\d+\.\d+\.\d+$/', $targetCriterion)) {
        return 'wcag.php#guideline-' . str_replace('.', '-', $targetCriterion);
    }

    return 'wcag.php';
}

function classifyAwareness(float $percentage): string
{
    if ($percentage >= 75) {
        return 'Aware';
    }
    if ($percentage >= 40) {
        return 'Developing Awareness';
    }
    return 'Unaware';
}

try {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);
    $answers = is_array($payload['answers'] ?? null) ? $payload['answers'] : [];
    $questions = getQuizQuestions();

    if (count($questions) !== 40) {
        throw new RuntimeException('The quiz dataset is incomplete.');
    }

    $questionMap = [];
    foreach ($questions as $index => $question) {
        $questionMap[(string) $question['id']] = $index;
    }

    $correctCount = 0;
    $principleScores = [
        'Perceivable' => ['correct' => 0, 'total' => 10],
        'Operable' => ['correct' => 0, 'total' => 10],
        'Understandable' => ['correct' => 0, 'total' => 10],
        'Robust' => ['correct' => 0, 'total' => 10],
    ];

    $guidelineScores = [];
    $reviewAnswers = [];

    foreach ($questions as $index => $question) {
        $questionId = (string) $question['id'];
        $userAnswer = normalizeAnswer($answers[$questionId] ?? '');
        $correctAnswer = strtoupper((string) $question['correct_answer']);
        $isCorrect = $userAnswer !== '' && $userAnswer === $correctAnswer;

        if ($isCorrect) {
            $correctCount++;
            $principleScores[$question['principle']]['correct']++;
        }

        $criterionId = preg_match('/\d+\.\d+\.\d+/', (string) $question['success_criterion'], $criterionMatches)
            ? $criterionMatches[0]
            : null;

        if (!isset($guidelineScores[$question['guideline_code']])) {
            $guidelineScores[$question['guideline_code']] = [
                'guideline_code' => $question['guideline_code'],
                'guideline_name' => $question['guideline_name'],
                'correct' => 0,
                'total' => 0,
                'incorrect' => 0,
                'score' => 0,
                'criterion_id' => $criterionId,
                'url' => guidelineUrl($question['guideline_code'], $criterionId)
            ];
        }

        if ($criterionId && (!isset($guidelineScores[$question['guideline_code']]['criterion_id']) || $guidelineScores[$question['guideline_code']]['criterion_id'] === null)) {
            $guidelineScores[$question['guideline_code']]['criterion_id'] = $criterionId;
            $guidelineScores[$question['guideline_code']]['url'] = guidelineUrl($question['guideline_code'], $criterionId);
        }

        $guidelineScores[$question['guideline_code']]['total']++;
        if ($isCorrect) {
            $guidelineScores[$question['guideline_code']]['correct']++;
        } else {
            $guidelineScores[$question['guideline_code']]['incorrect']++;
        }

        $reviewAnswers[] = [
            'question_number' => $index + 1,
            'id' => $questionId,
            'principle' => $question['principle'],
            'guideline_code' => $question['guideline_code'],
            'guideline_name' => $question['guideline_name'],
            'success_criterion' => $question['success_criterion'],
            'question' => $question['question'],
            'code_snippet' => $question['code_snippet'] ?? null,
            'user_answer' => $userAnswer !== '' ? $userAnswer : 'Not answered',
            'correct_answer' => $correctAnswer,
            'explanation' => $question['explanation'],
            'is_correct' => $isCorrect,
        ];
    }

    foreach ($guidelineScores as $guideCode => &$guide) {
        $guide['score'] = round(($guide['correct'] / $guide['total']) * 100);
    }
    unset($guide);

    $percentage = ($correctCount / 40) * 100;
    $awareness = classifyAwareness($percentage);

    $principleResults = [];
    foreach (['Perceivable', 'Operable', 'Understandable', 'Robust'] as $principle) {
        $principleData = $principleScores[$principle];
        $principleResults[$principle] = [
            'correct' => $principleData['correct'],
            'total' => $principleData['total'],
            'percent' => round(($principleData['correct'] / $principleData['total']) * 100)
        ];
    }

    $sortedGuidelines = array_values($guidelineScores);
    usort($sortedGuidelines, function ($a, $b) {
        if ($a['score'] === $b['score']) {
            return $b['incorrect'] <=> $a['incorrect'];
        }
        return $a['score'] <=> $b['score'];
    });

    $hasPerfectPrincipleScore = array_reduce($principleResults, static function ($carry, $result) {
        return $carry || ((int) ($result['percent'] ?? 0) === 100);
    }, false);

    $recommendations = [];
    if (!$hasPerfectPrincipleScore) {
        foreach (array_slice($sortedGuidelines, 0, 3) as $guide) {
            $criterionId = $guide['criterion_id'] ?? $guide['guideline_code'];
            $successCriterionLabel = $criterionId && preg_match('/^\d+\.\d+\.\d+$/', (string) $criterionId)
                ? $criterionId . ' ' . $guide['guideline_name']
                : $guide['guideline_name'];

            $recommendations[] = [
                'guideline_code' => $guide['guideline_code'],
                'guideline_name' => $guide['guideline_name'],
                'criterion_id' => $criterionId,
                'success_criterion' => $successCriterionLabel,
                'score' => $guide['score'],
                'incorrect' => $guide['incorrect'],
                'message' => 'You answered several questions related to this success criterion incorrectly.',
                'url' => $guide['url']
            ];
        }
    }

    $weakestPrinciple = null;
    $lowestPercentage = 101;
    foreach ($principleResults as $principle => $result) {
        if ($result['percent'] < $lowestPercentage) {
            $lowestPercentage = $result['percent'];
            $weakestPrinciple = ['principle' => $principle, 'percent' => $result['percent']];
        }
    }

    $response = [
        'success' => true,
        'score' => $correctCount,
        'percentage' => round($percentage, 2),
        'awareness' => $awareness,
        'principle_scores' => $principleResults,
        'guideline_scores' => $sortedGuidelines,
        'recommendations' => $recommendations,
        'weakest_principle' => $weakestPrinciple,
        'review_answers' => $reviewAnswers,
    ];

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
