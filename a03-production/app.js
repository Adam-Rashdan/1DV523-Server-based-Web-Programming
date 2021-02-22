/**
 * Application's entry point
 *
 * @author Adam Rashdan
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const chalk = require('chalk')
const hbs = require('express-hbs')
const path = require('path')
const dotenv = require('dotenv')
const http = require('http')
const morgan = require('morgan')
dotenv.config({ path: './configs/config.env' })
const bodyParser = require('body-parser')
const router = require('./routers/router')
const socketio = require('socket.io')

const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)

const io = socketio(server)

app.engine(
  'hbs',
  hbs.express4({
    defaultLayout: path.join(__dirname, 'views', 'layouts', 'default')
    // partialsDir: path.join(__dirname, 'views', 'partials')
  })
)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

// Mounting application's routes
app.use('/', router)
app.use('/event', router, async (req, res) => {
  io.emit('webhook-event', res.locals.event)
  res.sendStatus(200)
})

// Listening to port
server.listen(port, () => console.log(chalk.blue(`Server running at http://localhost:${port}`)))

// Handel unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  // Close Server & exit
  server.close(() => process.exit(1))
})
