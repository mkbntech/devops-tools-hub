const express = require('express');
const router = express.Router();
const toolService = require('../services/toolService');
const reviewService = require('../services/reviewService');
const recommendationService = require('../services/recommendationService');
const config = require('../config/config');

// Home page
router.get('/', (req, res) => {
  try {
    const category = req.query.category || 'all';
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const sort = req.query.sort || 'default';

    const tools = toolService.getTools({ category, search, status, sort });
    const categories = toolService.getCategories();
    const stats = toolService.getStats();

    res.render('index', {
      title: `${config.siteTitle} — Discover, Learn & Compare`,
      tools,
      categories,
      activeCategory: category,
      activeStatus: status,
      activeSort: sort,
      searchQuery: search,
      stats,
      pageError: null
    });
  } catch (err) {
    console.error('Home page error:', err);
    res.render('index', {
      title: config.siteTitle,
      tools: [],
      categories: [],
      activeCategory: 'all',
      activeStatus: 'all',
      activeSort: 'default',
      searchQuery: '',
      stats: { totalTools: 0, totalReviews: 0, averageRating: 0, totalCategories: 0 },
      pageError: 'Failed to load catalog. Please try again shortly.'
    });
  }
});

// Tool detail page
router.get('/tools/:id', (req, res) => {
  const { id } = req.params;
  try {
    const tool = toolService.getTool(id);
    if (!tool) {
      return res.status(404).render('404', {
        title: 'Tool Not Found — ' + config.siteTitle,
        toolId: id
      });
    }

    const reviews = reviewService.getReviewsForTool(id);
    const summary = reviewService.getSummary(id);
    const recommendations = recommendationService.getRecommendations(id, 4);

    const reviewSubmitted = req.query.reviewed === '1';
    const formError = req.query.error ? decodeURIComponent(req.query.error) : null;

    res.render('tool-detail', {
      title: `${tool.name} — DevOps & Cloud Native Tools Hub`,
      tool,
      reviews,
      summary,
      recommendations,
      reviewSubmitted,
      formError
    });
  } catch (err) {
    console.error(`Error loading tool ${id}:`, err);
    res.status(500).render('404', {
      title: 'Error Loading Tool',
      toolId: id
    });
  }
});

// Submit review from HTML form
router.post('/tools/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { author, role, experience, rating, whatLiked, gotchas, comment } = req.body;

  try {
    if (!author || !rating || !comment) {
      return res.redirect(`/tools/${id}?error=${encodeURIComponent('Please fill in your name, rating, and review comment.')}#reviews-form`);
    }

    reviewService.createReview({
      productId: id,
      author,
      role: role || 'DevOps Practitioner',
      experience: experience || 'Production User',
      rating: parseInt(rating, 10),
      whatLiked: whatLiked || '',
      gotchas: gotchas || '',
      comment
    });

    res.redirect(`/tools/${id}?reviewed=1#reviews`);
  } catch (err) {
    console.error('Review submit error:', err);
    res.redirect(`/tools/${id}?error=${encodeURIComponent(err.message)}#reviews-form`);
  }
});

// Categories page
router.get('/categories', (req, res) => {
  try {
    const categories = toolService.getCategories();
    const allTools = toolService.getTools();
    const stats = toolService.getStats();

    // Group tools by category
    const toolsByCategory = {};
    for (const cat of categories) {
      toolsByCategory[cat.category] = allTools.filter(t => t.category === cat.category);
    }

    res.render('categories', {
      title: 'Categories & Ecosystem Landscape — ' + config.siteTitle,
      categories,
      toolsByCategory,
      stats
    });
  } catch (err) {
    console.error('Categories error:', err);
    res.redirect('/');
  }
});

// Educational About page
router.get('/about', (req, res) => {
  const stats = toolService.getStats();
  res.render('about', {
    title: 'About the DevOps & Cloud Native Tools Hub',
    stats
  });
});

module.exports = router;
