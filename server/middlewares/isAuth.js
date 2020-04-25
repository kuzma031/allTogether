const jwt = require('jsonwebtoken');

module.exports = async (req,res,next) => {
    try {
        if(!req.get('Authorization')) return res.status(401).json({ success: false, message: '401 Unauthorized'});

        const token = req.get('Authorization').split(' ')[1]; //Authorization: Bearer <token>
        const decodedToken = await jwt.verify(token, process.env.JWTSecret);
        // console.log(decodedToken) 
        req.id = decodedToken.id;
        next();

    } catch(err) {
        console.log('Error: is auth middleware error');
        return res.status(401).json({ success: false, message: '401 Unauthorized'});
    }
}