import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const registerTutor = async (tutorData) => {
  const response = await axios.post(`${API_URL}/auth/register/tutor/`, tutorData);
  return response.data;
};

export const registerStudent = async (studentData) => {
  const response = await axios.post(`${API_URL}/auth/register/student/`, studentData);
  return response.data;
}