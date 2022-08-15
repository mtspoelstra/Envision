const express = require('express')
const router = express.Router()
const { ensureAuthh } = require("../middleware/auth")

const Goal = require('../models/Goal')


// @desc Create Goal Page
// @route GET to /create

router.get('/create', ensureAuthh, (req, res) => {
    res.render('goals/create')
})

// @desc Show Edit Goal Page
// @route GET to /edit

router.get('/edit/:id', ensureAuthh, async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
        }).lean()
    
        if(!goal) {
            return res.render('error/404')
        }
    
        if(goal.user != req.user.id){
            res.redirect('/mygoals')
        } else {
            res.render('goals/edit', {
                goal,
            })
        }
    
    } catch (error) {
        console.error(error)
        return res.render('error/500')
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

// @desc Update/Edit Goal
// @route PUT to /goals/:id

router.put('/:id', ensureAuthh, async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id).lean()

    if(!goal) {
        return res.render('error/404')
    }

    if(goal.user != req.user.id) {
        res.redirect('/mygoals')
    } else {
        goal = await Goal.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })

        res.redirect('/mygoals')
    }

    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }

    
})

// @desc Update Completed to True
// @route PUT to /goals/:id/completed

router.put('/:id/completed', ensureAuthh, async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id).lean()

    if(!goal) {
        return res.render('error/404')
    }

    if(goal.user != req.user.id) {
        res.redirect('/mygoals')
    } else {
        goal = await Goal.findOneAndUpdate({ _id: req.params.id }, {
           completed: true
        })

        res.redirect('/mygoals')
    }

    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }

    
})

// @desc Update Completed to False
// @route PUT to /goals/:id/notcompleted

router.put('/:id/notcompleted', ensureAuthh, async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id).lean()

    if(!goal) {
        return res.render('error/404')
    }

    if(goal.user != req.user.id) {
        res.redirect('/mygoals')
    } else {
        goal = await Goal.findOneAndUpdate({ _id: req.params.id }, {
           completed: false
        })

        res.redirect('/mygoals')
    }

    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})

// @desc Delete Goal
// @route DELETE to /goals/:id

router.delete('/:id/delete', ensureAuthh, async (req, res) => {
    try {
        await Goal.remove({ _id: req.params.id })
        res.redirect('/mygoals')
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }

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





module.exports = router