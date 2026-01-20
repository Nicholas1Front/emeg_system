const userService = require('./user_service');
const {
    registerSchema,
    updateUserSchema,
    updateUserRoleSchema
} = require('./user_schema');

class UserController{
    async registerFirstUser(req, res){
        try{
            const data = registerSchema.parse(req.body);

            const result = await userService.createFirstUser({
                name : data.name,
                email : data.email,
                password : data.password
            });

            return res.status(200).json({
                message : `First user registered successfully`,
                user : result
            })
        }
        catch(err){
            return res.status(400).json({
                message : `Error registering first user`,
                error : err
            })
        }
    }
    async registerUser(req, res){
        try{
            const data = registerSchema.parse(req.body);

            const result = await userService.registerUser({
                requesterRole : req.user.role,
                name : data.name,
                email : data.email,
                password : data.password
            });

            return res.status(200).json({
                message : `User registered successfully`,
                user : result
            });
        }catch(err){
            return res.status(400).json({
                message : `Error registering user`,
                error : err
            })
        }
    }
    async updateUser(req, res){
        try{
            const data = updateUserSchema.parse(req.body);

            const result = await userService.updateUser({
                requesterId : req.user.id,
                requesterRole : req.user.role,
                targetUserId : req.params.id,
                name : data.name,
                email : data.email,
                password : data.password
            });

            return res.status(200).json({
                message : `User updated successfully`,
                user : result
            })
        }
        catch(err){
            return res.status(400).json({
                message : `Error updating user`,
                error : err
            })
        }
    }
    async updateUserRole(req, res){
        try{
            const targetUserId = req.params.id;
            const requesterRole = req.user.role;

            const data = updateUserRoleSchema.parse(req.body);

            const result = await userService.updateUserRole({
                targetUserId : targetUserId,
                requesterRole : requesterRole,
                role : data.role
            });

            return res.status(200).json({
                message : `User role updated successfully`,
                user : result
            })
        }
        catch(err){
            return res.status(400).json({
                message : `Error updating user role`,
                error : err
            })
        }
    }
    async deleteUser(req, res){
        try{
            const requesterId = req.user.id;
            const requesterRole = req.user.role;
            const targetUserId = req.params.id;

            await userService.deleteUser({
                requesterId : requesterId,
                requesterRole : requesterRole,
                targetUserId : targetUserId
            })

            return res.status(200).json({
                message : `User deleted successfully`,
            })
        }
        catch(err){
            return res.status(400).json({
                message : `Error deleting user`,
                error : err
            })
        }
    }
    async getUser(req, res){
        try{
            const requesterRole = req.user.role;

            const result = await userService.getUser({
                requesterRole : requesterRole,
                email : req.body.email,
                id : req.body.id
            });

            return res.status(200).json({
                message : `User finded successfully`,
                user : result
            })

        }catch(err){
            return res.status(400).json({
                message : `Error getting user`,
                error : err
            })
        }
    }
    async getAllUsers(req,res){
        try{

            const requesterRole = req.user.role;

            const result = await userService.getAllUsers({
                requesterRole : requesterRole
            })

            return res.status(200).json({
                message : `All users finded successfully`,
                users : result
            })

        }catch(err){
            return res.status(400).json({
                message : `Error getting users`,
                error : err
            })
        }
    }
}

module.exports = new UserController();