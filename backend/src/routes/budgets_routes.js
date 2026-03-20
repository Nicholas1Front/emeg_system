const {Router} = require('express');
const BudgetsController = require('../modules/budgets/budgets_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = Router();

router.use(authMiddleware);

router.post('/create-budget', BudgetsController.createBudget);

router.put('/update-budget/:id', BudgetsController.updateBudget);
router.patch('/update-status-budget/:id', BudgetsController.updateStatusBudget);

router.get('/get-budget', BudgetsController.getBudget);

router.delete('/deactivate-budget/:id', BudgetsController.deactivateBudget);
router.patch('/activate-budget/:id', BudgetsController.activateBudget);

module.exports = router;