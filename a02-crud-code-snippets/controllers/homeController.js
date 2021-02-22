'use strict'

const homeController = {}

/**
 * Render Home Router.
 *
 * @param {*} req Request.
 * @param {*} res Response.
 */
homeController.index = (req, res) => {
  res.render('home/index')
}

module.exports = homeController
