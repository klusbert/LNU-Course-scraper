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
      const courseID = this._getCourseID(jsdom)
      const teachingLanguage = this._getTeachingLanguage(jsdom)
      const swedishSyllabus = this._getSyllabus(jsdom)

      let engSyllabus = ''
      if (teachingLanguage === 'Engelska' && swedishSyllabus !== '') {
        engSyllabus = this._getEnglishSyllabus(swedishSyllabus)
      }

      return {
        courseTitle: this._getCourseTitle(jsdom),
        courseID: courseID,
        courseLevel: this._getCourseLevel(jsdom),
        syllabus: swedishSyllabus,
        syllabusENG: engSyllabus,
        teachingLanguage: teachingLanguage,
        courseGroup: courseID[1] + courseID[2],
        prerequisites: this._getPrerequisites(jsdom),
        courseURL: this._courseURL,
        isDistance: this._isDistance(jsdom),
        courseSpeed: this._getCourseSpeed(jsdom)
      }
    } catch (e) {
      console.log(this._courseURL + '\n' + e)
    }
  }

  /**
   * Returns a english syllabus url.
   *
   * @param {string} swedishSyllbusURL - Swedish syllabus url.
   * @returns {string} - english syllabus url.
   */
  _getEnglishSyllabus (swedishSyllbusURL) {
    try {
      const splited = swedishSyllbusURL.split('kursplaner/')
      return splited[0] + 'kursplaner/' + splited[1].replace('kursplan', 'syllabus')
    } catch (e) {
      console.log('error parsing syllbussEnglis' + e.message)
    }
  }

  /**
   * Parses if the course is distance or not.
   *
   * @param {object} jsdom Jsdom object
   * @returns {boolean} return true if it is a distance course.
   */
  _getCourseSpeed (jsdom) {
    try {
      const teachingForm = jsdom.window.document.getElementById('education-page-teaching-form-and-pace').innerHTML.trim()

      if (teachingForm.includes('Halv')) { return 0.5 } else if (teachingForm.includes('Kvarts')) { return 0.25 }

      return 1.0
    } catch (e) {
      console.log('error parsing courseSpeed' + e.message)
    }
  }

  /**
   * Parses if the course is distance or not.
   *
   * @param {object} jsdom Jsdom object
   * @returns {boolean} return true if it is a distance course.
   */
  _isDistance (jsdom) {
    try {
      const teachingForm = jsdom.window.document.getElementById('education-page-teaching-form-and-pace').innerHTML.trim()

      return teachingForm.includes('Distans')
    } catch (e) {
      console.log('error parsing isdistance' + e.message)
    }
  }

  /**
   * Parse course title from jsdom.
   *
   * @param {object} jsdom - Jsdom object.
   * @returns {string} - Course title.
   */
  _getCourseTitle (jsdom) {
    try {
      return jsdom.window.document.getElementById('education-page-education-name').innerHTML.trim()
    } catch (e) {
      console.log('error parsing courseTitle' + e.message)
    }
  }

  /**
   * Parse course id.
   *
   * @param {object} jsdom - Jsdom object
   * @returns {string} - Course id.
   */
  _getCourseID (jsdom) {
    try {
      const courseID = jsdom.window.document.getElementById('education-page-education-code')
      if (courseID) { return courseID.innerHTML.trim() }
      return ''
    } catch (e) {
      console.log('error parsing courseID' + e.message)
    }
  }

  /**
   * Parse educationlevel.
   *
   * @param {object} jsdom - Jsdom object
   * @returns {string} - Education level.
   */
  _getCourseLevel (jsdom) {
    try {
      return jsdom.window.document.getElementById('education-page-education-level').innerHTML.trim()
    } catch (e) {
      console.log('error parsing courseLevel' + e.message)
    }
  }

  /**
   * Pare syllabus url.
   *
   * @param {object} jsdom - Jsdom object
   * @returns {string} url of the syllabus.
   */
  _getSyllabus (jsdom) {
    try {
      const syllabus = jsdom.window.document.getElementById('education-page-syllabus-url')

      if (syllabus) {
        // some course do not have a url to the syllabus
        return syllabus.getElementsByTagName('a')[0].href
      }
      return ''
    } catch (e) {
      console.log('error parsing syllabus' + e.message)
    }
  }

  /**
   * Parse prerequisites for the course.
   *
   * @param {object} jsdom - JsDom object.
   * @returns {string} -prerequisites
   */
  _getPrerequisites (jsdom) {
    try {
      const prerequisites = jsdom.window.document.getElementById('education-page-entry-requirements')
      if (prerequisites) {
        // some courses do not have any prerequisites
        return prerequisites.getElementsByClassName('expander')[0].textContent.trim()
      }
      return ''
    } catch (e) {
      console.log('error parsing Prerequisites ' + e.message)
    }
  }

  /**
   * Parse teaching language.
   *
   * @param {object} jsdom - Jsdom object.
   * @returns {string} - Teaching language.
   */
  _getTeachingLanguage (jsdom) {
    try {
      return jsdom.window.document.getElementById('education-page-teaching-language').innerHTML.trim()
    } catch (e) {
      console.log('error parsing teaching language. ' + e.message)
    }
  }
}
