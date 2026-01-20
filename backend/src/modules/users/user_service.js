const { th } = require('zod/v4/locales');
const userRepository = require('./user_repository');
const bcrypt = require('bcrypt');

class UserService{
    async createFirstUser({
        name,
        email,
        password
    }){
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userRepository.create({
            name : name,
            email : email,
            password : hashedPassword,
            role: 'admin'
        });

        delete newUser.password_hash;

        return newUser;
    }

    async registerUser({
        requesterRole,
        name,
        email, 
        password
    }){

        const isAdmin = requesterRole === 'admin';

        if(!isAdmin){
            throw new Error('Unauthorized');
        }

        const existingUser = await userRepository.findByEmail(email);

        if(existingUser){
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userRepository.create({
            name : name,
            email : email,
            password : hashedPassword,
            role: 'user'
        });

        delete newUser.password_hash;

        return newUser;
    }
    async updateUser({
        requesterId,
        requesterRole,
        targetUserId,
        name,
        email,
        password
    }){
        const isAdmin = requesterRole === 'admin';
        const isOwner = requesterId === targetUserId;

        if(!isAdmin && !isOwner){
            throw new Error('Unauthorized');
        }

        let passwordHashed = undefined;

        if(password){
            passwordHashed = await bcrypt.hash(password, 10);
        }

        const data = {
            name : name,
            email : email,
            password : passwordHashed
        }

        const updatedUser = await userRepository.updateById(targetUserId, data);

        if(!updatedUser){
            throw new Error('User not found');
        }

        delete updatedUser.password_hash;

        return updatedUser;
    }
    async deleteUser({
        requesterId,
        requesterRole,
        targetUserId,
    }){
        const isAdmin = requesterRole === 'admin';
        const isOwner = requesterId === targetUserId;

        if(!isAdmin && !isOwner){
            throw new Error('Unauthorized');
        }

        const targetIsAdmin = await userRepository.findById(targetUserId);

        if(targetIsAdmin.role === 'admin'){
            throw new Error('Cannot delete admin user');
        }

        const deletedUser = await userRepository.deleteById(targetUserId);

        if(!deletedUser){
            throw new Error('User not found');
        }

        return true;
    }
    async updateUserRole({
        requesterRole,
        targetUserId,
        role
    }){
        const isAdmin = requesterRole === 'admin';

        if(!isAdmin){
            throw new Error('Unauthorized');
        }

        const updateUser = await userRepository.updateRole(targetUserId, role);

        if(!updateUser){
            throw new Error('User not found');
        }

        delete updateUser.password_hash;

        return updateUser;
    }
    async getUser({
        requesterRole,
        email,
        id
    }){
        const isAdmin = requesterRole === 'admin';

        if(!isAdmin){
            throw new Error('Unauthorized');
        }

        if(email || email !== undefined){
            const userByEmail = await userRepository.findByEmail(email);

            if(!userByEmail){
                throw new Error("No user found");
            }

            delete userByEmail.password_hash;

            return userByEmail;
        }

        if(id || id !== undefined){
            const userById = await userRepository.findById(id);

            if(!userById){
                throw new Error("No user found");
            }

            delete userById.password_hash;

            return userById;
        }
    }
    async getAllUsers({
        requesterRole        
    }){
        const isAdmin = requesterRole === 'admin';
        if(!isAdmin){
            throw new Error('Unauthorized');
        }

        const users = await userRepository.findAll();

        if(!users || users.length === 0){
            throw new Error('No users found');
        }

        users.map(user => delete user.password_hash);

        return users;
    }
}

module.exports = new UserService();