import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

/**
 * Scrapes courses links from LNU.
 */
export default class CourseLinkScraper {
  /**
   * Init CourseScraper.
   *
   * @param {string} lnuURL - LNU course page.
   * @param {string} lnuBASEURL - The baseurl of lnu.
   */
  constructor (lnuURL, lnuBASEURL) {
    this._lnuURL = lnuURL
    this._lnuBASEURL = lnuBASEURL
  }

  /**
   * Start fetching the links.
   *
   * @returns {string[]} - A list of links.
   */
  async getCourseLinks () {
    const htmlResponse = await fetch(this._lnuURL)
    const htmlText = await htmlResponse.text()
    const jsdom = new JSDOM(htmlText)

    const courses = Array.from(jsdom.window.document.querySelectorAll('.display-mode-list > li'))

    const courseLinks = []
    courses.forEach(c => {
      const relativeURL = c.getElementsByTagName('a')[0]
      const absolutPath = this._lnuBASEURL + relativeURL.href

      courseLinks.push(absolutPath)
    })

    return courseLinks
  }
}
