import axios from 'axios';


const apiClient=axios.create(
    {
        baseURL:import.meta.env.VITE_BACKEND_ENDPOINT,
        headers: {
        "Content-Type": "application/json",
  },
    }
)

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
