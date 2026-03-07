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

        const existingUser = await userRepository.find({email : email});

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

        const existingUser = await userRepository.find({ id : targetUserId });

        if(!existingUser || existingUser.length === 0){
            throw new Error('User not found');
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

    async updateUserRole({
        requesterRole,
        targetUserId,
        role
    }){
        const isAdmin = requesterRole === 'admin';

        if(!isAdmin){
            throw new Error('Unauthorized');
        }

        const existingUser = await userRepository.find({ id : targetUserId });

        if(!existingUser || existingUser.length === 0){
            throw new Error('User not found');
        }

        const updateUser = await userRepository.updateRole(targetUserId, role);

        if(!updateUser){
            throw new Error('User not found');
        }

        delete updateUser.password_hash;

        return updateUser;
    }
    async deactivateUser({
        requesterId,
        requesterRole,
        targetUserId,
    }){
        const isAdmin = requesterRole === 'admin';
        const isOwner = requesterId === targetUserId;

        if(!isAdmin && !isOwner){
            throw new Error('Unauthorized');
        }

        const existingUser = await userRepository.find({ id : targetUserId });

        if(!existingUser || existingUser.length === 0){
            throw new Error('User not found');
        }

        const deactivatedUser = await userRepository.deactivate(targetUserId);

        return deactivatedUser;
    }

    async activateUser({
        requesterRole,
        targetUserId
    }){
        const isAdmin = requesterRole === 'admin';

        if(!isAdmin){
            throw new Error('Unauthorized');
        }

        const existingUser = await userRepository.find({ id : targetUserId });

        if(!existingUser || existingUser.length === 0){
            throw new Error('User not found');
        }

        const activatedUser = await userRepository.activate(targetUserId);

        return activatedUser;
    }

    async getUsers({
        requesterRole,
        filters
    }){
        const isAdmin = requesterRole === 'admin';

        if(!isAdmin){
            throw new Error('Unauthorized');
        }

        const users = await userRepository.find({
            id : filters.id,
            email : filters.email,
            name : filters.name,
            role : filters.role,
            includedDeactivated : filters.includedDeactivated
        });

        users.map(user => delete user.password_hash);

        return users;
    }
}

module.exports = new UserService();