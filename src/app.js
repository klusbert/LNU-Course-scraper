import CourseLinkScraper from './lnu/CourseLinkScraper.js'
import CourseLinkScraperInformationScraper from './lnu/CourseInformationScraper.js'
import PageBrowser from './lnu/PageBrowser.js'
import * as url from 'url'

import Database from './model/Database.js'
import { Course } from './model/Schemas/Course.js'

const mongoConnectionString = 'mongodb://localhost:27017/'
const mongoDBName = 'courses'

const db = new Database(mongoConnectionString, mongoDBName)
let mongo = null

const courses = []
let count = 0

/**
 * Starting point of the application.
 */
async function main () {
  // get databaseConnection from db, not using the mongo instance.
  mongo = await db.getConnection()

  const coursePageBrowser = new PageBrowser('https://lnu.se/utbildning/sok-program-eller-kurs/?educationtype=Kurs&level=Grund%C2%ADniv%C3%A5&s=alphabeticallyasc')
  // const coursePageBrowser = new PageBrowser('https://lnu.se/utbildning/sok-program-eller-kurs/?cat=60&educationtype=Kurs&level=Grund%C2%ADniv%C3%A5&s=alphabeticallyasc')
  const startTime = new Date()
  const pages = await coursePageBrowser.getPages()

  await Promise.all(pages.map(async (page) => {
    const courseLinkScraper = new CourseLinkScraper(page)
    const links = await courseLinkScraper.getCourseLinks()
    await Promise.all(links.map(async (link) => {
      const courseInformation = new CourseLinkScraperInformationScraper(link)

      const course = await courseInformation.getCourseInformation()
      await saveCourse(course)
    }))
  }))
  console.log('\n\nDone scraping courses.\n\t Time elapsed: ' + (new Date() - startTime) / 1000 + 's')

  // exit the applicaiton with error code 0(good)
  process.exit(0)
}

/**
 * Prints course information and count.
 *
 * @param {object} course - Course object.
 */
async function saveCourse (course) {
  console.log(`${count++}: ${course.courseTitle} - ${course.courseID} ${course.isDistance}`)

  let newCourse = await Course.findOne({ courseURL: course.courseURL })

  // if the course is not stored in db, lets create new one.
  // if it exist let's just update the properties.
  if (!newCourse) {
    newCourse = new Course()
  }
  newCourse.courseTitle = course.courseTitle
  newCourse.courseID = course.courseID
  newCourse.courseLevel = course.courseLevel
  newCourse.syllabus = course.syllabus
  newCourse.teachingLanguage = course.teachingLanguage
  newCourse.courseGroup = course.courseGroup
  newCourse.prerequisites = course.prerequisites
  newCourse.courseURL = course.courseURL
  newCourse.isDistance = course.isDistance

  await newCourse.save()
}

main().then(console.error)
// if application exits we close the connection to mongo.
process.on('SIGINT', () => {
  if (mongo != null) mongo.connection.close()
})
