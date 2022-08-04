import router from '@/router';

function route(route) {
  if (router.currentRoute.name === route) return;
  router.push({ name: route });
}

export { route };
