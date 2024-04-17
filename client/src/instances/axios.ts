import Axios from "axios";
export const server = import.meta.env.VITE_SERVER_URL;

const axios = Axios.create({
  baseURL: `${server}/api`,
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
