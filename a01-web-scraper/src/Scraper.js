'use strict'
const { JSDOM } = require('jsdom')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fetchCookie = require('fetch-cookie/node-fetch')(fetch)

/**
 *
 * @param {string[]} links.
 * @return {Promise<*[]>} href elements for the links.
 */
const scrapeLinks = async links => {
  const res = await fetch(links)
  const txt = await res.text()
  const page = await new JSDOM(txt)

  return Array.from(page.window.document.querySelectorAll('a'), el => el.href)
}

/**
 * fetch all the available days from calenders
 *
 * @param {string} url links for calenders.
 * @return {Array} array of available days.
 */
const dateHandler = async url => {
  const [links] = await Promise.all([await scrapeLinks(url)])
  const linkArray = Array.from(new Set([...links]))
  const availableDays = []

  for (const link of linkArray) {
    const results = await checkDaysHandler(url + link)

    results.forEach(item1 => {
      availableDays.push(item1)
    })
  }

  console.log('Scraping available days...OK')
  return calendarsHandler(availableDays)
}

/**
 * Handles available days through all three users calender.
 *
 * @param {string} day.
 * @return {Promise<any[]>} Array of available days from each calendar.
 */
const checkDaysHandler = async day => {
  const res = await fetch(day)
  const text = await res.text()
  const calendar = await new JSDOM(text)

  const days = calendar.window.document.querySelectorAll('table tr th')
  const available = calendar.window.document.querySelectorAll('table tr td')
  const arr = []

  for (let i = 0; i < days.length; i++) {
    const dayStatus = available[i].innerHTML
    if (dayStatus.toUpperCase() === 'OK') arr.push(days[i].innerHTML)
  }
  return arr
}

/**
 * Handles the available days for all calenders.
 *
 * @param {Array} days array to be handles.
 * @return {Array} Available days.
 */

function calendarsHandler (days) {
  const status = {}
  const available = []

  for (const day of days) {
    status[day] = (status[day] || 0) + 1
  }

  if (status.Friday === 3) available.push('Friday')
  if (status.Saturday === 3) available.push('Saturday')
  if (status.Sunday === 3) available.push('Sunday')

  return available
}

/**
 * Handles available movies.
 *
 * @param {string} url movie's links.
 * @param {Array} days available days.
 * @return {Array} movies array of available movies.
 */

async function movieHandler (url, days) {
  try {
    const movies = []

    for (const day of days) {
      switch (day) {
        case 'Friday':
          movies.push(await checkMoviesHandler(url, '05'))
          break
        case 'Saturday':
          movies.push(await checkMoviesHandler(url, '06'))
          break
        case 'Sunday':
          movies.push(await checkMoviesHandler(url, '07'))
          break
      }
    }

    console.log('Scraping showtimes...OK')
    return movies
  } catch (err) {
    console.log('Error:', err)
  }
}

/**
 * Handles available movies with the days.
 *
 * @param {string} url links to check.
 * @param {string} day days to check.
 * @return {Array} result array of available movies with the days.
 */
async function checkMoviesHandler (url, day) {
  let data
  const result = []

  for (let count = 1; count < 4; count++) {
    const res = await fetch(url + '/check?day=' + day + '&movie=0' + count)
    data = await res.json()

    const availableMovies = await checkValueHandler(data, 1, url)
    for (const movie of availableMovies) {
      result.push(movie)
    }
  }
  return result
}

/**
 * Handles the value of the data object and returns the available movies.
 *
 * @param {string} data Json data.
 * @param {string} value checked value.
 * @param {string} url links to scrape.
 * @return {Object} json object of the movies.
 */
async function checkValueHandler (data, value, url) {
  const movies = []
  const res = await fetch(url)
  const text = await res.text()
  const $ = cheerio.load(text)

  for (const item in data) {
    if (data[item].status === value) {
      const time = data[item]

      $('#movie option').each((index, el) => {
        if ($(el).attr('value') === time.movie) {
          time.movie = $(el).text()
        }
      })

      movies.push(time)
    }
  }
  return movies
}

/**
 * Handles dinner reservation.
 *
 * @param {string} url links to check.
 * @param {Array} availableTimes array movie time to match reservation.
 * @return {Promise<[]>}
 */
async function dinnerHandler (url, availableTimes) {
  try {
    const res = await fetchCookie(`${url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'username=zeke&password=coys'
    })

    const text = await res.text()
    const $ = cheerio.load(text)
    const time = []
    const result = []

    $('.MsoNormal input').each((index, element) => {
      if ($(element).attr('value')) time.push($(element).attr('value'))
    })
    for (const movieTime of availableTimes) {
      movieTime.forEach(movieDay => {
        for (let i = 0; i < time.length; i++) {
          const dinnerTime = time[i]
          const day = dinnerTime.slice(0, 3)
          const startTime = parseInt(dinnerTime.slice(3, 5))
          const finishTime = dinnerTime.slice(5, 7)

          if (movieDay.day === '05' && day === 'fri' && parseInt(movieDay.time) + 2 === startTime) {
            result.push({
              day: 'Friday',
              movie: movieDay.movie,
              time: movieDay.time,
              dinnerStart: startTime,
              dinnerEnd: finishTime
            })
          } else if (movieDay.day === '06' && day === 'sat' && parseInt(movieDay.time) + 2 === startTime) {
            result.push({
              day: 'Saturday',
              movie: movieDay.movie,
              time: movieDay.time,
              dinnerStart: startTime,
              dinnerEnd: finishTime
            })
          } else if (movieDay.day === '07' && day === 'sun' && parseInt(movieDay.time) + 2 === startTime) {
            result.push({
              day: 'Sunday',
              movie: movieDay.movie,
              time: movieDay.time,
              dinnerStart: startTime,
              dinnerEnd: finishTime
            })
          }
        }
      })
    }

    console.log('Scraping possible reservations...OK')

    return result
  } catch (err) {
    console.log('Error:', err)
  }
}

module.exports.scrapeLinks = scrapeLinks
module.exports.dateHandler = dateHandler
module.exports.movieHandler = movieHandler
module.exports.dinnerHandler = dinnerHandler
