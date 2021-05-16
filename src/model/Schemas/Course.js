import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({

  courseTitle: { type: String, index: true },
  courseDescription: { type: String },
  courseDescriptionEnglish: { type: String },
  courseTitleEnglish: { type: String },
  courseID: { type: String, unique: true },
  courseLevel: { type: String },
  syllabus: { type: String },
  syllabusENG: { type: String },
  teachingLanguage: { type: String },
  courseGroup: { type: String },
  prerequisites: { type: String },
  prerequisitesENG: { type: String },
  courseURL: { type: String },
  courseURLENG: { type: String },
  isDistance: { type: Boolean },
  courseSpeed: { type: Number }

})

courseSchema.index(
  { courseTitle: 1 },
  { collation: { locale: 'en', strength: 2 } }
)
export const Course = mongoose.model('Course', courseSchema)
