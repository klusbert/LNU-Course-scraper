import CourseLinkScraper from './lnu/CourseLinkScraper.js'
import CourseLinkScraperInformationScraper from './lnu/CourseInformationScraper.js'
import PageBrowser from './lnu/PageBrowser.js'

/**
 *
 */
export default class LnuCourses {
  /**
   * Initlizes LNUCourses.
   *
   * @param {string} lnuStartURL - Start url of lnu.
   */
  constructor (lnuStartURL) {
    this._lnuStartURL = lnuStartURL
  }

  /**
   *Init the scraper by finding all pages.
   */
  async _init () {
    this._coursePageBrowser = new PageBrowser(this._lnuStartURL)
    this._pages = await this._coursePageBrowser.getPages()
  }

  /**
   *
   */
  async _getCourseLinks () {
    const retLinks = []

    return retLinks
  }

  /**
   * Scrapes all courses.
   */
  async getCourses () {
    const links = await this.getCourseLinks()
    console.log(links)
  }
}
