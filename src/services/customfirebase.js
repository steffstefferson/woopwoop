import config from '@/config';

const firebase = require('firebase');

firebase.initializeApp(config.secret.firebaseConfig);

export default firebase;
