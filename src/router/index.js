import { createRouter, createWebHashHistory } from "vue-router";
import Style from "@/views/StyleView.vue";
import Home from "@/views/HomeView.vue";

const routes = [
  {
    meta: {
      title: "Select style",
    },
    path: "/",
    name: "style",
    component: Home,
  },
  {
    meta: {
      title: "Apu",
    },
    path: "/apu",
    name: "apu",
    component: () => import("@/views/APUView.vue"),
  },

  {
    meta: {
      title: "Materiales",
    },
    path: "/materiales",
    name: "materiales",
    component: () => import("@/views/MaterialsView.vue"),
  },

  {
    meta: {
      title: "Mano de obra",
    },
    path: "/mano_obra",
    name: "mano de obra",
    component: () => import("@/views/ManoObraView.vue"),
  },

  {
    meta: {
      title: "Equipo",
    },
    path: "/equipo",
    name: "equipo",
    component: () => import("@/views/EquipoView.vue"),
  },


  {
    meta: {
      title: "Actividades",
    },
    path: "/activities",
    name: "activities",
    component: () => import("@/views/ActivittyView.vue"),
  },
  {
    meta: {
      title: "Nuevo apu",
    },
    path: "/new-apu",
    name: "nuevo apu",
    component: () => import("@/views/FormAPUView.vue"),
  },
  {
    meta: {
      title: "Editar apu",
    },
    path: "/edit-apu/:id?",
    name: "editar apu",
    component: () => import("@/views/FormAPUView.vue"),
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard",
    },
    path: "/dashboard",
    name: "dashboard",
    component: Home,
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/TablesView.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/FormsView.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import("@/views/UiView.vue"),
  },
  {
    meta: {
      title: "Responsive layout",
    },
    path: "/responsive",
    name: "responsive",
    component: () => import("@/views/ResponsiveView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/ErrorView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
