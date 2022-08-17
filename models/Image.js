const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    imageURL: {
        type: String,
        required: true,
        trim: true
    },
    imageId: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('Image', ImageSchema)