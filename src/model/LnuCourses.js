import CourseLinkScraper from './lnu/CourseLinkScraper.js'
import CourseLinkScraperInformationScraper from './lnu/CourseInformationScraper.js'
import PageBrowser from './lnu/PageBrowser.js'

/**
 * Scrapes all swedish courses.
 */
export default class LNUCourses {
  /**
   * Constructor for LNUCoursesSWE.
   *
   * @param {string} startURL - Start page.
   * @param {boolean} swedish - Define if it is swedish page.
   */
  constructor (startURL, swedish) {
    this._startURL = startURL
    this._swedish = swedish
  }

  /**
   * Get all courses and return an array of courses.
   *
   * @param {Function} percentageCallback - Update load status.
   * @param {string} caller - Who calls the method.
   * @returns {object[]} - List of courses
   */
  async getCourses (percentageCallback, caller) {
    const coursePageBrowser = new PageBrowser(this._startURL, this._swedish)

    const numberOfCourses = await coursePageBrowser.getNumberOfCourses()

    const startTime = new Date()
    const pages = await coursePageBrowser.getPages()

    let count = 0
    const courses = []
    await Promise.all(pages.map(async (page) => {
      const courseLinkScraper = new CourseLinkScraper(page)
      const links = await courseLinkScraper.getCourseLinks()
      await Promise.all(links.map(async (link) => {
        const courseInformation = new CourseLinkScraperInformationScraper(link)

        const course = await courseInformation.getCourseInformation()

        courses.push(course)
        percentageCallback(caller, Math.round(count++ / numberOfCourses * 100.0))
      }))
    }))

    console.log('\n\nDone scraping courses.\n\t Time elapsed: ' + (new Date() - startTime) / 1000 + 's')

    return courses
  }
}
