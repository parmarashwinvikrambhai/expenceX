import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://expencex.onrender.com/api", 
    withCredentials: true, 
});

export default axiosInstance;
