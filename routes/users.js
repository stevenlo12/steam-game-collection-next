var express = require('express');
var router = express.Router();
const userHandler = require('../handlers/userHandler');

/* GET users listing. */
router.get('/', userHandler.getUsers);

module.exports = router;
