import axios from "axios";

const baseURL = 'https://internship-task-backend-4j86.onrender.com';

const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      

    },
    withCredentials: true,
});

export default instance