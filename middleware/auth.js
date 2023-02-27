// a middleware is just a function that has access to the request and response objects
// next is a function you call when you want to connect the next piece of middleware

module.exports = {
    ensureAuth : function(req, res, next) {
        // the conditional means if request is authenticated, then return NEXT function else redirect to "/"
        if(req.isAuthenticated()) {
            return next()
        }else{
            res.redirect('/')
        }
    },
    // if you are loggged in and you try to go to the landing page, we dont want the guest to see the landing page, it should go straight to the dashboard.
    ensureGuest: function (req,res, next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }else{
            return next()
        }
    }

}