const express = require('express');
const router = express.Router();
const toolService = require('../services/toolService');
const reviewService = require('../services/reviewService');
const recommendationService = require('../services/recommendationService');
const config = require('../config/config');

const START_TIME = Date.now();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: config.serviceName,
    version: config.version,
    uptimeSeconds: Math.round((Date.now() - START_TIME) / 1000)
  });
});

// Stats
router.get('/stats', (req, res) => {
  try {
    const stats = toolService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories
router.get('/categories', (req, res) => {
  try {
    const categories = toolService.getCategories();
    res.json({ items: categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List tools
router.get('/tools', (req, res) => {
  try {
    const { category, search, status, sort } = req.query;
    const tools = toolService.getTools({ category, search, status, sort });
    res.json({
      total: tools.length,
      items: tools
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tool detail
router.get('/tools/:id', (req, res) => {
  try {
    const tool = toolService.getTool(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: `Tool with id '${req.params.id}' not found` });
    }
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recommendations
router.get('/tools/:id/recommendations', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 4;
    const recommendations = recommendationService.getRecommendations(req.params.id, limit);
    res.json({
      toolId: req.params.id,
      recommendations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reviews for a tool
router.get('/tools/:id/reviews', (req, res) => {
  try {
    const reviews = reviewService.getReviewsForTool(req.params.id);
    const summary = reviewService.getSummary(req.params.id);
    res.json({
      toolId: req.params.id,
      summary,
      items: reviews
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a review
router.post('/tools/:id/reviews', (req, res) => {
  try {
    const { author, role, experience, rating, whatLiked, gotchas, comment } = req.body;
    const review = reviewService.createReview({
      productId: req.params.id,
      author,
      role,
      experience,
      rating,
      whatLiked,
      gotchas,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upvote a review
router.post('/reviews/:id/vote', (req, res) => {
  try {
    const upvotes = reviewService.upvote(req.params.id);
    res.json({ id: req.params.id, upvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
