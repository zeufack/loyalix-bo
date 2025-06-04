import axios from 'axios';

const http = axios.create({
  baseURL: process.env.NESTJS_API_URL
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default http;
