import axios from "axios";

const baseURL = 'http://localhost:3001/api/v1';

const protectedInstance = axios.create({
    baseURL: baseURL,
    timeout: 1000000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true 
});

export default protectedInstance;