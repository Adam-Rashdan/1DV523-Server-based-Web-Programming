/**
 * Login Router Handler
 *
 */
'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController')

router.get('/', controller.login)
router.post('/', controller.auth)

module.exports = router
