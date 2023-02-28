const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('express-flash')
const connectDB = require('./config/db')


// Load config file
// the path where all the global variables are stored
dotenv.config({ path : './config/config.env'}) 

// passport config
require('./config/passport')(passport)
require('./config/local-passport')(passport)


// call the connectDB function
connectDB()

// initialize app
const app = express()

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method Override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Handlebars helpers
const {formatDate , stripTags, truncate, editIcon, select} = require ('./helpers/hbs')


// handlebars
app.engine('.hbs', exphbs.engine({
  helpers: {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
},defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine' , '.hbs')


// Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    MemoryStore: MongoStore.create({ mongoUrl:process.env.MONGO_URI})
    // cookie: { secure: true }
  })
)


// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Set global variable
app.use(function(req,res,next){
  res.locals.user = req.user || null
  next()
})

// static folder
app.use(express.static(path.join(__dirname, 'public')))


// routes
app.use('/' , require('./routes/index'))
app.use('/signup' , require('./routes/index'))
app.use('/local-auth' , require('./routes/local-auth'))
app.use('/auth' , require('./routes/auth'))
app.use('/stories' , require('./routes/stories'))


// accessing the global variable (PORT) in the config.env file 
// if the env port cant be accessed it should use  port 5000
const PORT = process.env.PORT || 5000


// enables the app to listen to the Port in which the server is called
app.listen(PORT , console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))