const userService = require('./user_service');
const {
    registerSchema,
    updateUserSchema,
    updateUserRoleSchema,
    findUserSchema
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
                error : err.message
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
                error : err.message
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
                error : err.message
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
                error : err.message
            })
        }
    }
    async deactivateUser(req, res){
        try{

            const user = await userService.deactivateUser({
                requesterId : req.user.id,
                requesterRole : req.user.role,
                targetUserId : req.params.id
            })

            return res.status(200).json({
                message : `User deactivated successfully`,
                data : user
            })
        }
        catch(err){
            return res.status(400).json({
                message : `Error deactivating user`,
                error : err.message
            })
        }
    }

    async activateUser(req, res){
        try{
            const user = await userService.activateUser({
                requesterRole : req.user.role,
                targetUserId : req.params.id
            })

            return res.status(200).json({
                message : `User activated successfully`,
                data : user
            })
        }catch(err){
            return res.status(400).json({
                message : `Error activating user`,
                error : err.message
            })
        }

    }
    async getUser(req, res){
        try{
            
            const parsedFilters = findUserSchema.parse(req.query);

            const result = await userService.getUsers({
                requesterRole : req.user.role,
                filters : parsedFilters 
            });

            return res.status(200).json({
                message : `Users finded successfully`,
                user : result
            })

        }catch(err){
            return res.status(400).json({
                message : `Error getting users`,
                error : err.message
            })
        }
    }
}

module.exports = new UserController();