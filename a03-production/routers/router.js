'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/controller')

router.get('/', controller.index)
router.post('/', controller.webhook)

module.exports = router