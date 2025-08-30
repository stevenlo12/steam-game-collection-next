const db = require('../models');

const analyticsHandler = {
    // Get trending games
    async getTrendingGames(req, res) {
        try {
            const trendingGames = await db.Game.findAll({
                where: { isActive: true },
                include: [
                    { model: db.Price, as: 'prices', limit: 1, order: [['recordedAt', 'DESC']] }
                ],
                order: [['lastUpdated', 'DESC']],
                limit: 10
            });

            res.json(trendingGames);
        } catch (error) {
            console.error('Error fetching trending games:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get price analytics
    async getPriceAnalytics(req, res) {
        try {
            const priceStats = await db.Price.findAll({
                attributes: [
                    'gameId',
                    [db.Sequelize.fn('AVG', db.Sequelize.col('price')), 'avgPrice'],
                    [db.Sequelize.fn('MIN', db.Sequelize.col('price')), 'minPrice'],
                    [db.Sequelize.fn('MAX', db.Sequelize.col('price')), 'maxPrice'],
                    [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'priceCount']
                ],
                where: {
                    recordedAt: {
                        [db.Sequelize.Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                },
                group: ['gameId'],
                include: [
                    { model: db.Game, as: 'game', attributes: ['id', 'title', 'steamId'] }
                ],
                order: [[db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'DESC']],
                limit: 20
            });

            res.json(priceStats);
        } catch (error) {
            console.error('Error fetching price analytics:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = analyticsHandler;
