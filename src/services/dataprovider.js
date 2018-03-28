const firebase = require('firebase');

const config = {
  apiKey: 'AIzaSyBYglolGE-jyqNiyT8ekVZtHh6OCajQ9Gw',
  authDomain: 'datasportviz.firebaseapp.com',
  databaseURL: 'https://datasportviz.firebaseio.com',
  projectId: 'datasportviz',
  storageBucket: 'datasportviz.appspot.com',
  messagingSenderId: '19789109563',
};

firebase.initializeApp(config);

const saveImage = function saveImage(image, imageKey, progressHandlerFn) {
  const ref = firebase
    .storage()
    .ref()
    .child(imageKey);

  const metaData = {
    // caching 30 d
    cacheControl: `public,max-age=${30 * 24 * 60 * 60}`,
  };
  const task = ref.putString(image, 'data_url', metaData);
  task.on('state_changed', progressHandlerFn);
  return task.then(() => ref.getDownloadURL());
};

function getPhotos(eventName, callbackFn) {
  function callback(snapshot) {
    callbackFn(snapshot.val());
  }
  firebase
    .database()
    .ref()
    .child(`event/${eventName}/photos`)
    .on('child_added', callback);
}

function addPhoto(image, eventName, progressHandlerFn) {
  const fileUploadPromise = [
    saveImage(
      image.fullsizeImage,
      `${eventName}/fullsize/${image.metaData.imageKey}.jpg`,
      progressHandlerFn,
    ),
    saveImage(
      image.thumbnailImage,
      `${eventName}/thumbnails/${image.metaData.imageKey}.jpg`,
      progressHandlerFn,
    ),
  ];

  return Promise.all(fileUploadPromise).then((urls) => {
    const meta = image.metaData;

    meta.fullsizeImage = urls[0];
    meta.thumbnailImage = urls[1];

    const firebaseMetaDataRef = firebase
      .database()
      .ref()
      .child(`event/${eventName}/photos`)
      .push();
    return firebaseMetaDataRef.set(image.metaData);
  });
}

export { addPhoto, getPhotos };
