const { Router} = require('express');

const techDocsController = require('../modules/technical_docs/technical_docs_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const adminMiddleware = require('../middlewares/admin_middleware');

const router = Router();

router.use(authMiddleware);

router.post(
    '/create-tech-doc',
    techDocsController.createDoc
)

router.put(
    '/update-tech-doc',
    techDocsController.updateDoc
)

router.get(
    '/get-tech-docs',
    techDocsController.findDoc
)

router.delete(
    '/deactivate-tech-doc/:id',
    adminMiddleware,
    techDocsController.deactivateDoc
)

router.patch(
    '/activate-tech-doc/:id',
    adminMiddleware,
    techDocsController.activateDoc
)

module.exports = router;