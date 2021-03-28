import CourseLinkScraper from './lnu/CourseLinkScraper.js'
import CourseLinkScraperInformationScraper from './lnu/CourseInformationScraper.js'
import PageBrowser from './lnu/PageBrowser.js'

let count = 0
/**
 * Starting point of the application.
 */
async function main () {
  const coursePageBrowser = new PageBrowser('https://lnu.se/utbildning/sok-program-eller-kurs/?educationtype=Kurs&level=Grund%C2%ADniv%C3%A5&s=alphabeticallyasc')
  // const coursePageBrowser = new PageBrowser('https://lnu.se/utbildning/sok-program-eller-kurs/?cat=60&educationtype=Kurs&level=Grund%C2%ADniv%C3%A5&s=alphabeticallyasc')
  const pages = await coursePageBrowser.getPages()

  pages.forEach(async page => {
    const courseLinkScraper = new CourseLinkScraper(page, 'https://lnu.se')
    const links = await courseLinkScraper.getCourseLinks()

    const count = 0
    links.forEach(async courseLink => {
      const courseInformation = new CourseLinkScraperInformationScraper(courseLink)

      const course = await courseInformation.getCourseInformation()
      printCourse(course)
    })
  })
}

/**
 * @param course
 */
function printCourse (course) {
  console.log(count++ + ' ' + course.courseTitle)
}
main()
