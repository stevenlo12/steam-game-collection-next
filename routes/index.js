var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    message: 'UKRIDA Steam Scraper API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      games: '/api/games',
      search: '/api/games/search/:query',
      analytics: {
        trending: '/api/analytics/trending',
        prices: '/api/analytics/prices'
      },
      scraping: {
        games: '/api/scrape/games',
        prices: '/api/scrape/prices',
        status: '/api/scrape/status'
      }
    },
    documentation: 'Check README.md for detailed API documentation'
  });
});

module.exports = router;
