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
    '/update-equipament',
    equipamentsController.updateEquipament
)

router.get(
    '/find-equipament',
    equipamentsController.findEquipament
)

router.delete(
    '/deactivate-equipament',
    equipamentsController.deactivateEquipament
)

module.exports = router;