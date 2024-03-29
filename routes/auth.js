const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')

// description : Auth with google and  email
// route  GET /auth/google


router.get('/google', passport.authenticate('google', { scope: ['profile'] }))




// description :  Google auth callback
// route  GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), (req, res)=>{
    res.redirect('/dashboard')
})


// description : logout user
// router : /auth/logout
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  
  router.get('/profile', function(req, res, next) {
    req.profile(function(err) {
      if (err) { return next(err); }
      res.redirect('/dashboard');
    });
  });

  

module.exports = router