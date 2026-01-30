const {Router} = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const adminMiddleware = require('../middlewares/admin_middleware');

const notesController = require('../modules/notes/notes_controller');

const router = Router();

// Create Note
router.post('/create-note', authMiddleware, notesController.createNote);

// Update Note
router.put(
    '/update-note/:id',
    authMiddleware,
    notesController.updateNote
);

// Get Notes
router.get(
    '/get-notes',
    authMiddleware,
    notesController.getNotes
)

//Delete note
router.delete(
    '/delete-note/:id',
    authMiddleware,
    adminMiddleware,
    notesController.deleteNote
)

