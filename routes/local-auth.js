const express = require('express')
const passport = require('passport')
const router = express.Router()
const validator = require('validator')
const User = require('../models/local-user')
const {ensureAuth , ensureGuest} = require('../middleware/auth')
const Story = require('../models/Story')


router.get('/signup', ensureGuest ,(req , res) => {
    res.render('signup',{
        layout: 'signup'
    } )
    
    
})

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req)
    res.redirect('/dashboard');
  });

router.post('/signup', (req, res) => {
    console.log(req)
    const username = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
  
    // Validate form data and handle errors
    // ...
  
    // Create user account
    // ...
  
    // Redirect to dashboard page
    res.redirect('/dashboard');
  });

  router.get('/dashboard', ensureAuth, async (req , res) => {
    try{
        const stories = await Story.find({user:req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    }catch (err){
        console.error(err)
        res.render('error/500')
    }
    
})
  module.exports = router