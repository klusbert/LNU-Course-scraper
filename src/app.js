import CourseLinkScraper from './lnu/CourseLinkScraper.js'
import CourseLinkScraperInformationScraper from './lnu/CourseInformationScraper.js'

/**
 * Starting point of the application.
 */
async function main () {
  const courseLinkScraper = new CourseLinkScraper('https://lnu.se/utbildning/sok-program-eller-kurs/?cat=60&educationtype=Kurs&level=Grund%C2%ADniv%C3%A5&s=alphabeticallyasc', 'https://lnu.se')

  const links = await courseLinkScraper.getCourseLinks()

  links.forEach(async courseLink => {
    const courseInformation = new CourseLinkScraperInformationScraper(courseLink)

    const course = await courseInformation.getCourseInformation()
    console.log(course)
  })
}
main()
