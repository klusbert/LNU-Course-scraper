import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
/**
 * Scrapes information from a course.
 */
export default class CourseLinkScraperInformationScraper {
  /**
   * Init CourseLinkScraperInformationScraper.
   *
   * @param {string} courseURL - The course webpage.
   */
  constructor (courseURL) {
    this._courseURL = courseURL
  }

  /**
   * Get the course information.
   */
  async getCourseInformation () {
    const htmlResponse = await fetch(this._courseURL)
    const htmlText = await htmlResponse.text()
    const jsdom = new JSDOM(htmlText)

    const courseTitle = jsdom.window.document.getElementById('education-page-education-name')
    const courseID = jsdom.window.document.getElementById('education-page-education-code')
    const courseLevel = jsdom.window.document.getElementById('education-page-education-level')
    const syllabus = jsdom.window.document.getElementById('education-page-syllabus-url').getElementsByTagName('a')[0]

    return {
      courseTitle: courseTitle.innerHTML.trim(),
      courseID: courseID.innerHTML.trim(),
      courseLevel: courseLevel.innerHTML.trim(),
      syllabus: syllabus.href
    }
  }
}
