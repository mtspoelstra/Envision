const express = require('express')
const router = express.Router()


// @desc Login/Landing Page
// @route GET to /

router.get('/', (req, res) => {
    res.render('login')
})

// @desc My Goals Page
// @route GET to /mygoals

router.get('/mygoals', (req, res) => {
    res.render('mygoals')
})




module.exports = router