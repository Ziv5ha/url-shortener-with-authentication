function errorHandler(err, req, res, next) {
    if (err) {
        if (err == 404) {
            res.status(404).send('Page not found')
        }
        if (err == 401) {
            res.status(404).send('Unauthorized! no username header.')
        }
    } else {
        res.status(500).send('something went wrong')
    }
}

module.exports = errorHandler