const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.DATABASE)
const User = require('../models/user-model')
const express = require('express')
const router = express.Router()
router.use(express.json())
// const userHandler = require('../middlewares/user-middleware')

// router.use(userHandler)
router.post('/up', async (req, res) => {
    try {
        const {username, first_name, last_name, password} = req.body
        const isUsed = await User.findOne({username})
        if (isUsed) throw 'Username is taken'
        const user = new User({username, first_name, last_name, password})
        user.save()
        res.send('user created')
    } catch (error) {
        res.status(403).send(error)
    }
})
router.post('/in', async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username, password})
        if (!user) throw 'Wrong username or password'
        const token = jwt.sign({username, password}, process.env.SECRET, {expiresIn: '6000s'})
        res.cookie('username', username)
        res.cookie('authorization', token, {httpOnly: true, maxAge: 6000000})
        res.json(user)
    } catch (error) {
        res.status(404).send(error)
        
    }
    
})

module.exports = router