'use strict'

const mongoose = require('mongoose')

/**
 * A from for the snippet
 */
const snippetForm = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    snippet: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

const Snippet = mongoose.model('Snippet', snippetForm)

module.exports = Snippet
