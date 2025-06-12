import jwt from "jsonwebtoken"

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({});
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET) ;
        req.userId = decoded.userId;
        req.role = decoded.role;
        return next();
    } catch (err) {
        return res.status(401).json({message: "Invalid token"});
    }
};

export default authenticate;