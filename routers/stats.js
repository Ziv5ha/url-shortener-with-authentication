const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.DATABASE)
const Url = require('../models/url-model')
const express = require('express')
const router = express.Router()
router.use(express.json())
const userHandler = require('../middlewares/user-middleware')


router.use(userHandler)
router.get('/', async (req, res, next) => {
    try {
        const {username} = req.headers
        const links = await Url.find({username})
        res.send(links)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router