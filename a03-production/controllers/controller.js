'use strict'
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const moment = require('moment')

dotenv.config({ path: '../configs/config.env' })
// Url for issues
const url = `https://gitlab.lnu.se/api/v4/projects/10767/issues?state=opened&private_token=${process.env.ACCESS_TOKEN}`

const controller = {}

/**
 * Fetching opened issues from project 10767.
 *
 * @param {object} req request object.
 * @param {object} res response object.
 */
controller.index = async (req, res) => {
  try {
    const issue = await fetch(url)
    const jData = await issue.json()

    const issuesData = {
      issues: jData.map((issue) => ({
        author: `${issue.author.name}/${issue.author.username}`,
        title: issue.title,
        description: issue.description,
        url: issue.web_url,
        id: issue.id,
        comments: issue.user_notes_count,
        createdAt: moment(issue.created_at).format('YYYY-MM-DD HH:mm'),
        updatedAt: moment(issue.updated_at).format('YYYY-MM-DD HH:mm')
      }))
    }
    issuesData.issues.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })

    res.render('home/index', { issuesData })
  } catch (error) {
    console.error(error)
    res.render('home/index')
  }
}

/**
 * Gitlab webhook handler.
 *
 * @param {object} req request object.
 * @param {object} res response object.
 * @param {object} next forward object.
 * @returns {*} Object.
 */
controller.webhook = async (req, res, next) => {
  console.log(req.body)
  const secretToken = req.headers['x-gitlab-token']
  let event = {}
  if (secretToken === process.env.SECRET_TOKEN) {
    if (req.body.event_type === 'issue') {
      event = issueObjectHandler(req.body)
      res.locals.event = event
      return next()
    } else if (req.body.event_type === 'note') {
      event = noteObjectHandler(req.body)
      res.locals.event = event
      return next()
    }
    return res.sendStatus(500)
  }
}

/**
 * Creates an IssueObject and returns it.
 *
 * @param {object} issue webhook's data object.
 * @returns {object} IssueObject.
 */
const issueObjectHandler = (issue) => {
  // console.log(issue)
  if (!issue.changes.description) {
    issue.changes.description = {}
    issue.changes.description.previous = null
    issue.changes.description.current = null
  }
  return {
    id: issue.object_attributes.id,
    title: issue.object_attributes.title,
    author: `${issue.user.name}/${issue.user.username}`,
    description: issue.object_attributes.description,
    url: issue.object_attributes.url,
    comments: 0,
    createdAt: moment(issue.object_attributes.created_at.replace(' +0100', '')).format(
      'YYYY-MM-DD HH:mm'
    ),
    updatedAt: moment(issue.object_attributes.updated_at.replace(' +0100', '')).format(
      'YYYY-MM-DD HH:mm'
    ),
    state: issue.object_attributes.state,
    eventType: issue.event_type,
    currentDescription: issue.changes.description.previous,
    newDescription: issue.changes.description.current
  }
}

/**
 * Creates an NoteObject and returns it.
 *
 * @param {object} note webhook's note object.
 * @returns {object} NoteObject.
 */
const noteObjectHandler = (note) => {
  return {
    author: `${note.user.name}/${note.user.username}`,
    description: note.object_attributes.description,
    url: note.object_attributes.url,
    id: note.issue.id,
    eventType: note.event_type,
    createdAt: moment
      .utc(note.object_attributes.created_at.replace(' UTC', ''))
      .format('YYYY-MM-DD HH:mm'),
    updatedAt: moment
      .utc(note.object_attributes.updated_at.replace(' UTC', ''))
      .format('YYYY-MM-DD HH:mm')
  }
}

module.exports = controller
