import axios from "axios";
import {
    GET_STUDENT_DETAILS,
    ENABLE_STUDENT_DETAILS_LOADING,
    GET_ERRORS,
    DISABLE_STUDENT_DETAILS_LOADING,
    CLEAR_ERRORS
} from "./types";

// Create axios instance with default config
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            const errorMessage = data.message || 'An error occurred';
            
            console.error(`API Error (${status}):`, data);
            
            // Handle specific status codes
            if (status === 400) {
                return Promise.reject({
                    ...data,
                    message: errorMessage,
                    isValidationError: true
                });
            }
            
            return Promise.reject({
                ...data,
                message: errorMessage
            });
        } else if (error.request) {
            // Request was made but no response
            console.error('No response received:', error.request);
            return Promise.reject({
                message: 'No response from server. Please check your connection.'
            });
        } else {
            // Request setup error
            console.error('Request setup error:', error.message);
            return Promise.reject({
                message: `Request error: ${error.message}`
            });
        }
    }
);

export const getStudentDetails = (batch) => async (dispatch) => {
    dispatch(enableStudentDetailsLoading());
    dispatch(clearErrors());
    
    try {
        const res = await api.get(`/student/batch/${batch}`);
        dispatch({
            type: GET_STUDENT_DETAILS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: GET_ERRORS,
            payload: err.response?.data || { message: 'Failed to fetch student details' }
        });
    } finally {
        dispatch(disableStudentDetailsLoading());
    }
};

export const createStudentDetails = (studentData) => async (dispatch) => {
    dispatch(clearErrors());
    
    try {
        const res = await api.post('/student', studentData);
        
        // Show success message
        alert('Student added successfully!');
        
        // Refresh the student list
        await dispatch(getStudentDetails(studentData.batch));
        
        return { success: true, data: res.data };
    } catch (error) {
        console.error('Create student error:', error);
        
        const errorPayload = {
            message: error.message || 'Failed to create student',
            ...(error.errors && { errors: error.errors }),
            ...(error.missingFields && { missingFields: error.missingFields })
        };
        
        dispatch({
            type: GET_ERRORS,
            payload: errorPayload
        });
        
        return { success: false, error: errorPayload };
    }
};

export const updateStudentStatus = (id, isAvailable) => async (dispatch) => {
    try {
        await api.put('/student/availability', { id, isAvailable: !isAvailable });
        return { success: true };
    } catch (error) {
        console.error('Update status error:', error);
        dispatch({
            type: GET_ERRORS,
            payload: error.response?.data || { message: 'Failed to update student status' }
        });
        return { success: false, error: error.response?.data };
    }
};

export const deleteStudent = (id, batch) => async (dispatch) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
        return { success: false, cancelled: true };
    }
    
    try {
        await api.delete('/student', { data: { id } });
        alert('Student deleted successfully!');
        dispatch(getStudentDetails(batch));
        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete student. Please try again.');
        return { success: false, error: error.response?.data };
    }
};

export const clearErrors = () => ({
    type: CLEAR_ERRORS
});

export const enableStudentDetailsLoading = () => ({
    type: ENABLE_STUDENT_DETAILS_LOADING
});

export const disableStudentDetailsLoading = () => ({
    type: DISABLE_STUDENT_DETAILS_LOADING
});