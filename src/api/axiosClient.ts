import axios from "axios";

// Cliente axios simple (sin tipos que den problemas)
const axiosClient = axios.create({
  timeout: 10000,
});

// Interceptor sin tipos para evitar errores
axiosClient.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
