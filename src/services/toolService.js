const { dbHelpers } = require('../db/database');

const toolService = {
  getTools(filters) {
    const tools = dbHelpers.getAllTools(filters);
    // Enrich with review summaries
    return tools.map(tool => {
      const summary = dbHelpers.getReviewSummary(tool.id);
      return {
        ...tool,
        summary
      };
    });
  },

  getTool(id) {
    const tool = dbHelpers.getToolById(id);
    if (!tool) return null;
    const summary = dbHelpers.getReviewSummary(id);
    return {
      ...tool,
      summary
    };
  },

  getCategories() {
    return dbHelpers.getCategories();
  },

  getStats() {
    return dbHelpers.getStats();
  }
};

module.exports = toolService;
