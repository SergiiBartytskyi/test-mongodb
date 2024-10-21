import { StudentsCollection } from '../db/models/student.js';

export const getAllStudents = async () => {
  const stundents = await StudentsCollection.find();
  return stundents;
};

export const getStudentById = async (studentId) => {
  const student = await StudentsCollection.findById(studentId);
  return student;
};
