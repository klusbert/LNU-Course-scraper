import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

/**
 * If there is multiple pages it will loop through all and return a list of urls.
 */
export default class PageBrowser {
  /**
   * Init PageBrowser.
   *
   * @param {string} courseRootURL the course main page.
   * @param {boolean} swedish - For some reason the swedish and english page handles pages differently.
   */
  constructor (courseRootURL, swedish) {
    this._url = courseRootURL

    if (swedish) {
      this._nextPageSymbol = '&'
    } else {
      this._nextPageSymbol = '?'
    }
  }

  /**
   * Returns number of courses.
   *
   * @returns {number} - Number of courses.
   */
  async getNumberOfCourses () {
    const htmlResponse = await fetch(this._url)
    const htmlText = await htmlResponse.text()

    const json = new JSDOM(htmlText)

    // get number of total courses.
    const s = json.window.document.querySelectorAll('.search-page-view-model-summary')[0].textContent.split(' ')

    return Number(s[s.length - 1])
  }

  /**
   * Start finding all pages.
   *
   * @returns {Promise<string[]>} - List of urls.
   */
  async getPages () {
    const htmlResponse = await fetch(this._url)
    const htmlText = await htmlResponse.text()
    const jsdom = new JSDOM(htmlText)

    const links = []

    // add the root url.
    links.push(this._url)

    const lastPage = jsdom.window.document.getElementsByClassName('last-page')[0]
    if (lastPage) {
      const maxPages = Number(lastPage.innerHTML.trim())
      for (let index = 1; index < maxPages; index++) {
        links.push(this._url + this._nextPageSymbol + 'p=' + index)
      }
    }

    return links
  }
}
