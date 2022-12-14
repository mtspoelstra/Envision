const mongoose = require('mongoose')

const GoalSchema = new mongoose.Schema({
    imageURL: {
        type: String,
        trim: true
    },
    imageId: {
        type: String,
        trim: true
    },
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
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    completed: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Goal', GoalSchema)