import axios from "axios";

const apiPublic = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
});

export default apiPublic;
