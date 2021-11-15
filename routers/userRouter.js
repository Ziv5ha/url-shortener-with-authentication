const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.DATABASE)
// const Url = require('../models/url-model')
const User = require('../models/user-model')
const express = require('express')
const router = express.Router()
router.use(express.json())
// const userHandler = require('../middlewares/user-middleware')

// router.use(userHandler)
router.post('/up', (req, res) => {
    const {username, first_name, last_name, password} = req.body
    const user = new User({username, first_name, last_name, password})
    user.save()
    res.send('user created')
})

module.exports = router