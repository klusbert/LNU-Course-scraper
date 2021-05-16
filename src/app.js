import LNUCourses from './model/LnuCourses.js'
import Database from './model/Database.js'
import { Course } from './model/Schemas/Course.js'

const mongoConnectionString = 'mongodb://192.168.0.101:27017/'
// const mongoConnectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PW}@cluster0.zv6lx.mongodb.net/courses?retryWrites=true`

const db = new Database(mongoConnectionString, process.env.MONGO_DATABASE_NAME)
let mongo = null
let lastPercent

/**
 * Starting point of the application.
 */
async function main () {
  // get databaseConnection from db, not using the mongo instance.
  mongo = await db.getConnection()

  if (!mongo) {
    return
  }
  const sweCoursesScraper = new LNUCourses('https://lnu.se/utbildning/sok-program-eller-kurs/?educationtype=Kurs&level=Grund%C2%ADniv%C3%A5&s=alphabeticallyasc', true)
  const engCoursesScraper = new LNUCourses('https://lnu.se/en/education/exchange-studies/courses-and-programmes-for-exchange-students/', false)

  await saveSwedishCourses(await sweCoursesScraper.getCourses(fetchPercentage, 'Fetching Swedish courses'))

  await saveEnglishCourses(await engCoursesScraper.getCourses(fetchPercentage, 'Fetching English Courses'))

  console.log('DONE')

  process.exit(0)
}
/**
 * Print percentage.
 *
 * @param {string} caller - Who called the method.
 * @param {number} percentage - Percent as number.
 */
function fetchPercentage (caller, percentage) {
  if (lastPercent !== percentage) {
    lastPercent = percentage
    console.clear()
    console.log(caller + ' ' + percentage + '%')
  }
}

/**
 * Updates the courses with english title and course page.
 *
 * @param {object[]}courses - List of courses.
 */
async function saveEnglishCourses (courses) {
  let count = 0
  for (const course of courses) {
    const newCourse = await Course.findOne({ courseID: course.courseID })
    fetchPercentage('Saving ENGCourses to Mongo ', Math.round(count++ / courses.length * 100.0))
    if (newCourse) {
      newCourse.courseTitleEnglish = course.courseTitle
      newCourse.prerequisitesENG = course.prerequisites
      newCourse.courseURLENG = course.courseURL
      newCourse.courseDescriptionEnglish = course.courseDescription
      await newCourse.save()
    }
  }
}
/**
 * Prints course information and count.
 *
 * @param {object} course - Course object.
 * @param courses
 */
async function saveSwedishCourses (courses) {
  let count = 0

  for (const course of courses) {
    let newCourse = await Course.findOne({ courseID: course.courseID })

    fetchPercentage('Saving SWECourses to Mongo ', Math.round(count++ / courses.length * 100.0))
    if (!newCourse) {
      newCourse = await new Course()
    }
    newCourse.courseTitle = course.courseTitle
    newCourse.courseID = course.courseID
    newCourse.courseDescription = course.courseDescription
    newCourse.courseLevel = course.courseLevel
    newCourse.syllabus = course.syllabus
    newCourse.syllabusENG = course.syllabusENG
    newCourse.teachingLanguage = course.teachingLanguage
    newCourse.courseGroup = course.courseGroup
    newCourse.prerequisites = course.prerequisites
    newCourse.courseURL = course.courseURL
    newCourse.isDistance = course.isDistance
    newCourse.courseSpeed = course.courseSpeed

    await newCourse.save()
  }
}

main()

// if application exits we close the connection to mongo.
process.on('SIGINT', () => {
  if (mongo != null) mongo.connection.close()
})
