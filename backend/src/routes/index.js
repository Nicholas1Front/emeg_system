const { Router } = require('express');
const authRoutes = require('./auth_routes');
const userRoutes = require('./user_routes');
const notesRoutes = require('./notes_routes');
const devRoutes = require('./dev_routes');
const attachmentsRoutes = require('./attachments_routes');
const clientsRoutes = require('./clients_routes');

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/notes', notesRoutes);
router.use('/dev', devRoutes);
router.use('/attachments', attachmentsRoutes);
router.use('/clients', clientsRoutes);

module.exports = router;