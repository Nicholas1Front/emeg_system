const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../database/prisma');

class AuthService {
    async login({email, password}){
        // Temporário para testes
        const user = await prisma.user.findUnique({
            where : {email}
        })

        if(user.email !== email){
            throw new Error("Invalid email")
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if(!passwordMatch){
            throw new Error("Invalid password")
        }

        const response = {
            token : jwt.sign(
                {sub : user.id},
                {role : user.role},
                process.env.JWT_SECRET,
                {expiresIn : '1d'}
            ),
            name : user.name,
            email : user.email,
            role : user.role
        }

        return {response};
    }
}

module.exports = new AuthService();