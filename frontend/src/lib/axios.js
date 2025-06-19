import axios from "axios";


const BASE_URL = import.meta.env.NODE_ENV === "development" ? "http://localhost:5001/api" : "https://mern-thinkboard-c6bd.onrender.com/api";
const api = axios.create({
    baseURL: BASE_URL
});

export default api;