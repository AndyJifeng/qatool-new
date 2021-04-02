import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import("../components/Home.vue"),
    meta: {
      keepAlive: true // 需要缓存
    }
},
  {
    path: '/login',
    name:'login',
    component: () => import("../views/login/login.vue"),
    meta: {
      keepAlive: false // 需要缓存
    }
  },
  {
    path: '/home',
    name:'home',
    component: () => import("../components/Home.vue"),
    meta: {
      keepAlive: true // 需要缓存
    }
  },
  {
    path: '/propertiesAliases',
    component: () => import(".././components/PropertiesAliases.vue"),
    meta: { keepAlive: false}
  },
  {
    path:'/template',
    name:'template',
    component: () => import("../components/Template.vue"),
    meta: { keepAlive: false }
  },
    {
      // 这个使用正则，在找不到的时候，会走 *
      path: "/:catchAll(.*)",
      name: "404",
      component: () => import("../views/login/404.vue")
  }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router