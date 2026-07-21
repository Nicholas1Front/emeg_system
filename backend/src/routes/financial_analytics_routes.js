const {Router} = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const analyticsController = require('../modules/financial/financial_analytics/financial_analytics_controller')

const router = Router();

router.use(authMiddleware);

router.get(
    '/dashboard',
    analyticsController.getDashboard
)

router.get(
    '/monthly-summary',
    analyticsController.getMonthlySummary
)

router.get(
    '/yearly-summary',
    analyticsController.getYearlySummary
)

router.get(
    '/total-by-category',
    analyticsController.getTotalByCategory
)

router.get(
    '/recent-transactions',
    analyticsController.getRecentTransactions
)

module.exports = router;