const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async login({email, password}){
        // Temporário para testes
        const user = {
            id : 1,
            email : "admin@gmail.com",
            passwordHash : await bcrypt.hash("123456", 10) 
        }

        if(user.email !== email){
            throw new Error("Invalid email")
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if(!passwordMatch){
            throw new Error("Invalid password")
        }

        const token = jwt.sign(
            {sub : user.id},
            process.env.JWT_SECRET,
            {expiresIn : '1d'}
        )

        return {token};
    }
}

module.exports = new AuthService();