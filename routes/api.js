const express = require('express');
const router = express.Router();
// const scrapeHandler = require('../handlers/scrapeHandler');
const gameHandler = require('../handlers/gameHandler');
const analyticsHandler = require('../handlers/analyticsHandler');
const systemHandler = require('../handlers/systemHandler');

// Health check endpoint
router.get('/health', systemHandler.healthCheck);

// Game routes
router.get('/games', gameHandler.getAllGames);
router.get('/games/:id', gameHandler.getGameById);
router.get('/games/search/:query', gameHandler.searchGames);

// Analytics routes
router.get('/analytics/trending', analyticsHandler.getTrendingGames);
router.get('/analytics/prices', analyticsHandler.getPriceAnalytics);

// // Trigger game scraping
// router.post('/scrape/games', scrapeHandler.startScraping);

// // Scrape specific games
// router.post('/scrape/games/specific', scrapeHandler.scrapeSpecificGames);

// // Get scraping status
// router.get('/scrape/status', scrapeHandler.getScrapingStatus);

module.exports = router;
