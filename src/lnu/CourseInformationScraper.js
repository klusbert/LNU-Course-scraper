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

      const courseTitle = this._getCourseTitle(jsdom)
      const courseID = this._getCourseID(jsdom)
      const courseLevel = this._getCourseLevel(jsdom)
      const syllabusURL = this._getSyllabus(jsdom)

      const prerequisites = this._getPrerequisites(jsdom)

      const teachingLanguage = this._getTeachingLanguage(jsdom)

      const courseGroup = courseID[1] + courseID[2]

      return {
        courseTitle: courseTitle,
        courseID: courseID,
        courseLevel: courseLevel,
        syllabus: syllabusURL,
        teachingLanguage: teachingLanguage,
        courseGroup: courseGroup,
        prerequisites: prerequisites,
        courseURL: this._courseURL
      }
    } catch (e) {
      console.log(this._courseURL)
    }
  }

  /**
   * Parse course title from jsdom.
   *
   * @param {object} jsdom - Jsdom object.
   * @returns {string} - Course title.
   */
  _getCourseTitle (jsdom) {
    return jsdom.window.document.getElementById('education-page-education-name').innerHTML.trim()
  }

  /**
   * Parse course id.
   *
   * @param {object} jsdom - Jsdom object
   * @returns {string} - Course id.
   */
  _getCourseID (jsdom) {
    return jsdom.window.document.getElementById('education-page-education-code').innerHTML.trim()
  }

  /**
   * Parse educationlevel.
   *
   * @param {object} jsdom - Jsdom object
   * @returns {string} - Education level.
   */
  _getCourseLevel (jsdom) {
    return jsdom.window.document.getElementById('education-page-education-level').innerHTML.trim()
  }

  /**
   * Pare syllabus url.
   *
   * @param {object} jsdom - Jsdom object
   * @returns {string} url of the syllabus.
   */
  _getSyllabus (jsdom) {
    const syllabus = jsdom.window.document.getElementById('education-page-syllabus-url')

    if (syllabus) {
      // some course do not have a url to the syllabus
      return syllabus.getElementsByTagName('a')[0].href
    }
    return ''
  }

  /**
   * Parse prerequisites for the course.
   *
   * @param {object} jsdom - JsDom object.
   * @returns {string} -prerequisites
   */
  _getPrerequisites (jsdom) {
    const prerequisites = jsdom.window.document.getElementById('education-page-entry-requirements')
    if (prerequisites) {
      // some courses do not have any prerequisites
      return prerequisites.getElementsByClassName('expander')[0].textContent.trim()
    }
    return ''
  }

  /**
   * Parse teaching language.
   *
   * @param {object} jsdom - Jsdom object.
   * @returns {string} - Teaching language.
   */
  _getTeachingLanguage (jsdom) {
    return jsdom.window.document.getElementById('education-page-teaching-language').innerHTML.trim()
  }
}
