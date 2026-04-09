const upload = require('multer');

const { Router} = require('express');
const techDocsController = require('../modules/technical_docs/technical_docs_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const adminMiddleware = require('../middlewares/admin_middleware');

const router = Router();

router.use(authMiddleware);

router.post(
    '/create-tech-doc',
    upload.fields([
        {name : 'files' , maxCount : 10},
        {name : 'signatureImg' , maxCount : 1}
    ]),
    techDocsController.createDoc
)

router.put(
    '/update-tech-doc',
    upload([
        {name : 'files' , maxCount : 10},
        {name : 'signatureImg' , maxCount : 1}
    ]),
    techDocsController.updateDoc
)

router.get(
    '/get-tech-docs',
    techDocsController.getDocs
)

router.delete(
    '/deactivate-tech-doc/:id',
    adminMiddleware,
    techDocsController.deactivateDoc
)

router.patch(
    'activate-tech-doc/:id',
    adminMiddleware,
    techDocsController.activateDoc
)

module.exports = router;