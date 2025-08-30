const db = require('../models');

const gameHandler = {
    // Get all games with pagination
    async getAllGames(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;

            const games = await db.Game.findAndCountAll({
                where: { isActive: true },
                include: [
                    { model: db.Price, as: 'prices', limit: 1, order: [['recordedAt', 'DESC']] }
                ],
                limit,
                offset,
                order: [['lastUpdated', 'DESC']]
            });

            res.json({
                games: games.rows,
                total: games.count,
                page,
                totalPages: Math.ceil(games.count / limit)
            });
        } catch (error) {
            console.error('Error fetching games:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get game by ID
    async getGameById(req, res) {
        try {
            const game = await db.Game.findByPk(req.params.id, {
                include: [
                    { model: db.Price, as: 'prices', order: [['recordedAt', 'DESC']] }
                ]
            });

            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }

            res.json(game);
        } catch (error) {
            console.error('Error fetching game:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Search games
    async searchGames(req, res) {
        try {
            const query = req.params.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;

            const games = await db.Game.findAndCountAll({
                where: {
                    isActive: true,
                    [db.Sequelize.Op.or]: [
                        { title: { [db.Sequelize.Op.like]: `%${query}%` } },
                        { developer: { [db.Sequelize.Op.like]: `%${query}%` } },
                        { publisher: { [db.Sequelize.Op.like]: `%${query}%` } }
                    ]
                },
                include: [
                    { model: db.Price, as: 'prices', limit: 1, order: [['recordedAt', 'DESC']] }
                ],
                limit,
                offset,
                order: [['lastUpdated', 'DESC']]
            });

            res.json({
                games: games.rows,
                total: games.count,
                page,
                totalPages: Math.ceil(games.count / limit)
            });
        } catch (error) {
            console.error('Error searching games:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = gameHandler;
