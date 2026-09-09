const {
  hasPerfectPrincipleScore,
  buildRecommendations,
  formatSuccessCriterionLinkText,
} = require('./recommendation-logic');

describe('recommendation logic', () => {
  test('detects a perfect principle score', () => {
    const principleScores = {
      Perceivable: { percent: 100 },
      Operable: { percent: 70 },
      Understandable: { percent: 80 },
      Robust: { percent: 60 },
    };

    expect(hasPerfectPrincipleScore(principleScores)).toBe(true);
  });

  test('hides recommendations when any principle is perfectly scored', () => {
    const principleScores = {
      Perceivable: { percent: 100 },
      Operable: { percent: 70 },
      Understandable: { percent: 80 },
      Robust: { percent: 60 },
    };

    const guidelines = [
      {
        guideline_code: '1.1',
        guideline_name: 'Text Alternatives',
        score: 50,
        criterion_id: '1.1.1',
        success_criterion: '1.1.1 Non-text Content',
      },
    ];

    expect(buildRecommendations(guidelines, principleScores)).toEqual([]);
  });

  test('formats a success criteria review label', () => {
    expect(formatSuccessCriterionLinkText('1.1.1', 'Non-text Content')).toBe(
      'Review Success Criterion 1.1.1 — Non-text Content'
    );
  });
});
