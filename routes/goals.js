const express = require('express')
const router = express.Router()
const { ensureAuthh } = require("../middleware/auth")

const Goal = require('../models/Goal')


// @desc Create Goal Page
// @route GET to /create

router.get('/create', ensureAuthh, (req, res) => {
    res.render('goals/create')
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