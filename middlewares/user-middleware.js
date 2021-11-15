const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.DATABASE)

function userHandler(req, res, next) {
    if (!req.headers.username){
        next(401)
    } else {
        next()
    }
}

module.exports = userHandler