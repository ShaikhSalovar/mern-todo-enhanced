const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

// JWT Secret with fallback
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_key_2024';

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.replace('Bearer ', '');

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = auth;
