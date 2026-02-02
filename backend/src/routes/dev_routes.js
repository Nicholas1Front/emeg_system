const {Router} = require('express');
const devController = require('../modules/dev/dev_controller');

const router = Router();

router.post('/reset-database', devController.resetDatabase);

module.exports = router;