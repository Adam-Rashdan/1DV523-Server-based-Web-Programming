/**
 * Application's entry point
 *
 * @author Adam Rashdan
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./configs/db')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const session = require('express-session')
const createError = require('http-errors')
dotenv.config({ path: './configs/config.env' })

// Connect to database
connectDB()

const PORT = process.env.PORT || 8000

const app = express()

app.engine(
  'hbs',
  hbs.express4({
    defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
    partialsDir: path.join(__dirname, 'views', 'partials')
  })
)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false, // do not create session until something stored
    resave: false, // do not save session if unmodified
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 1000 // 24h
    }
  })
)

app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

app.use((req, res, next) => {
  app.locals.expreq = req.session.userName
  next()
})

// Mounting application's routes
app.use('/', require('./routes/homeRouter'))
app.use('/snippets', require('./routes/snippetsRouter'))
app.use('/login', require('./routes/loginRouter'))
app.use('/register', require('./routes/registerRouter'))
app.use('/logout', require('./routes/logoutRouter'))
app.use('*', (req, res, next) => next(createError(404)))

app.use((err, req, res, next) => {
  if (err.statusCode === 404) {
    return res
      .status(404)
      .sendFile(path.join(__dirname, 'views', 'errors', '404.html'))
  }

  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(path.join(__dirname, 'views', 'errors', '500.html'))
  }

  res.status(err.statusCode || 500).render('errors/error', { error: err })
})

// Listening to port
const server = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
)

// Handel unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close Server & exit
  server.close(() => process.exit(1))
})
