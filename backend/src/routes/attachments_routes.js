const {Router} = require('express');
const multer = require('multer');

const authMiddleware = require("../middlewares/auth_middleware");
const adminMiddleware = require("../middlewares/admin_middleware");

const attachmentsController = require("../modules/attachments/attachments_controller");

const router = Router();
const upload = multer({
    storage : multer.memoryStorage(),
    limits : {
        fileSize : 2 * 1024 * 1024 * 1024 // 2GB
    }
})

router.post(
    "/create-attachment",
    authMiddleware,
    upload.single('file'),
    attachmentsController.createAttachment
)

router.get(
    "/delete-attachment/:id",
    authMiddleware,
    adminMiddleware,
    attachmentsController.deleteAttachment
)

router.get(
    "/get-attachment",
    authMiddleware,
    attachmentsController.getAttachments
)

module.exports = router;