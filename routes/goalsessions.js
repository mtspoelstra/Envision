const express = require('express')
const router = express.Router()
const { ensureAuthh } = require("../middleware/auth")

const Goal = require('../models/Goal')
const WorkshopSession = require('../models/WorkshopSession')


// @desc Create Session Page
// @route GET to /workshop

router.get('/workshop/:id', ensureAuthh, async (req, res) => {

    let goal = await Goal.findById(req.params.id)

      res.render('goalsessions/workshop', {
                goal,
            })
})


// @desc Process Session Form AKA Add Session
// @route POST to /addSession
router.post('/addSession/:id', ensureAuthh, async (req, res) => {
    try {
        req.body.user = req.user.id
        req.body.goal = req.params.id
        await WorkshopSession.create(req.body)
        res.redirect('/')
    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }

})

// @desc Single Session Page
// @route GET to /session/id

router.get('/sessions/:goalId/:sessionId', ensureAuthh, async (req, res) => {

    let goal = await Goal.findById(req.params.goalId)
    let session = await WorkshopSession.findById(req.params.sessionId)

      res.render('goalsessions/singlesession', {
                session,
                goal
            })
})

module.exports = router