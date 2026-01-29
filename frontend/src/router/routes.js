

const routes = [
  {
    path: "/",
    component: () => import("src/layouts/LandingLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/LandingPage.vue") },
    ],
  },

  {
    path: "/login",
    component: () => import("src/pages/LoginPage.vue"),
  },

  {
    path: "/admin",
    component: () => import("src/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true, role: "Admin" },
    children: [
      { path: "dashboard", component: () => import("src/pages/admin/DashboardPage.vue") },
      { path: "training", component: () => import("pages/admin/Training/TrainingPage.vue") },
      { path: "training-course", component: () => import("pages/admin/Training/TrainingCoursePage.vue") },
      { path: "trainer", component: () => import("src/pages/admin/Trainer/TrainerPage.vue") },
      { path: "trainee", component: () => import("pages/admin/Trainee/TraineePage.vue") },
      { path: "room", component: () => import("pages/admin/MasterData/RoomPage.vue") },
      { path: "category", component: () => import("pages/admin/MasterData/CategoryPage.vue") },
      { path: "department", component: () => import("pages/admin/MasterData/DepartmentPage.vue") },
      { path: "user", component: () => import("pages/admin/User/UserPage.vue") },
      { path: "enrollment", component: () => import("pages/admin/Enrollment/EnrollmentPage.vue") },
      { path: "doc", component: () => import("pages/admin/Documnet/DocumnetPage.vue") },
      { path: "faqs", component: () => import("pages/admin/Faq/FaqPage.vue") },
      { path: "tickets", component: () => import("pages/admin/TicketPage.vue") },
    ],
  },
  {
    path: "/trainer",
    component: () => import("src/layouts/TrainerLayout.vue"),
    meta: { requiresAuth: true, role: "Trainer" },
    children: [
      { path: "dashboard", component: () => import("src/pages/trainer/TrainerDashboard.vue") },
      { path: "trainings", component: () => import("pages/trainer/TrainingsPage.vue") },
      { path: "proficiency", component: () => import("pages/trainer/ProficiencyPage.vue") },
      { path: "materials", component: () => import("pages/trainer/MaterialsPage.vue") },
      { path: '/trainer/profile',component: () => import('pages/trainer/ProfilePage.vue'),name: 'trainer.profile'}

    ]
  },
  {
    path: "/trainee",
    component: () => import("src/layouts/TraineeLayout.vue"),
    meta: { requiresAuth: true, role: "Trainee" },
    children: [
      
      { path: 'dashboard', component: () => import('pages/trainee/TraineeDashboard.vue') },
    { path: 'trainings', component: () => import('pages/trainee/TrainingsPage.vue') },
    { path: 'enrollments', component: () => import('pages/trainee/EnrollmentPage.vue') },
    { path: 'materials', component: () => import('pages/trainee/MaterialsPage.vue') },
    { path: 'tickets', component: () => import('pages/trainee/TicketsPage.vue') },
    // { path: 'profile', component: () => import('pages/trainee/ProfilePage.vue') },
    { path: 'faq', component: () => import('pages/trainee/FAQPage.vue') },
    // { path: 'announcements', component: () => import('pages/trainee/AnnouncementsPage.vue') },
    // { path: 'ratings', component: () => import('pages/trainee/RatingsPage.vue') },
    // { path: 'upcoming', component: () => import('pages/trainee/UpcomingPage.vue') }
      

    ]
  },





  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
