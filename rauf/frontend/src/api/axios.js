import axios from "axios";

const api = axios.create({
  baseURL: "https://rauf.local/api/v1/",
});

api.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem("tokens"));

  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }

  return config;
});

export default api;
