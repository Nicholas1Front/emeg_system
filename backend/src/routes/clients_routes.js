const { Router } = require('express');

const authMiddleware = require('../middlewares/auth_middleware');
const adminMiddleware = require('../middlewares/admin_middleware');

const clientsController = require('../modules/clients/clients_controller');

const router = Router();

// Create / Post
router.post(
    '/create-client',
    authMiddleware,
    clientsController.createClient
);

router.post(
    '/create-contact',
    authMiddleware,
    clientsController.createContact
);

// Update

router.put(
    '/update-client/:id',
    authMiddleware,
    adminMiddleware,
    clientsController.updateClient
);

router.put(
    '/update-contact/:id',
    authMiddleware,
    clientsController.updateContact
);

// Get / Find
router.get(
    '/get-clients',
    authMiddleware,
    clientsController.findClients
)

router.get(
    '/get-contacts',
    authMiddleware,
    clientsController.findContacts
)

// Delete
router.delete(
    '/delete-client/:id',
    authMiddleware,
    adminMiddleware,
    clientsController.deleteClient
)

router.delete(
    '/delete-contact/:id',
    authMiddleware,
    clientsController.deleteContact
)

module.exports = router;
