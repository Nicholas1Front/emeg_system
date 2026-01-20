const {Router} = require('express');
const userController = require('../modules/users/user_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const adminMiddleware = require('../middlewares/admin_middleware');

const router = Router();

// Register
router.post('/create-first-user',
    userController.registerFirstUser);
router.post('/register', authMiddleware, adminMiddleware, userController.registerUser);

// Update
router.put('/update-user/:id', authMiddleware, userController.updateUser);
router.patch('/update-user-role/:id', 
    authMiddleware, 
    adminMiddleware, 
    userController.updateUserRole);

// Delete
router.delete('/delete-user/:id', 
    authMiddleware, 
    adminMiddleware, 
    userController.deleteUser);

// Get
router.get('/get-user', 
    authMiddleware,
    adminMiddleware, 
    userController.getUser);

router.get('/get-all-users', 
    authMiddleware,
    adminMiddleware, 
    userController.getAllUsers);

module.exports = router;