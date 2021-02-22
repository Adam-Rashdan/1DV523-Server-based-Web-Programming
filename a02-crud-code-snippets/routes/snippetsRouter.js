/**
 * Snippet Router Handler
 *
 */
'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/snippetsController')

router.get('/', controller.index)

router.get('/new', controller.authorize, controller.new)
router.post('/create', controller.authorize, controller.create)

router.get('/:id/edit', controller.authorize, controller.edit)
router.post('/:id/update', controller.authorize, controller.update)

router.get('/:id/remove', controller.authorize, controller.remove)
router.post('/:id/delete', controller.authorize, controller.delete)

module.exports = router
