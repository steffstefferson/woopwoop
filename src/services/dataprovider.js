import getCurrentUserId from '@/services/authentification';
import firebase from '@/services/customfirebase';

const saveImage = function saveImage(image, imageKey, eventNr, progressHandlerFn) {
  const ref = firebase
    .storage()
    .ref()
    .child(imageKey);

  const metaData = {
    // caching 30 d
    cacheControl: `public,max-age=${30 * 24 * 60 * 60}`,
    customMetadata: { eventNr },
  };
  const task = ref.putString(image, 'data_url', metaData);
  task.on('state_changed', progressHandlerFn);
  return task.then(() => ref.getDownloadURL());
};

function getPhotos(eventName, callbackFn) {
  function callback(snapshot) {
    const meta = snapshot.val();
    meta.photoKey = snapshot.key;
    callbackFn(meta);
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
      eventName,
      progressHandlerFn,
    ),
    saveImage(
      image.thumbnailImage,
      `${eventName}/thumbnails/${image.metaData.imageKey}.jpg`,
      eventName,
      progressHandlerFn,
    ),
  ];

  return Promise.all(fileUploadPromise).then((urls) => {
    const meta = image.metaData;
    meta.userId = getCurrentUserId();
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

function getEventDetails(eventNr) {
  return firebase
    .database()
    .ref()
    .child(`event/${eventNr}/meta`)
    .once('value')
    .then((snapshot) => {
      const metaData = snapshot.val();
      metaData.eventNr = eventNr;
      const eventLink = `/event/${metaData.eventKey}/view`;
      metaData.eventLink = eventLink;
      metaData.qrCodeUrl = `${encodeURIComponent(eventLink)}`;
      return metaData;
    });
}

function getEventData(eventKey) {
  return firebase
    .database()
    .ref()
    .child(`eventKey/${eventKey}`)
    .once('value')
    .then((snapshot) => {
      const event = snapshot.val();
      if (event && event.eventNr) {
        return getEventDetails(event.eventNr);
      }
      return null;
    });
}

function checkAdminKey(adminKey, eventNr) {
  return firebase
    .database()
    .ref()
    .child(`adminKey/${adminKey}`)
    .once('value')
    .then((snapshot) => snapshot.val() && snapshot.val().eventNr === eventNr);
}

function addEventKey(eventKey, data) {
  return firebase
    .database()
    .ref()
    .child(`eventKey/${eventKey}`)
    .set(data);
}

function addAdminKey(adminKey, eventNr) {
  return firebase
    .database()
    .ref()
    .child(`adminKey/${adminKey}`)
    .set({ eventNr, created: +new Date() });
}

function addEvent(data) {
  return firebase
    .database()
    .ref()
    .child(`event/${data.eventNr}/meta`)
    .set({ ...data, userId: getCurrentUserId(), adminUserIds: [getCurrentUserId()] });
}

function deletePhoto(eventNr, data) {
  const metaData = data;
  metaData.visible = false;
  return firebase
    .database()
    .ref()
    .child(`event/${eventNr}/photos/${metaData.photoKey}`)
    .set(metaData);
}

export {
  addPhoto,
  getPhotos,
  getEventData,
  addEvent,
  addEventKey,
  getEventDetails,
  deletePhoto,
  addAdminKey,
  checkAdminKey,
};
