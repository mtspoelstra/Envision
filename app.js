const express = require("express")
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require("./config/db")
const morgan = require('morgan')
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");




// Load config
dotenv.config({ path: './config/config.env'})

// Passport Config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
  });
  const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: "demo",
      allowedFormats: ["jpg", "png"],
      transformation: [{ width: 500, height: 500, crop: "limit" }]
  }
  
  });

  
 

// Method Override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

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