import type { RouteRecordRaw } from 'vue-router'
import { horseGameRoutes } from '@/features/horse-game/routes'

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/horse-game',
  },
  ...horseGameRoutes,
]
