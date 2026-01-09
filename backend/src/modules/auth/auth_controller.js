const authService = require('./auth_service');
const { loginSchema } = require('./auth.schema');

class AuthController{
    async login(req, res){
        try{
            const data = loginSchema.parse(req.body);

            const result = await authService.login(data);

            return res.status(200).json(result);
        }catch(err){
            return res.status(401).json({
                message : err.message || "Authentication failed"
            })
        }
    }
}

module.exports = new AuthController();