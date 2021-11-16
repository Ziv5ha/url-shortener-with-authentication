const mongoose = require('mongoose')
const urlSchema = new mongoose.Schema(
    {
        originUrl: String, 
        customUrl : String,
        creationDate : Date,
        redirectCounter: Number,
        createdBy: String
    }
)

module.exports = mongoose.model('Url', urlSchema)