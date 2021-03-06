import Vue from 'vue';
import Router from 'vue-router';
import EventView from '@/components/EventView';
import UploadPhoto from '@/components/UploadPhoto';
import HomeScreen from '@/components/HomeScreen';
import CreateEvent from '@/components/CreateEvent';
import Diashow from '@/components/Diashow';
import EditEvent from '@/components/EditEvent';
import PhotoDownload from '@/components/PhotoDownload';
import About from '@/components/About';
import { checkEventData, checkAdminKey } from '@/services/routehelper';
import { setCookie } from '@/services/cookieprovider';

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
      component: EventView,
    },
    {
      path: '/event/:eventKey/diashow',
      name: 'Diashow',
      component: Diashow,
    },
    {
      path: '/event/:eventKey/edit/:adminKey',
      name: 'EditEvent',
      component: EditEvent,
    },
    {
      path: '/event/:eventKey/edit/:adminKey/download',
      name: 'PhotoDownload',
      component: PhotoDownload,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
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
    const key = (to.params.eventKey || '').toLowerCase();
    checkEventData(key).then((eventNr) => {
      if (eventNr) {
        /* eslint no-param-reassign: "error" */
        to.params.eventNr = eventNr;
        setCookie('lastInsertedKey', to.params.eventKey, 7);
        if (to.path.indexOf('/edit/') >= 0) {
          checkAdminKey(to.params.adminKey, eventNr).then((valid) => {
            if (valid) {
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
