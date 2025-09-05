const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const db = require('../models');

class SteamScraper {
    constructor() {
        this.baseUrl = 'https://store.steampowered.com';
        this.browser = null;
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async scrapeGame(steamId) {
        try {
            const url = `${this.baseUrl}/app/${steamId}`;
            const page = await this.browser.newPage();

            // Set user agent to avoid being blocked
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

            await page.goto(url, { waitUntil: 'networkidle2' });

            // Extract game data
            const gameData = await page.evaluate(() => {
                const title = document.querySelector('.apphub_AppName')?.textContent?.trim();
                const description = document.querySelector('.game_description_snippet')?.textContent?.trim();
                const headerImage = document.querySelector('.game_header_image_full')?.src;
                const developer = document.querySelector('.dev_row')?.textContent?.trim();
                const publisher = document.querySelectorAll('.dev_row')[1]?.textContent?.trim();

                // Price information
                const priceElement = document.querySelector('.game_purchase_price');
                const price = priceElement?.textContent?.trim();
                const originalPriceElement = document.querySelector('.discount_original_price');
                const originalPrice = originalPriceElement?.textContent?.trim();
                const discountElement = document.querySelector('.discount_pct');
                const discountPercent = discountElement?.textContent?.trim();

                return {
                    title,
                    description,
                    headerImage,
                    developer,
                    publisher,
                    price,
                    originalPrice,
                    discountPercent
                };
            });

            await page.close();

            // Process and save game data
            if (gameData.title) {
                await this.saveGame(steamId, gameData);
                console.log(`Successfully scraped game: ${gameData.title}`);
                return gameData;
            } else {
                console.log(`Failed to scrape game with Steam ID: ${steamId}`);
                return null;
            }

        } catch (error) {
            console.error(`Error scraping game ${steamId}:`, error);
            return null;
        }
    }

    async saveGame(steamId, gameData) {
        try {
            // Check if game already exists
            let game = await db.Game.findOne({ where: { steamId } });

            if (game) {
                // Update existing game
                await game.update({
                    title: gameData.title,
                    description: gameData.description,
                    headerImage: gameData.headerImage,
                    developer: gameData.developer,
                    publisher: gameData.publisher,
                    price: this.parsePrice(gameData.price),
                    originalPrice: this.parsePrice(gameData.originalPrice),
                    discountPercent: this.parseDiscount(gameData.discountPercent),
                    lastUpdated: new Date()
                });
            } else {
                // Create new game
                game = await db.Game.create({
                    steamId,
                    title: gameData.title,
                    description: gameData.description,
                    headerImage: gameData.headerImage,
                    developer: gameData.developer,
                    publisher: gameData.publisher,
                    price: this.parsePrice(gameData.price),
                    originalPrice: this.parsePrice(gameData.originalPrice),
                    discountPercent: this.parseDiscount(gameData.discountPercent),
                    isFree: gameData.price === 'Free' || gameData.price === 'Free to Play',
                    lastUpdated: new Date()
                });
            }

            // Save price history
            if (gameData.price && gameData.price !== 'Free' && gameData.price !== 'Free to Play') {
                await db.Price.create({
                    gameId: game.id,
                    price: this.parsePrice(gameData.price),
                    originalPrice: this.parsePrice(gameData.originalPrice),
                    discountPercent: this.parseDiscount(gameData.discountPercent),
                    isOnSale: !!gameData.discountPercent,
                    recordedAt: new Date()
                });
            }

        } catch (error) {
            console.error(`Error saving game ${steamId}:`, error);
        }
    }

    parsePrice(priceString) {
        if (!priceString || priceString === 'Free' || priceString === 'Free to Play') {
            return 0;
        }

        // Extract numeric value from price string (e.g., "$29.99" -> 29.99)
        const match = priceString.match(/[\d,]+\.?\d*/);
        return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    }

    parseDiscount(discountString) {
        if (!discountString) return 0;

        // Extract numeric value from discount string (e.g., "-50%" -> 50)
        const match = discountString.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }

    async scrapeMultipleGames(steamIds, delay = 2000) {
        console.log(`Starting to scrape ${steamIds.length} games...`);

        for (let i = 0; i < steamIds.length; i++) {
            const steamId = steamIds[i];
            console.log(`Scraping game ${i + 1}/${steamIds.length}: ${steamId}`);

            await this.scrapeGame(steamId);

            // Add delay between requests to be respectful
            if (i < steamIds.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        console.log('Finished scraping all games');
    }

    async scrapeFeaturedGames() {
        try {
            const page = await this.browser.newPage();

            // Set user agent to avoid being blocked
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

            await page.goto(`${this.baseUrl}/search/?filter=topsellers`, { waitUntil: 'networkidle2' });

            // Wait a bit for the page to load completely
            await page.waitForTimeout(3000);

            const featuredGames = await page.evaluate(() => {
                // Try multiple selectors for Steam search results
                const selectors = [
                    'a[href*="/app/"]', // Direct app links
                    '.search_result_row', // Search result rows
                    '.tab_item', // Tab items (fallback)
                    '[data-ds-appid]' // Elements with app ID data attribute
                ];

                const games = [];
                const seenIds = new Set();

                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    console.log(`Found ${elements.length} elements with selector: ${selector}`);

                    elements.forEach(element => {
                        let href = '';

                        // Get href from different possible sources
                        if (element.tagName === 'A') {
                            href = element.getAttribute('href');
                        } else {
                            const link = element.querySelector('a');
                            href = link ? link.getAttribute('href') : '';
                        }

                        // Extract Steam ID from href
                        const steamIdMatch = href.match(/\/app\/(\d+)/);
                        if (steamIdMatch) {
                            const steamId = steamIdMatch[1];
                            if (!seenIds.has(steamId)) {
                                games.push(steamId);
                                seenIds.add(steamId);
                            }
                        }

                        // Also try to get from data attribute
                        const appId = element.getAttribute('data-ds-appid');
                        if (appId && !seenIds.has(appId)) {
                            games.push(appId);
                            seenIds.add(appId);
                        }
                    });

                    // If we found games with this selector, break
                    if (games.length > 0) {
                        console.log(`Successfully found ${games.length} games with selector: ${selector}`);
                        break;
                    }
                }

                console.log(`Total unique games found: ${games.length}`);
                return games.slice(0, 50); // Limit to first 50 games
            });

            await page.close();

            console.log(`Found ${featuredGames.length} featured games`);

            if (featuredGames.length === 0) {
                console.log('No games found. This might be due to Steam blocking the request or page structure changes.');
                console.log('Trying alternative approach...');

                // Fallback: try scraping from featured page instead
                return await this.scrapeFromFeaturedPage();
            }

            await this.scrapeMultipleGames(featuredGames);

        } catch (error) {
            console.error('Error scraping featured games:', error);
        }
    }

    async scrapeFromFeaturedPage() {
        try {
            const page = await this.browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            await page.goto(`${this.baseUrl}/featured`, { waitUntil: 'networkidle2' });
            await page.waitForTimeout(3000);

            const featuredGames = await page.evaluate(() => {
                const gameElements = document.querySelectorAll('.tab_item');
                const games = [];

                gameElements.forEach(element => {
                    const link = element.querySelector('a');
                    if (link) {
                        const href = link.getAttribute('href');
                        const steamIdMatch = href.match(/\/app\/(\d+)/);
                        if (steamIdMatch) {
                            games.push(steamIdMatch[1]);
                        }
                    }
                });

                return games.slice(0, 50);
            });

            await page.close();
            console.log(`Found ${featuredGames.length} games from featured page`);
            await this.scrapeMultipleGames(featuredGames);

        } catch (error) {
            console.error('Error scraping from featured page:', error);
        }
    }
}

// Handler functions for API routes
const scrapeHandler = {
    // Initialize scraping
    async startScraping(req, res) {
        const scraper = new SteamScraper();

        try {
            await scraper.init();

            // Scrape top sellers games
            await scraper.scrapeFeaturedGames();

            res.json({
                message: 'Game scraping completed successfully',
                status: 'completed',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error in scraping process:', error);
            res.status(500).json({
                error: 'Scraping failed',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        } finally {
            await scraper.close();
        }
    },

    // Scrape specific games
    async scrapeSpecificGames(req, res) {
        const { steamIds } = req.body;
        const scraper = new SteamScraper();

        if (!steamIds || !Array.isArray(steamIds)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'steamIds must be an array'
            });
        }

        try {
            await scraper.init();
            await scraper.scrapeMultipleGames(steamIds);

            res.json({
                message: `Successfully scraped ${steamIds.length} games`,
                status: 'completed',
                steamIds,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error scraping specific games:', error);
            res.status(500).json({
                error: 'Scraping failed',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        } finally {
            await scraper.close();
        }
    },

    // Get scraping status
    async getScrapingStatus(req, res) {
        try {
            const lastGameUpdate = await db.Game.max('lastUpdated');
            const lastPriceUpdate = await db.Price.max('recordedAt');
            const totalGames = await db.Game.count({ where: { isActive: true } });
            const totalPrices = await db.Price.count();

            res.json({
                lastGameUpdate,
                lastPriceUpdate,
                totalGames,
                totalPrices,
                status: 'active',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error fetching scraping status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = scrapeHandler;
