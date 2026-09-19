const { dbHelpers } = require('../db/database');

const reviewService = {
  getReviewsForTool(toolId) {
    return dbHelpers.getReviews(toolId);
  },

  getSummary(toolId) {
    return dbHelpers.getReviewSummary(toolId);
  },

  createReview(data) {
    // Validate inputs
    const { productId, author, rating, comment } = data;
    if (!productId || !author || !rating || !comment) {
      throw new Error('Missing required fields (productId, author, rating, comment)');
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return dbHelpers.addReview(data);
  },

  upvote(reviewId) {
    return dbHelpers.upvoteReview(reviewId);
  }
};

module.exports = reviewService;
