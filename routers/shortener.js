const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.DATABASE)
const Url = require('../models/url-model')
const User = require('../models/user-model')
const express = require('express')
const router = express.Router()
router.use(express.json())
const AuthHandler = require('../middlewares/user-middleware')


router.use(AuthHandler)
router.post('/', async function(req, res, next){
    try {
        console.log(req.cookies);
        let message = 'URL generated!'
        const {username} = req.cookies
        let {originUrl, customUrl} = req.body
        if (!customUrl) customUrl = await randomUrl()
        if (await testShortUrl(customUrl)) {
            customUrl = await randomUrl()
            message = "sorry, the custom URL you wanted is taken... here's your randomly generated URL"
        }
        const user = await User.findOne({username})
        if (user){
            const existsInUser = await testOriginUrlInUser(originUrl, user)
            if (existsInUser >= 0){
                console.log('updating');
                updateUrlData(originUrl, customUrl, username)
                updateUrlInUser(customUrl, existsInUser, user)
            } else {
                console.log('adding');
                createUrlData(originUrl, customUrl, username)
                appendUrlToUser(customUrl, user)
            }
        }
        user.save()
        res.send(JSON.stringify({message, customUrl: customUrl}))
    } catch (error) {
        console.log(error)
        next(error)
    }
})
async function randomUrl(){
    let url = ''
    while (url.length < 10){
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        url += chars[Math.floor(Math.random()*chars.length)]
    }
    if (await testShortUrl(url)) randomUrl()
    return url
}
async function testShortUrl(urlToTest){
    const used = await Url.findOne({customUrl: urlToTest})
    if (used) return true
    return false
}
async function testOriginUrlInUser(originUrl, user){
    const used = await Url.findOne({originUrl, username: user.username})
    if (used){
        const indexOfUsedUrl = await user.urls.indexOf(used.customUrl)
        console.log(indexOfUsedUrl);
        return indexOfUsedUrl
    }
}

async function appendUrlToUser(customUrl, user){
    await user.urls.addToSet(customUrl)
}

async function createUrlData(originUrl, customUrl, username){
    let creationDate = new Date()
    const createdBy = username
    await Url.insertMany({originUrl, customUrl, creationDate, redirectCounter: 0, createdBy})
}

async function updateUrlData(originUrl, customUrl, username){
    await Url.updateOne({originUrl, username}, {$set: {customUrl}})
}
function updateUrlInUser(newUrl, prevUrlindex, user){
    user.urls.set(prevUrlindex, newUrl)
}


module.exports = router