import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  id: { type: Number },
  courseTitle: { type: String },
  courseID: { type: String },
  courseLevel: { type: String },
  syllabus: { type: String },
  teachingLanguage: { type: String },
  courseGroup: { type: String }

})

export const Course = mongoose.model('Course', courseSchema)
