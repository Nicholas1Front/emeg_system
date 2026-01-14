const jwt = require('jsonwebtoken');

function authMiddleware(req,res,next){
    const authReader = req.headers.authorization;

    if(!authReader){
        return res.status(401).json({message: 'No token provided'});
    }

    const [type, token] = authReader.split(' ');

    if(type !== 'Bearer' || !token){
        return res.status(401).json({message: "Invalid token format"})
    }

    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
        )

        req.user = {
            id : decoded.sub,
            role : decoded.role
        }

        return next();

    }catch(err){
        return res.status(401).json({message: "Invalid or expired token"});
    }
}

module.exports = authMiddleware;