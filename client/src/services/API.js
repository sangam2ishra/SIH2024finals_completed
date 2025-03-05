import axios from "axios";
// import dotenv from './../../.env'
// dotenv.config();
const API = axios.create({ baseURL: "http://localhost:3000/api" });
API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")} `;
  }
  return req;
});

export default API;
