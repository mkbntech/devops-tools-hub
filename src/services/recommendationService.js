const { dbHelpers } = require('../db/database');

/**
 * Intelligent Companion Tools Recommendation Engine
 * Computes top companion tools based on:
 * - Category synergy
 * - Shared architectural tags
 * - Common production stacks (e.g. K8s + Helm + Argo CD + Prometheus)
 * - Review ratings
 */
function getRecommendations(toolId, limit = 4) {
  const currentTool = dbHelpers.getToolById(toolId);
  if (!currentTool) return [];

  const allTools = dbHelpers.getAllTools();
  const currentTags = new Set(currentTool.tags || []);

  const scoredTools = [];

  for (const tool of allTools) {
    if (tool.id === toolId) continue;

    let score = 0;
    let reason = 'Trending in DevOps';

    // 1. Exact Category match
    if (tool.category === currentTool.category) {
      score += 4.0;
      reason = `Same Domain: ${tool.category}`;
    }

    // 2. Shared tags overlap
    const toolTags = tool.tags || [];
    let sharedTagCount = 0;
    let sampleSharedTag = '';

    for (const tag of toolTags) {
      if (currentTags.has(tag)) {
        sharedTagCount++;
        sampleSharedTag = tag;
        score += 1.5;
      }
    }

    if (sharedTagCount > 0 && score < 4.0) {
      reason = `Shared focus: #${sampleSharedTag}`;
    }

    // 3. Known production synergy pairs
    const synergies = {
      'kubernetes': ['helm', 'argocd', 'cilium', 'k9s', 'keda'],
      'helm': ['kubernetes', 'argocd', 'flux'],
      'argocd': ['kubernetes', 'helm', 'flux', 'opentofu'],
      'flux': ['kubernetes', 'helm', 'argocd'],
      'prometheus': ['grafana', 'opentelemetry', 'loki', 'jaeger'],
      'grafana': ['prometheus', 'loki', 'jaeger', 'opentelemetry'],
      'loki': ['grafana', 'prometheus', 'opentelemetry'],
      'jaeger': ['opentelemetry', 'grafana', 'prometheus'],
      'opentelemetry': ['jaeger', 'prometheus', 'grafana', 'loki'],
      'cilium': ['kubernetes', 'istio', 'envoy'],
      'istio': ['cilium', 'envoy', 'kubernetes'],
      'envoy': ['istio', 'cilium', 'kubernetes'],
      'vault': ['cert-manager', 'opentofu', 'kubernetes'],
      'cert-manager': ['vault', 'kubernetes', 'cilium'],
      'trivy': ['falco', 'docker', 'podman', 'argocd'],
      'falco': ['trivy', 'cilium', 'kubernetes'],
      'crossplane': ['opentofu', 'kubernetes', 'backstage'],
      'backstage': ['crossplane', 'argocd', 'kubernetes'],
      'opentofu': ['crossplane', 'ansible', 'pulumi'],
      'pulumi': ['opentofu', 'ansible', 'crossplane'],
      'ansible': ['opentofu', 'docker', 'podman'],
      'docker': ['podman', 'trivy', 'kubernetes'],
      'podman': ['docker', 'trivy', 'kubernetes'],
      'k9s': ['kubernetes', 'helm', 'keda'],
      'keda': ['kubernetes', 'prometheus', 'k9s'],
      'jenkins': ['argocd', 'docker', 'ansible']
    };

    if (synergies[toolId] && synergies[toolId].includes(tool.id)) {
      score += 5.0;
      reason = `Common stack companion for ${currentTool.name}`;
    }

    // Incorporate community rating
    const summary = dbHelpers.getReviewSummary(tool.id);
    if (summary && summary.averageRating) {
      score += summary.averageRating * 0.2;
    }

    scoredTools.push({
      tool,
      score: Math.round(score * 10) / 10,
      reason,
      summary
    });
  }

  // Sort descending by score
  scoredTools.sort((a, b) => b.score - a.score);

  return scoredTools.slice(0, limit);
}

module.exports = {
  getRecommendations
};
