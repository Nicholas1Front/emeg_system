const {Router} = require('express');
const workOrdersController = require('../modules/work_orders/work_orders_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const adminMiddleware = require('../middlewares/admin_middleware');

const router = Router();

router.use(authMiddleware);

router.post('/create-work-order', workOrdersController.createWorkOrder)

router.put('/update-work-order/:id', workOrdersController.updateWorkOrder);
router.patch('/update-work-order-status/:id', workOrdersController.updateWorkOrderStatus);

router.get('/get-work-orders', workOrdersController.getWorkOrders);

router.delete(
    '/deactivate-work-order/:id',
    adminMiddleware,
    workOrdersController.deactivateWorkOrder
)

router.patch(
    '/activate-work-order/:id',
    adminMiddleware,
    workOrdersController.activateWorkOrder
)

module.exports = router;