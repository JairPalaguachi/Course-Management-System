import api from "./api";

export const getStudentEnrollments = async () => {
    const response = await api.get("/student/enrollments/");
    return response.data;
};