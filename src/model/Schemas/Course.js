import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String },
  courseID: { type: String, unique: true },
  courseLevel: { type: String },
  syllabus: { type: String },
  teachingLanguage: { type: String },
  courseGroup: { type: String },
  prerequisites: { type: String },
  courseURL: { type: String }

})

export const Course = mongoose.model('Course', courseSchema)
