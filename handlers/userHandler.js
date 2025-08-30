const userHandler = {
    // Get users listing
    async getUsers(req, res) {
        res.json({
            message: 'Users endpoint',
            note: 'This endpoint is available for future user management features',
            endpoints: {
                users: '/users',
                api: '/api'
            }
        });
    }
};

module.exports = userHandler;
