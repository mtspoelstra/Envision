const express = require("express")
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require("./config/db")
const morgan = require('morgan')




// Load config
dotenv.config({ path: './config/config.env'})

// Passport Config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



// Console Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')) 
}

// EJS
app.set('view engine', 'ejs')

// Sessions 
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection})
      
    }))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


// Static Folder
app.use(express.static('public'))

// Routes
app.use('/', require('./routes/index'))
app.use('/goals', require('./routes/goals'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 1008

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))