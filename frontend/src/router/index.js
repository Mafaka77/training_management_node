import { route } from "quasar/wrappers";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useUserStore } from "src/stores/user";

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes,
  });

  Router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // Redirect logged-in users from /login
  if (to.path === "/login" && userStore.isLoggedIn) {
    if (userStore.isAdmin) return next("/admin/dashboard");
    if (userStore.isTrainer) return next("/trainer/dashboard");
    if (userStore.isUser) return next("/trainee/dashboard");
    return next("/");
  }

  // Check auth for protected routes
  if (to.matched.some(r => r.meta.requiresAuth)) {
    if (!userStore.isLoggedIn) return next("/login");

    const allowedRoles = to.matched
      .map(r => r.meta.role)
      .filter(Boolean);

    if (
      allowedRoles.length &&
      !allowedRoles.some(role => {
        // Use getters for comparison
        if (role.toLowerCase() === "admin") return userStore.isAdmin;
        if (role.toLowerCase() === "trainer") return userStore.isTrainer;
        if (role.toLowerCase() === "trainee") return userStore.isUser;
        return false;
      })
    ) {
      return next("/"); // role mismatch
    }
  }

  next();
});



  return Router;
});
