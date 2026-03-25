const { Router } = require('express');
const authRoutes = require('./auth_routes');
const userRoutes = require('./user_routes');
const notesRoutes = require('./notes_routes');
const devRoutes = require('./dev_routes');
const attachmentsRoutes = require('./attachments_routes');
const clientsRoutes = require('./clients_routes');
const equipamentsRoutes = require('./equipaments_routes');
const itemsRoutes = require('./items_routes');
const budgetsRoutes = require('./budgets_routes');
const workOrdersRoutes = require('./work_orders_routes');

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/notes', notesRoutes);
router.use('/dev', devRoutes);
router.use('/attachments', attachmentsRoutes);
router.use('/clients', clientsRoutes);
router.use('/equipaments', equipamentsRoutes);
router.use('/items', itemsRoutes);
router.use('/budgets', budgetsRoutes);
router.use('/work-orders', workOrdersRoutes);

module.exports = router;