import axios from "axios";

const envBaseURL = import.meta.env.VITE_API_BASE_URL || "https://localhost";

const cleanBaseURL = envBaseURL.endsWith("/")
  ? `${envBaseURL}api/v1/`
  : `${envBaseURL}/api/v1/`;

const api = axios.create({
  baseURL: cleanBaseURL,
});

api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      const parsed = JSON.parse(tokens);
      config.headers.Authorization = `Bearer ${parsed.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem("tokens");
        if (!tokens) throw new Error("No tokens found");

        const parsedTokens = JSON.parse(tokens);
        const refreshToken = parsedTokens.refresh;

        const response = await axios.post(
          `${cleanBaseURL}accounts/token/refresh/`,
          {
            refresh: refreshToken,
          },
        );

        if (response.data.access) {
          parsedTokens.access = response.data.access;
          localStorage.setItem("tokens", JSON.stringify(parsedTokens));

          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token expired or invalid", refreshError);
        localStorage.removeItem("tokens");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
