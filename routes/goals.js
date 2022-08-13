const express = require('express')
const router = express.Router()


// @desc Create Goal Page
// @route GET to /create

router.get('/create', (req, res) => {
    res.render('goals/create')
})






module.exports = router