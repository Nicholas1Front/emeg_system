const { Router } = require('express');

const attachmentsController = require("../modules/attachments/attachments_controller");
const authMiddleware = require("../middlewares/auth_middleware");
const adminMiddleware = require("../middlewares/admin_middleware");

const router = Router();

router.use(authMiddleware);

router.post(
    '/upload',
    attachmentsController.generateUploadUrl
)

router.post(
    '/create',
    attachmentsController.createAttachment
)

router.delete(
    "/delete/:id",
    adminMiddleware,
    attachmentsController.deleteAttachment
)

router.get(
    "/get",
    attachmentsController.getAttachments
)

module.exports = router;