const { Router } = require('express');
const authController = require('../modules/auth/auth_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = Router();
router.post('/login', authController.login);
router.get('/me', authMiddleware , authController.me);

module.exports = router;