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
   *
   * @returns {object[]} - List of courses.
   */
  async getCourseInformation () {
    try {
      const htmlResponse = await fetch(this._courseURL)
      const htmlText = await htmlResponse.text()
      const jsdom = new JSDOM(htmlText)

      const courseTitle = jsdom.window.document.getElementById('education-page-education-name')
      const courseID = jsdom.window.document.getElementById('education-page-education-code')
      const courseLevel = jsdom.window.document.getElementById('education-page-education-level')
      const syllabus = jsdom.window.document.getElementById('education-page-syllabus-url')
      let syllabusURL = ''
      if (syllabus) {
        // some course do not have a url to the syllabus
        syllabusURL = syllabus.getElementsByTagName('a')[0].href
      }

      const teachingLanguage = jsdom.window.document.getElementById('education-page-teaching-language')

      const courseIDText = courseID.innerHTML.trim()
      const courseGroup = courseIDText[1] + courseIDText[2]

      return {
        courseTitle: courseTitle.innerHTML.trim(),
        courseID: courseID.innerHTML.trim(),
        courseLevel: courseLevel.innerHTML.trim(),
        syllabus: syllabusURL,
        teachingLanguage: teachingLanguage.innerHTML.trim(),
        courseGroup: courseGroup
      }
    } catch (e) {
      console.log(this._courseURL)
    }
  }
}
