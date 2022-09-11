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

// @desc Show Edit Session Page
// @route GET to /edit

router.get('/edit/:goalId/:sessionId', ensureAuthh, async (req, res) => {
    try {
        const session = await WorkshopSession.findOne({
            _id: req.params.sessionId,
        }).lean()

        const goal = await Goal.findOne({
            _id: req.params.goalId,
        }).lean()
    
        if(!session) {
            return res.render('error/404')
        }
    
        if(session.user != req.user.id){
            res.redirect('/mygoals')
        } else {
            res.render('goalsessions/edit', {
                session,
                goal
            })
        }
    
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
    
})

module.exports = router