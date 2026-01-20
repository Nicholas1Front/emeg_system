const { Router } = require('express');
const authRoutes = require('./auth_routes');
const userRoutes = require('./user_routes');

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;