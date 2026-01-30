import { boot } from "quasar/wrappers";
import axios from "axios";
import { useUserStore } from "src/stores/user";

const api = axios.create({ baseURL: "https://staging2.egovmz.in" });

// Attach token to ALL requests
api.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(err);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
