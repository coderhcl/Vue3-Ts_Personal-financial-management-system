import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import localCache from "@/utils/cache"
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/main/home/show"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue")
  },
  {
    path: "/main",
    name: "main",
    component: () => import("@/views/main/main.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/not-found/notFound.vue")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if (to.path !== "/login") {
    const token = localCache.getCache("token")
    if (!token) {
      return "/login"
    }
  }

  if (to.path === "/main") {
    return "/"
  }
  if (to.path === "/main/") {
    return "/"
  }
})
export default router
