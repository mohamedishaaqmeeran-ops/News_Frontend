import axios from "axios";

const baseURL = 'http://localhost:3001/api/v1';

const instance = axios.create({
    baseURL: baseURL,
    timeout: 1000000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default instance;