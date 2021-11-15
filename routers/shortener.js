const express = require('express')
const router = express.Router()
router.use(express.json())
const fs = require('fs')
const userHandler = require('../middlewares/user-middleware')


router.use(userHandler)
router.post('/', function(req, res, next){
    try {
        console.log("right place right time");
        let message = 'URL generated!'
        const username = req.headers.username
        let {originUrl, customUrl} = req.body
        if (!customUrl) customUrl = randomUrl()
        if (testShortUrl(customUrl)) {
            customUrl = randomUrl()
            message = "sorry, the custom URL you wanted is taken... here's your randomly generated URL"
        }
        let urlObj = createUrlObj(originUrl, customUrl)
        if (fs.existsSync(`./users`)) {
            if (fs.existsSync(`./users/${username}.json`)) { //if the user exists update his json file
                if (testOriginUrlInUser(originUrl, username)){
                    appendUrlObjToUser(urlObj, username)
                    res.send(JSON.stringify({message, customUrl: customUrl}))
                    return
                } else {
                    appendUrlObjToUser(urlObj, username)
                }
            } else { //if the user is new create a new json file
                fs.writeFileSync(`./users/${username}.json`, JSON.stringify([urlObj]))
            }
        } else {
            fs.mkdirSync(`./users`) // create users dir
            fs.writeFileSync(`./users/${username}.json`, JSON.stringify([urlObj])) //create user json with the url
        }
        res.send(JSON.stringify({message, customUrl: customUrl}))
    } catch (error) {
        console.log(error)
        next(error)
    }
})
function randomUrl(){
    let url = ''
    while (url.length < 10){
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        url += chars[Math.floor(Math.random()*chars.length)]
    }
    if (testShortUrl(url)) randomUrl()
    return url
}
function testShortUrl(urlToTest){
    let used = false
    if (fs.existsSync(`./users`)){
        const dirArr = fs.readdirSync('./users')
        for (const jsonFile of dirArr) {
            const fileArr = JSON.parse(fs.readFileSync(`./users/${jsonFile}`))
            fileArr.forEach(urlObj => {
                if (urlObj.customUrl === urlToTest) {
                    used = true
                }
            })
        }
    }
    if (used) return true
    return false
}
function testOriginUrlInUser(originUrl, username){
    let used = false
    if (fs.existsSync(`./users/${username}.json`)){
        const fileArr = JSON.parse(fs.readFileSync(`./users/${username}.json`))
        fileArr.forEach(urlObj => {
            if (urlObj.originUrl === originUrl) {
                fileArr.splice(fileArr.indexOf(urlObj),1)
                fs.writeFileSync(`./users/${username}.json`, JSON.stringify(fileArr))
                used = true
            }
        })
    }
    if (used) return true
    return false
}

function appendUrlObjToUser(urlObj, username){
    const fileContentBuffer = fs.readFileSync(`./users/${username}.json`)
    const fileContent = JSON.parse(fileContentBuffer)
    fileContent.push(urlObj)
    fs.writeFileSync(`./users/${username}.json`, JSON.stringify(fileContent))
}

function createUrlObj(originUrl, customUrl){
    let creationDate = new Date()
    let redirectCount = 0
    return {originUrl, customUrl, creationDate, redirectCount}
}


module.exports = router