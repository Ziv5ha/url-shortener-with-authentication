const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.DATABASE)
const Url = require('../models/url-model')
const express = require('express')
const router = express.Router()
router.use(express.json())

router.get('/:customUrl', async (req, res, next) => {
    try {
        let {customUrl} = req.params
        const urlData = await Url.findOne({customUrl})
        if (urlData){
            await Url.updateOne({customUrl}, {$inc: {redirectCounter: 1}})
            if (urlData.originUrl.includes('https://')){
                res.redirect(urlData.originUrl)
            } else {
                res.redirect(`https://${urlData.originUrl}`)
            }
        } else {
            throw 404
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router