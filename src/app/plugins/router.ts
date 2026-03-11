import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { appRoutes } from '@/app/router/routes'

const router = createRouter({
  history: createWebHistory(),
  routes: appRoutes,
})

export function installRouter(app: App) {
  app.use(router)
}
