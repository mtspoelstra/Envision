const mongoose = require('mongoose')

const GoalSchema = new mongoose.Schema({
    goalTitle: {
        type: String,
        required: true,
        trim: true
    },
    goalBriefDes: {
        type: String,
        required: true,
        trim: true
    },
    goalDetailDes: {
        type: String,
        required: true,
        trim: true
    },
    // Add status and user
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Goal', GoalSchema)