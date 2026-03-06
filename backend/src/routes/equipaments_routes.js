const { Router } = require('express');

const equipamentsController = require('../modules/equipaments/equipaments_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = Router();

router.use(authMiddleware);

router.post(
    '/create-equipament',
    equipamentsController.createEquipament
);

router.put(
    '/update-equipament/:id',
    equipamentsController.updateEquipament
)

router.get(
    '/get-equipament',
    equipamentsController.getEquipament
)

router.delete(
    '/deactivate-equipament/:id',
    equipamentsController.deactivateEquipament
)

module.exports = router;