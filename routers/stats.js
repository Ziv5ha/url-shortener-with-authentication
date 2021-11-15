const express = require('express')
const router = express.Router()
router.use(express.json())
const fs = require('fs')
const userHandler = require('../middlewares/user-middleware')


router.use(userHandler)
router.get('/', (req, res, next) => {
    try {
        const {username} = req.headers
        if (fs.existsSync(`./users/${username}.json`)){
            const fileContent = JSON.parse(fs.readFileSync(`./users/${username}.json`))
            res.send(JSON.stringify(fileContent))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router