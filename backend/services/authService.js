import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};


const registerStudent = async ({ name, email, password }) => {
  const existing = await Student.findOne({ email });
  if (existing) {
    throw new Error('Email already registered');
  }

  const student = await Student.create({ name, email, password });

  return {
    token: generateToken(student._id),
    student: {
      id: student._id,
      name: student.name,
      email: student.email,
    },
  };
};

// Login: verify credentials and return token + student data
const loginStudent = async ({ email, password }) => {
  const student = await Student.findOne({ email });
  if (!student) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await student.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return {
    token: generateToken(student._id),
    student: {
      id: student._id,
      name: student.name,
      email: student.email,
    },
  };
};

export { registerStudent, loginStudent };