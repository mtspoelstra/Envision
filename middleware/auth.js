module.exports = {
    ensureAuthh: function (req, res, next) {
        if (req.isAuthenticated()){
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuestt: function (req, res, next) {
        if (req.isAuthenticated()){
            res.redirect("/mygoals")
        } else {
            return next()
        }
    }
}