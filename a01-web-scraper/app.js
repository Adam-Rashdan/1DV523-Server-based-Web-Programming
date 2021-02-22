'use strict'

const { scrapeLinks } = require('./src/Scraper')
const { dateHandler } = require('./src/Scraper')
const { movieHandler } = require('./src/Scraper')
const { dinnerHandler } = require('./src/Scraper')

const start = process.argv.slice(2)

if (start.length === 0) {
  console.error('ERROR: Start with No argument(s).')
  process.exit(0)
}

(async () => {
  try {
    const [links] = await Promise.all([scrapeLinks(start)])
    const arr = Array.from(new Set([...links]))
    console.log('Scraping links...OK')

    const days = await dateHandler(arr[0])

    const movies = await movieHandler(arr[1], days)

    const dinner = await dinnerHandler(arr[2], movies)

    console.log('\n\nRecommendations')
    console.log('===============')

    if (days.length < 1) {
      console.log('No day available for everyone involved!')
    } else {
      dinner.forEach((result) => {
        console.log(
          '* On ' +
          result.day +
          ' the movie "' +
          result.movie +
          '" starts at ' +
          result.time +
          ' and there is a free table between ' +
          result.dinnerStart +
          ':00-' +
          result.dinnerEnd +
          ':00.'
        )
      })
    }
  } catch (err) {
    console.log('Error: ', err)
  }
})()
