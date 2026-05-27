const {Router} = require('express');
const financialController = require('../modules/financial/financial_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = Router();

router.use(authMiddleware);

router.post('/create-record', financialController.createRecord);
router.post('/create-category', financialController.createCategory);

router.put('/update-record/:id', financialController.updateRecord);
router.put('/update-category/:id', financialController.updateCategory);

router.get('/get-records', financialController.getRecords);
router.get('/get-categories', financialController.getCategories);

router.delete('/delete-record/:id', financialController.deleteRecord);
router.delete('/delete-category/:id', financialController.deleteCategory);

module.exports = router;