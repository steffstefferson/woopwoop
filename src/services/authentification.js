import firebase from '@/services/customfirebase';

let currentUser = null;
function userAuthChanged(user) {
  console.log(`onAuthStateChanged got user with uid: ${user ? user.uid : ''}`, user);
  currentUser = user;
}

currentUser = firebase.auth().currentUser;
userAuthChanged(currentUser);
firebase.auth().onAuthStateChanged(userAuthChanged);

firebase
  .auth()
  .signInAnonymously()
  .catch((error) => {
    console.log('error authentification', error);
  });

export default function getCurrentUserId() {
  return currentUser ? currentUser.uid : null;
}
