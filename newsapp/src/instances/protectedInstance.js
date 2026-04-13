import axios from "axios";

const baseURL = 'https://news-backend-17sl.onrender.com/api/v1';

const protectedInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true 
});

export default protectedInstance;