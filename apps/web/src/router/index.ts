import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../pages/Login.vue';
import Squads from '../pages/Squads.vue';
import Board from '../pages/Board.vue';

const routes = [
  { path: '/login', component: Login, meta: { public: true } },
  { path: '/squads', component: Squads },
  { path: '/squads/join/:id', component: Squads }, // Temporairement Squads pour gérer le join
  { path: '/board/:id', component: Board },
  { path: '/', redirect: '/squads' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (auth.loading) {
    await auth.fetchUser();
  }

  if (!to.meta.public && !auth.user) {
    next('/login');
  } else if (to.path === '/login' && auth.user) {
    next('/squads');
  } else {
    next();
  }
});

export default router;
