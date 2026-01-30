import { defineStore } from "pinia";
import { api } from 'boot/axios.js'

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
     name: localStorage.getItem("name") || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.role === "Admin",
    isTrainer: (state) => state.role === "Trainer",
    isUser: (state) => state.role === "Trainee" ,
  },
  actions: {
    setUser(token, role) {
      this.token = token;
      this.role = role;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    },
    async login(email, password) {
      try {
        const response = await api.post("/admin-api/login", {
         email,password,
        });
        if(response.status===200){
          if(response.data.status===404){
            return { success: false, message: response.data.message };
          }else if(response.data.status===400){
            return { success: false, message: response.data.message };
          }else if(response.data.status===200){
            const data = await response.data;
            console.log(data);
            this.setUser(data.token, data.user.roles[0]);
            return { success: true , message: "Login successful",data:data};
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: error.message };
      }
    },
    logout() {
      this.token = null;
      this.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});
