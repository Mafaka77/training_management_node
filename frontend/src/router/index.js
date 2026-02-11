import { createRouter, createWebHistory } from "vue-router"

import middlewarePipeline from "./middleware/middlewarePipeline"
import auth from "./middleware/auth"
import guest from "./middleware/guest"
import role from "./middleware/role"

const middlewareMap = {
    auth,
    guest,
    role,
}

const routes = [
    {
        path: "/",
        component: () => import('../layout/GuestLayout.vue'),
        meta: {
            middleware: ['guest']
        },
        children: [
            {
                path: "/",
                name: "Home",
                component: () => import("../pages/frontend/Home.vue"),
            },
            {
                path: "/trainings",
                name: "Trainings",
                component: () => import("../pages/frontend/Trainings.vue"),
            },
            {
                path: "/trainings/calendar",
                name: "calendar",
                component: () => import("../pages/frontend/Calendar.vue"),
            },
            {
                path: "/about-us",
                name: "about",
                component: () => import("../pages/frontend/About.vue"),
            }, {
                path: "/contact-us",
                name: "contact",
                component: () => import("../pages/frontend/Contact.vue"),
            },
        ]
    },


    {
        path: "/login",
        name: "login",
        component: () => import("../pages/Login.vue"),
        meta: {
            middleware: ["guest"],
        },
    },
    {
        path:"/trainer",
        component: () => import("../layout/TrainerLayout.vue"),
        meta: {
            middleware: ["auth"]
        },
        children: [
            {
                path: '/trainer/dashboard',
                name:'trainer.dashboard',
                component: () => import("../pages/trainer/TrainerDashboard.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Trainer"],
                },
            },
            {
                path: '/trainer/trainings',
                component: () => import("../pages/trainer/TrainingsParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Trainer"],
                },
                children: [
                    {
                        path: "",
                        name: "trainer.trainings",
                        component: () => import("../pages/trainer/Trainings.vue"),
                    },
                    {
                        path:"trainee/:id",
                        name: "trainer.trainings.attendance",
                        component: () => import("../pages/trainer/Attendance.vue"),
                    },
                    {
                        path:':id/:name/materials',
                        name:'trainer.trainings.material',
                        component: () => import("../pages/trainer/Materials.vue"),
                    }
                ]
            },
        ]
    },

    {
        path: "/admin",
        component: () => import("../layout/AdminLayout.vue"),
        meta: {
            middleware: ["auth"],
        },
        children: [


            {
                path: "/admin/dashboard",
                name: "admin.dashboard",
                component: () => import("../pages/Dashboard.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
            },
            {
                path: "/admin/training/program",
                component: () => import("../pages/training/program/ProgramParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "training.program",
                        component: () => import("../pages/training/program/Index.vue"),
                    },
                    {
                        path: "create", // This matches "/admin/training/program/create"
                        name: "training.program.create",
                        component: () => import("../pages/training/program/Create.vue"),
                    },
                    {
                        path: "edit/:id", // This matches "/admin/training/program/create"
                        name: "training.program.edit",
                        component: () => import("../pages/training/program/Edit.vue"),
                    }
                ]
            },
            {
                path: "/admin/training/",
                component: () => import("../pages/training/program/session/sessionParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: ":id/session",
                        name: "training.session",
                        component: () => import("../pages/training/program/session/Index.vue"),
                    },
                    {
                        // REMOVED leading slash.
                        // Changed :id to :sessionId to distinguish from Program ID
                        path: ':id/session/:sessionId/attendance',
                        name: 'training.session.attendance',
                        component: () => import("../pages/training/program/session/attendance/Index.vue"),
                    },
                ]
            },
            {
                path: "/admin/training/enrollments",
                component: () => import("../pages/training/enrollment/enrollmentParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "training.enrollments",
                        component: () => import("../pages/training/enrollment/Index.vue"),
                    },
                    {
                        path: '/admin/training/enrollment/:id',
                        name: 'admin.enrollment.detail',
                        component: () => import('../pages/training/enrollment/View.vue'),
                        props: true // This allows the ID to be passed as a prop to the component
                    }
                ]
            },
            {
                path: "/admin/master/room",
                component: () => import("../pages/master/room/roomParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "master.room",
                        component: () => import("../pages/master/room/Index.vue"),
                    },
                    {
                        path: "create", // This matches "/admin/training/program/create"
                        name: "master.room.create",
                        component: () => import("../pages/master/room/Create.vue"),
                    },
                    {
                        path: "edit/:id", // This matches "/admin/training/program/create"
                        name: "master.room.edit",
                        component: () => import("../pages/master/room/Edit.vue"),
                    }
                ]
            },
            {
                path: "/admin/master/category",
                component: () => import("../pages/master/category/catParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "master.category",
                        component: () => import("../pages/master/category/Index.vue"),
                    },
                    {
                        path: "create",
                        name: "master.category.create",
                        component: () => import("../pages/master/category/Create.vue"),
                    },
                    {
                        path: 'edit/:id',
                        name: 'master.category.edit',
                        component: () => import("../pages/master/category/Edit.vue"),
                    }
                ]
            },
            {
                path: "/admin/master/documents",
                component: () => import("../pages/master/document/docParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "master.documents",
                        component: () => import("../pages/master/document/Index.vue"),
                    },
                    {
                        path: "create",
                        name: "master.documents.create",
                        component: () => import("../pages/master/document/Create.vue"),
                    },
                    {
                        path: 'edit/:id',
                        name: 'master.documents.edit',
                        component: () => import("../pages/master/document/Edit.vue"),
                    }
                ]
            },
            {
                path: "/admin/master/faq",
                component: () => import("../pages/master/faq/faqParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "master.faq",
                        component: () => import("../pages/master/faq/Index.vue"),
                    },
                    {
                        path: "create",
                        name: "master.faq.create",
                        component: () => import("../pages/master/faq/Create.vue"),
                    },
                    {
                        path: 'edit/:id',
                        name: 'master.faq.edit',
                        component: () => import("../pages/master/faq/Edit.vue"),
                    }
                ]
            },
            {
                path: "/admin/trainer",
                component: () => import("../pages/user/trainer/trainerParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "trainer",
                        component: () => import("../pages/user/trainer/Index.vue"),
                    },
                    {
                        path: "create",
                        name: "trainer.create",
                        component: () => import("../pages/user/trainer/Create.vue"),
                    },
                    {
                        path: 'edit/:id',
                        name: 'trainer.edit',
                        component: () => import("../pages/user/trainer/Edit.vue"),
                    }
                ]
            },
            {
                path: "/admin/trainee",
                component: () => import("../pages/user/trainee/traineeParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "trainee",
                        component: () => import("../pages/user/trainee/Index.vue"),
                    },
                    {
                        path: "create",
                        name: "trainee.create",
                        component: () => import("../pages/user/trainee/Create.vue"),
                    },
                    {
                        path: 'edit/:id',
                        name: 'trainee.edit',
                        component: () => import("../pages/user/trainee/Edit.vue"),
                    }
                ]
            },
            {
                path: "/admin/employee",
                component: () => import("../pages/user/employee/employeeParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "employee",
                        component: () => import("../pages/user/employee/Index.vue"),
                    },
                    {
                        path: "create",
                        name: "employee.create",
                        component: () => import("../pages/user/employee/Create.vue"),
                    },
                ]
            },
            {
                path: "/admin/ticket",
                component: () => import("../pages/ticket/ticketParent.vue"),
                meta: {
                    middleware: ["auth", "role"],
                    roles: ["Admin"],
                },
                children: [
                    {
                        path: "", // This matches "/admin/training/program"
                        name: "ticket",
                        component: () => import("../pages/ticket/Index.vue"),
                    },
                ]
            }
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


// =========================
// GLOBAL GUARD
// =========================

// router/index.js

router.beforeEach((to, from, next) => {
    console.log(`Navigating from: ${from.path} to: ${to.path}`);
    const roleRedirects={
        'Admin': 'admin.dashboard',
        'Trainer': 'trainer.dashboard',
    }
    if (!to.meta.middleware || to.meta.middleware.length === 0) {
        return next();
    }

    // 2. Map middleware names to functions
    const middleware = to.meta.middleware.map(name => middlewareMap[name]);

    const context = { to, from, next, router };

    // 3. Start the pipeline and RETURN it to prevent fall-through
    return middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1),
    });
});

export default router
