import CourseLinkScraper from './lnu/CourseLinkScraper.js'
import CourseLinkScraperInformationScraper from './lnu/CourseInformationScraper.js'
import PageBrowser from './lnu/PageBrowser.js'

import LnuCourses from './LnuCourses.js'

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
async function main1 () {
  // get databaseConnection from db, not using the mongo instance.
  mongo = await db.getConnection()

  const coursePageBrowser = new PageBrowser('https://lnu.se/utbildning/sok-program-eller-kurs/?educationtype=Kurs&level=Grund%C2%ADniv%C3%A5&s=alphabeticallyasc')
  // const coursePageBrowser = new PageBrowser('https://lnu.se/utbildning/sok-program-eller-kurs/?cat=60&educationtype=Kurs&level=Grund%C2%ADniv%C3%A5&s=alphabeticallyasc')
  const pages = await coursePageBrowser.getPages()

  console.log('Found: ' + pages.length + ' pages')
  pages.forEach(async page => {
    const courseLinkScraper = new CourseLinkScraper(page, 'https://lnu.se')
    const links = await courseLinkScraper.getCourseLinks()

    links.forEach(async courseLink => {
      const courseInformation = new CourseLinkScraperInformationScraper(courseLink)

      const course = await courseInformation.getCourseInformation()
      saveCourse(course)
    })
  })

  console.log(courses)
}

/**
 * Prints course information and count.
 *
 * @param {object} course - Course object.
 */
async function saveCourse (course) {
  console.log(`${count++}: ${course.courseTitle} - ${course.courseID} `)
  courses.push(course.courseID)

  const exist = Course.findOne({ courseID: course.courseID })
  if (!exist) {
    const newCourse = new Course({

      courseTitle: course.courseTitle,
      courseID: course.courseID,
      courseLevel: course.courseLevel,
      syllabus: course.syllabus,
      teachingLanguage: course.teachingLanguage,
      courseGroup: course.courseGroup,
      prerequisites: course.prerequisites,
      courseURL: course.courseURL

    })

    await newCourse.save()
  } else {
    console.log('skipping course ' + course.courseID + ' already exist.')
  }
}

main1()
// if application exits we close the connection to mongo.
process.on('SIGINT', () => {
  if (mongo != null) mongo.connection.close()
})
