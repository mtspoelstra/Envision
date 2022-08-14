const express = require('express')
const { ensureAuth } = require('../middleware/auth')
const router = express.Router()
const { ensureAuthh, ensureGuestt } = require("../middleware/auth")

const Goal = require('../models/Goal')


// @desc Login/Landing Page
// @route GET to /

router.get('/', ensureGuestt, (req, res) => {
    res.render('login')
})

// @desc My Goals Page
// @route GET to /mygoals

router.get('/mygoals', ensureAuthh, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).lean()
        res.render('mygoals', {
            goals,
            name: req.user.firstName,
            image: req.user.image
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})




module.exports = router