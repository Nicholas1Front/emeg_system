const {Router} = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const financialAnalyticsController = require('../modules/financial/financial_analytics/financial_analytics_controller')

const router = Router();

router.use(authMiddleware);

router.get(
    '/dashboard',
    financialAnalyticsController.getDashboard
)

router.get(
    '/monthly-summary',
    financialAnalyticsController.getMonthlySummary
)

router.get(
    '/yearly-summary',
    financialAnalyticsController.getYearlySummary
)

router.get(
    '/total-by-category',
    financialAnalyticsController.getTotalByCategory
)

router.get(
    '/recent-transactions',
    financialAnalyticsController.getRecentTransactions
)

module.exports = router;