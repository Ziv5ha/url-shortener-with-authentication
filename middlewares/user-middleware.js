function userHandler(req, res, next) {
    if (!req.headers.username){
        next(401)
    } else {
        next()
    }
}

module.exports = userHandler