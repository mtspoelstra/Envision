const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const morgan = require('morgan')


// Load config
dotenv.config({ path: './config/config.env'})

connectDB()

const app = express()



// Console Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')) 
}

// EJS
app.set('view engine', 'ejs')

const PORT = process.env.PORT || 1008

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

// Static Folder
app.use(express.static('public'))

// Routes
app.use('/', require('./routes/index'))
app.use('/goals', require('./routes/goals'))


