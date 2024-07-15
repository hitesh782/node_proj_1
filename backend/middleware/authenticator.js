const jwt = require('jsonwebtoken');
const Sapiens = require('../models/Sapiens');
require('dotenv').config();

const authenticator = async (req, res, next) => {

    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    if (token && token.startsWith("Bearer")) {

        try {
            actualToken = token.split(' ')[1]; // Bearer token  (so 0 index would be Bearer)

            // Verify the token
            const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

            req.user = await Sapiens.findById(decoded.id).select('-password');  // this will include user object in req but exclude password field

            console.log('request after: ', req);

            next();
        } catch (error) {
            res.status(401).json({ success: false, message: 'Invalid token.' });
        }

    }

};

module.exports = authenticator;
