const jwt = require('jsonwebtoken');
const Sapiens = require('../models/Sapiens');
require('dotenv').config();

const authenticator = async (req, res, next) => {
    // const token = req.headers['authorization'];
    // if (token) {
    //     // Logic to verify token (e.g., using JWT)
    //     // If valid:
    //     // req.user = decodedUserData;
    //     next();
    // } else {
    //     res.status(401).json({ message: 'Unauthorized' });
    // }


    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    actualToken = token.split(' ')[1];

    try {
        console.log('inside try', actualToken);
        console.log('secret is: ', process.env.JWT_SECRET);

        // Decode without verification
        // const decodedWithoutVerification = jwt.decode(actualToken);
        // console.log('Decoded without verification:', decodedWithoutVerification);

        // Verify the token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        const user = await Sapiens.findById(decoded.id);

        console.log('user is: ', user);

        console.log('request before: ', req);

        req.user = await Sapiens.findById(decoded.id).select('-password');

        console.log('request after: ', req);

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token.' });
    }



};

module.exports = authenticator;
