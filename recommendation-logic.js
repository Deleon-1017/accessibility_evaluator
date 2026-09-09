function hasPerfectPrincipleScore(principleScores = {}) {
  return Object.values(principleScores).some((score) => Number(score?.percent ?? 0) === 100);
}

function buildRecommendations(guidelines = [], principleScores = {}) {
  if (hasPerfectPrincipleScore(principleScores)) {
    return [];
  }

  return (guidelines || [])
    .filter((guideline) => Number(guideline?.score ?? 0) < 100)
    .slice(0, 3)
    .map((guideline) => ({
      ...guideline,
      success_criterion: guideline.success_criterion || `${guideline.criterion_id || guideline.guideline_code}`,
    }));
}

function formatSuccessCriterionLinkText(criterionId, criterionName) {
  const id = criterionId || 'Unknown';
  const name = criterionName ? ` — ${criterionName}` : '';
  return `Review Success Criterion ${id}${name}`;
}

if (typeof module !== 'undefined') {
  module.exports = {
    hasPerfectPrincipleScore,
    buildRecommendations,
    formatSuccessCriterionLinkText,
  };
}
