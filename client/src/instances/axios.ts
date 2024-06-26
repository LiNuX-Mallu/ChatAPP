import Axios from "axios";
import { api } from "../constants/urls";

const axios = Axios.create({
  baseURL: api,
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    } else if (error.response && error.response.status === 500) {
      alert("Internal server error");
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios;
