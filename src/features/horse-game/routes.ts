import type { RouteRecordRaw } from 'vue-router'

export const horseGameRoutes: RouteRecordRaw[] = [
  {
    path: '/horse-game',
    name: 'horse-game',
    component: () => import('@/features/horse-game/pages/HorseGamePage/HorseGamePage.vue'),
  },
]
