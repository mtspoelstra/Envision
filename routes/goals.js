const express = require('express')
const router = express.Router()
const { ensureAuthh } = require("../middleware/auth")

const Goal = require('../models/Goal')


// @desc Create Goal Page
// @route GET to /create

router.get('/create', ensureAuthh, (req, res) => {
    res.render('goals/create')
})

// @desc Goal Feed Page
// @route GET to /feed

router.get('/feed', ensureAuthh, async (req, res) => {
    
    try {
        const goals = await Goal.find({ status: 'public' })
            .populate('user')
            .sort({ createAt: 'desc' })
            .lean()

            res.render('goals/feed', {
                goals,
                name: req.user.firstName,
                image: req.user.image
            })
   } catch (error) {
        console.error(error)
        res.render('error/500')
   }
})


// @desc process new Goal form AKA create goal
// @route POST to /addGoal

router.post('/addGoal', ensureAuthh, async (req, res) => {
    try {
        
        req.body.user = req.user.id
        await Goal.create(req.body)
        res.redirect('/mygoals')
    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
})






module.exports = router