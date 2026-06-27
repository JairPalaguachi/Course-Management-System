import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Helper interno — usa la clave 'access' que ya tienes en localStorage
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('access')}`,
});

export const createTutorCourse = async (courseData) => {
  const response = await axios.post(`${API_URL}/tutor/courses/`, courseData, {
    headers: getAuthHeader(),
  });

  return response.data;
};

/**
 * Sube o reemplaza el archivo de un SectionContent ya creado en la BD.
 *
 * @param {number}   contentId   - ID del SectionContent (viene de la respuesta de createTutorCourse)
 * @param {File}     file        - Objeto File del input
 * @param {Function} onProgress  - Callback opcional: recibe el porcentaje (0-100)
 * @returns {Promise<{ message, content_id, file_url }>}
 */
export const uploadContentFile = async (contentId, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(
    `${API_URL}/tutor/contents/${contentId}/upload/`,
    formData,
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    }
  );

  return response.data;
};

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/`); 
  return response.data;
};

export const uploadCourseCover = async (courseId, file) => {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await axios.post(`${API_URL}/tutor/courses/${courseId}/upload-cover/`, formData, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getTutorCourses = async () => {
    const response = await axios.get(
        `${API_URL}/tutor/courses/list/`,
        {
            headers: getAuthHeader(),
        }
    );

    return response.data;
};

export const getCourseDetail = async (courseId) => {
  const response = await axios.get(`${API_URL}/tutor/courses/${courseId}/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateTutorCourse = async (id, data) => {
  // Usamos axios directo con la URL completa y los headers explícitos
  const response = await axios.put(
    `${API_URL}/tutor/courses/${id}/`, 
    data, 
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};