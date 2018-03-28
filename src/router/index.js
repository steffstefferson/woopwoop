import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import UploadPhoto from '@/components/UploadPhoto';
import HomeScreen from '@/components/HomeScreen';
import CreateEvent from '@/components/CreateEvent';
import checkEventData from '@/services/routehelper';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HomeScreen',
      component: HomeScreen,
    },
    {
      path: '/event/:eventKey/upload',
      name: 'UploadPhoto',
      component: UploadPhoto,
    },
    { path: '/event/:eventKey', redirect: { name: 'View' } },
    {
      path: '/event/:eventKey/view',
      name: 'View',
      component: HelloWorld,
    },
    {
      path: '/createEvent',
      name: 'CreateEvent',
      component: CreateEvent,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path.indexOf('/event') === 0) {
    checkEventData(to.params.eventKey).then((eventNr) => {
      if (eventNr) {
        /* eslint no-param-reassign: "error" */
        to.params.eventNr = eventNr;
        next();
      } else {
        next({
          path: '/',
        });
      }
    });
  } else {
    next();
  }
});

export default router;
