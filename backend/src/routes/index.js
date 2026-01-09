const { Router } = require('express');
const authRoutes = require('./auth_routes');

const router = Router();
router.use('/auth', authRoutes);

module.exports = router;