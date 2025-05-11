const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authorizeUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.sendStatus(403);
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    authenticateToken,
    authorizeUser
};