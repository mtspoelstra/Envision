const mongoose = require('mongoose')

const WorkshopSessionSchema = new mongoose.Schema({
    why: {
        type: String,
    },
    life: {
        type: String,
    },
    block: {
        type: String,
    },
    fear: {
        type: String,
    },
    limiting: {
        type: String,
    },
    steps: {
        type: String,
    },
    people: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('WorkshopSession', WorkshopSessionSchema)