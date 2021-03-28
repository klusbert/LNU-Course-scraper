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
   */
  constructor (courseRootURL) {
    this._url = courseRootURL
  }

  /**
   * Start finding all pages.
   *
   * @returns {string[]} - List of urls.
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
        links.push(this._url + '&p=' + index)
      }
    }

    return links
  }
}
