const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')

// description : show add page
// route  GET /stories/add
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.

router.get('/add', ensureAuth, (req , res) => {
    res.render('stories/add' )
        
    
})


// description : process add form
// route  POST /stories
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.

router.post('/', ensureAuth, async (req , res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }
        
    
})


// description : show all stories
// route  GET /stories
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.

router.get('/', ensureAuth, async (req , res) => {
    try {
        const stories = await Story.find({ status : 'public'   })
            .populate('user')
            .sort({ createdAt: 'desc'})
            .lean()
        res.render('stories/index' , {
            stories,
        })

    } catch (error) {
        console.error(err)
        res.render('./error/500')
    }
        
    
})

// description : show single story
// route  GET /stories/:id
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.

router.get('/:id', ensureAuth, async (req , res) => {
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()

        if(!story){
        return res.render('error/404')
        }
        res.render('stories/show',{
            story
        })
    } catch (error) {
        console.error(err)
        res.render('./error/404')  
    }
        
    
})


// description : show add page
// route  GET /stories/add
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.

router.get('/add', ensureAuth, (req , res) => {
    res.render('stories/add' )
        
    
})

// description : show edit page
// route  GET /stories/edit/:id
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.


router.get('/edit/:id', ensureAuth, async (req , res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
            
        if(! story) {
            return res.render('error/404')
        }
    
        // only user can access the edit page
        if(story.user != req.user.id) {
            res.redirect('/stories')
        } else{
            res.render('stories/edit', {
                story,
            })
        }
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }
    
})

// description : update story
// route  PUT /stories/:id
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.


router.put('/:id', ensureAuth, async (req , res) => {
    try {
        let story = await Story.findById(req.params.id).lean()
        
    if(!story) {
        return res.render('error/404')
    } 
    if(story.user != req.user.id) {
        res.redirect('/stories')
    } else{
        story = await Story.findOneAndUpdate({ _id: req.params.id} , req.body, {
            new : true,
            runValidators : true
        })
        res.redirect('/dashboard')
    }}catch (error) {
        console.error(err)
        res.render('error/500')
    }
    
    
})

// description : Delete story
// route  DELETE /stories/:id
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.


router.delete('/:id', ensureAuth,  async(req , res) => {
    
        try {
            await Story.remove({_id: req.params.id})
            res.redirect('/dashboard')
        } catch (error) {
            console.error(err)
            res.render('error/500')
        }
    
})

// description : user stories
// route  GET /stories/user/:userId
// whenever we want to use middle ware within a route, we add the object property of the module as a second augument.

router.get('/user/:userId', ensureAuth, async (req , res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

    res.render('stories/index', {
        stories
    })
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }
        
    
})


module.exports = router