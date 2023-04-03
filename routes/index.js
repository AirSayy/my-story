const express = require('express')
const router = express.Router()
const {ensureAuth , ensureGuest} = require('../middleware/auth')
const Story = require('../models/Story')

// description : login/landing page
// route  GET /
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.


router.get('/', ensureGuest, (req , res) => {
    res.render('login' , {
        layout: 'login'
    })
    
    
})

router.get('/signup', ensureGuest ,(req , res) => {
    res.render('signup',{
        layout: 'signup'
    } )
    
    
})



// description : dashboard
// route  GET /dashboard

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

// description : profile
// route  GET /profile
router.get('/profile', ensureAuth, async (req , res) => {
    
    try{
    
        const stories = await Story.find({user:req.user.id}).lean()
        res.render('profile', {
            name: req.user.displayName,
            img : req.user.image,
            
            stories
        })
    }catch (err){
        console.error(err)
        res.render('error/500')
    }
    
})
module.exports = router

