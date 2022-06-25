const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

    const token = req.header('auth-token');
    if (!token) res.status(401).send('Access Denied!');

    try {
        const verified = jwt.verify(token, process.env.db_secret);
        req.user = verified;
        next();
    } catch (e) {
        res.status(400).send('Invalid Token!!')
    };

}

function isAdmin(req, res, next) {
    const token = req.header('auth-token');
    if (!token) res.status(401).send('Access Denied!');

    const verified = jwt.verify(token, process.env.db_secret);
    console.log(verified);
    if (verified.isAdmin === true) {
        next();
    } else {
        res.status(403).send('You are tresspassing in private data.')
    }

}


module.exports = { isAdmin, verifyToken }