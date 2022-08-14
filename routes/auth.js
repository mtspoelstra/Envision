const express = require('express')
const router = express.Router()
const passport = require('passport')

const Goal = require('../models/Goal')


// @desc Auth with Google
// @route GET to /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc Google auth callback
// @route GET to /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/mygoals')
})

// @desc Logout User
// @rout /auth/logout

// router.get('/logout', (req, res) => {
//     req.logout()
//     res.redirect('/')
// })

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})




module.exports = router