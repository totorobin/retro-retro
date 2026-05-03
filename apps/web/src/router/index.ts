import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/login', component: () => import('../pages/Login.vue'), meta: { public: true } },
  { path: '/squads', component: () => import('../pages/Squads.vue') },
  { path: '/squads/join/:id', component: () => import('../pages/Squads.vue') },
  { path: '/squads/:id', component: () => import('../pages/SquadHome.vue') },
  { path: '/board/:id', component: () => import('../pages/Board.vue') },
  { path: '/', redirect: '/squads' }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();
  if (auth.loading) await auth.fetchUser();
  if (!to.meta.public && !auth.user) {
    next('/login');
  } else if (to.path === '/login' && auth.user) {
    next('/squads');
  } else {
    next();
  }
});

export default router;
