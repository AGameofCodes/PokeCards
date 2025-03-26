import {createRouter, createWebHistory, type RouteLocationNormalized} from 'vue-router';
import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import CardsView from '@/views/CardsView.vue';
import UserCardsView from '@/views/UserCardsView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import {SessionStore} from '@/stores/SessionStore';
import useEmitter from '@/composables/emitter';
import {nextTick} from 'vue';
import ProfileView from '@/views/ProfileView.vue';
import SettingsView from '@/views/SettingsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {anon: true},
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {anon: true},
    },
    {
      path: '/cards',
      name: 'cards',
      component: CardsView,
    },
    {
      path: '/userCards',
      name: 'userCards',
      component: UserCardsView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {anon: true},
    },
  ],
});

const routeCheck = async (route: RouteLocationNormalized): Promise<any> => {
  const sessionStore = new SessionStore();
  await sessionStore.loadIfAbsent();
  if (!route.meta?.anon && !sessionStore.isLoggedIn) {
    return {name: 'login'};
  } else if (['login', 'register'].includes(route.name as string) && sessionStore.isLoggedIn) {
    return {name: 'home'};
  }
};

router.beforeEach(async (to, from) => {
  const route = await routeCheck(to);
  if (route) {
    return route;
  }
});

useEmitter().on('authChanged', async () => {
  await nextTick(async () => {
    const route = await routeCheck(router.currentRoute.value);
    if (route) {
      await router.push(route);
    }
  });
});

export default router;
