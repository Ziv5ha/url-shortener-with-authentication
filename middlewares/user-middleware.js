require('dotenv').config()
const jwt = require('jsonwebtoken')

function AuthHandler(req, res, next) {
    const {authorization} = req.cookies
    const token = authorization
    // const token = authorization && authorization.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = AuthHandler