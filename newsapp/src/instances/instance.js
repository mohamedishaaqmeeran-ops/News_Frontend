import axios from "axios";

const baseURL = 'https://news-backend-17sl.onrender.com/api/v1';

const instance = axios.create({
    baseURL: baseURL,
    timeout: 1000000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default instance;