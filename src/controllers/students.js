import createHttpError from 'http-errors';
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from '../services/students.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getGreetController = async (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: 'Hello User!',
  });
};

export const getStudentsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};

export const getStudentByIdController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);

  if (!student) {
    // throw createHttpError(404, 'Student not found!');
    next(createHttpError(404, 'Student not found!'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};

export const createStudentController = async (req, res, next) => {
  const { name, age, email, gender, avgMark, onDuty } = req.body;

  // if (!name || !age || !onDuty) {
  //   throw createHttpError(400, 'Required fields: name, age, onDuty');
  // }
  if (!name || !age || !onDuty) {
    next(createHttpError(400, 'Required fields: name, age, onDuty'));
    return;
  }

  const newStudent = await createStudent({
    name,
    age,
    email,
    gender,
    avgMark,
    onDuty,
  });

  res.status(201).json({
    status: 201,
    message: `Successfully created a student!`,
    data: newStudent,
  });
};

export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const result = await updateStudent(studentId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found!'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upserted a student!',
    data: result.student,
  });
};

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const result = await updateStudent(studentId, req.body);

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a student!`,
    data: result.student,
  });
};

export const deleteStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await deleteStudent(studentId);

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(204).send();
};
