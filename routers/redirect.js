const express = require('express')
const router = express.Router()
router.use(express.json())
const fs = require('fs')

router.get('/:customUrl', (req, res, next) => {
    try {
        let foundDestination = false
        let {customUrl} = req.params
        if (fs.existsSync(`./users`)){
            const dirArr = fs.readdirSync('./users')
            for (const jsonFile of dirArr){
                const fileContent = JSON.parse(fs.readFileSync(`./users/${jsonFile}`))
                fileContent.forEach(urlObj => {
                    if (urlObj.customUrl === customUrl) {
                        foundDestination = true
                        redirectCount(fileContent, customUrl, jsonFile)
                        if (urlObj.originUrl.includes('https://')){
                            res.redirect(urlObj.originUrl)
                            return
                        } else {
                            res.redirect(`https://${urlObj.originUrl}`)
                            return
                        }
                    }
                })
            }
            if (!foundDestination){
                throw 404
            }
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

function redirectCount(fileContent, customUrl, jsonFile){
    const indexOfUrlObj = fileContent.map(uObj => uObj.customUrl).indexOf(customUrl)
    fileContent[indexOfUrlObj].redirectCount++
    fs.writeFileSync(`./users/${jsonFile}`, JSON.stringify(fileContent))
}


module.exports = router