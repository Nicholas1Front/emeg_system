const { Router } = require('express');
const authRoutes = require('./auth_routes');
const userRoutes = require('./user_routes');
const notesRoutes = require('./notes_routes');

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/notes', notesRoutes);

module.exports = router;