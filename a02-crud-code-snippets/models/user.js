'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

/**
 * User Form
 */
const userForm = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    }
  },
  {
    timestamps: true
  }
)
/**
 * Authentication Handler for User in database
 *
 * @param {String} username Username.
 * @param {String} password Password.
 * @return {Promise<*>} Promise.
 */
userForm.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }
  return user
}

// Encrypt user's password
userForm.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

const User = mongoose.model('User', userForm)

module.exports = User
