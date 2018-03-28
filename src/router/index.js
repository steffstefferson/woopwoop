import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import UploadPhoto from '@/components/UploadPhoto';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HelloWorld,
    },
    {
      path: '/upload',
      name: 'UploadPhoto',
      component: UploadPhoto,
    },
    {
      path: '/view',
      name: 'View',
      component: HelloWorld,
    },
  ],
});
