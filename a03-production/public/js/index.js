const socket = io()
/**
 * listning to webhook and send the data.
 */
socket.on('webhook-event', function (event) {
  if (event.eventType === 'issue') {
    if (event.state === 'closed') {
      notificationCreateHandler(event, 'Issue closed')
      issueRemoveHandler(event)
    } else if (event.currentDescription) {
      notificationCreateHandler(event, 'New issue description')
      issueDescriptionUpdateHandler(event)
    } else {
      notificationCreateHandler(event, 'New issue')
      issueCreateHandler(event)
    }
  } else if (event.eventType === 'note') {
    notificationCreateHandler(event, 'New comment')
    issueCommentsUpdateHandler(event)
  }
})

/**
 * Creat issue handler.
 *
 * @param {object} issueData issue's data.
 */
const issueCreateHandler = (issueData) => {
  const issueArray = Object.values(issueData)
  const template = document.cloneNode(true).querySelector('#issue-template').content
  const html = template.querySelector('li, ul, div')
  const issueCardHeader = html.querySelector('.issue-div-header')
  document.querySelector('#issues').prepend(html)
  const nodeArray = arrayHandler(
    Array.from(document.querySelector('#issues').firstChild.querySelectorAll('*'))
  )
  nodeArray.forEach((elem, i) => {
    if (i === 0) {
      elem.setAttribute('data-issue-id', issueArray[i])
    } else if (i === 4) {
      elem.setAttribute('href', issueArray[i])
      elem.appendChild(document.createTextNode(issueArray[i]))
    } else {
      elem.appendChild(document.createTextNode(issueArray[i]))
    }
  })
  flashHandler(issueCardHeader)
}

/**
 * Notification create handler.
 *
 * @param {object} noteData notification's data.
 * @param {string} event notification's type.
 */
const notificationCreateHandler = (noteData, event) => {
  const template = document.cloneNode(true).querySelector('#note-template').content
  const html = template.querySelector('li, ul, div')
  document.querySelector('#notifications').prepend(html)
  const nodeList = document.querySelector('#notifications').firstChild.querySelectorAll('*')
  nodeList[1].appendChild(document.createTextNode(event))
  nodeList[3].appendChild(document.createTextNode(noteData.author))
  nodeList[4].appendChild(document.createTextNode(noteData.updatedAt))
}

/**
 * Remove issue handler.
 *
 * @param {object} issueData issue's data.
 */
const issueRemoveHandler = (issueData) => {
  document.querySelectorAll(`[data-issue-id="${issueData.id}"]`).forEach((el) => el.remove())
}

/**
 * Array modify handler.
 *
 * @param {Array} arr Array to be modifies.
 * @returns {Array} Returns the modified array.
 */
const arrayHandler = (arr) => {
  arr.splice(2, 1)
  arr.splice(4, 1)
  return arr
}

/**
 * Update issue's comments handler.
 *
 * @param {object} noteData issues data to be updated.
 */
const issueCommentsUpdateHandler = (noteData) => {
  const issueCard = document.querySelector(`[data-issue-id="${noteData.id}"]`)
  const issueCardHeader = issueCard.querySelector('.issue-div-header')
  const comments = issueCard.querySelector('#comments')
  const updated = issueCard.querySelector('#updated-at')
  const commentText = comments.textContent
  const newCommentsNumber = Number(commentText.slice(-1)) + 1
  comments.textContent = `Comments: ${newCommentsNumber}`
  updated.textContent = `Updated: ${noteData.updatedAt}`
  flashHandler(issueCardHeader)
}

/**
 * Update description issue handler.
 *
 * @param {object} issueData issues data to be updated.
 */
const issueDescriptionUpdateHandler = (issueData) => {
  const issueCard = document.querySelector(`[data-issue-id="${issueData.id}"]`)
  const issueCardHeader = issueCard.querySelector('.issue-div-header')
  const description = issueCard.querySelector('#description')
  const updated = issueCard.querySelector('#updated-at')
  description.textContent = `Description: ${issueData.newDescription}`
  updated.textContent = `Updated: ${issueData.updatedAt}`
  flashHandler(issueCardHeader)
}

/**
 * Html flash handler.
 *
 * @param {object} element element to be flashed.
 */
const flashHandler = (element) => {
  element.classList.add('updated-issue')
  setTimeout(() => {
    element.classList.remove('updated-issue')
  }, 3000)
}
