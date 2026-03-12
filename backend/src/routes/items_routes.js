const {Router} = require('express');
const itemsController = require('../modules/items/items_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = Router();

router.use(authMiddleware);

router.post('/create-item', itemsController.createItem);
router.put('/update-item/:id', itemsController.updateItem);
router.delete('/delete-item/:id', itemsController.deleteItem);
router.get('/get-items', itemsController.findItems);

module.exports = router;

