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

const photosToCache = {};
let lastLoadedImageDate = null;

function addImageToCache(img, eventNr, loadedDate) {
  photosToCache[eventNr].unshift(img);
  setTimeout(() => {
    const isLastLoadedImage = lastLoadedImageDate === loadedDate;
    if (isLastLoadedImage) {
      localStorage.setItem(`photosOf${img.eventNr}`, JSON.stringify(photosToCache[eventNr]));
    }
  }, 3500);
}

function getPhotos(eventNr, showHidden, callbackFn) {
  photosToCache[eventNr] = [];
  lastLoadedImageDate = null;

  const cachedPhotos = JSON.parse(localStorage.getItem(`photosOf${eventNr}`));
  if (cachedPhotos) {
    cachedPhotos.filter((x) => showHidden || x.visible).forEach((y) => {
      callbackFn(y);
    });
  }

  function callback(snapshot) {
    const image = snapshot.val();

    const upload = new Date(image.uploadDate);
    let uploadString = upload.toLocaleTimeString();
    const notToday = new Date(image.uploadDate).getDate() !== new Date().getDate();
    const olderThan24h = +new Date() - image.uploadDate > 24 * 60 * 60 * 1000;
    if (notToday || olderThan24h) {
      uploadString = `${upload.toLocaleDateString()} ${uploadString}`;
    }
    const olderThan30min = +new Date() - image.uploadDate > 30 * 60 * 1000;
    image.isNew = !olderThan30min;
    image.displayDate = uploadString;
    image.loaded = false;
    image.photoKey = snapshot.key;
    lastLoadedImageDate = +new Date();
    addImageToCache(image, eventNr, lastLoadedImageDate);
    if (showHidden || image.visible) {
      callbackFn(image);
    }
  }

  firebase
    .database()
    .ref()
    .child(`event/${eventNr}/photos`)
    .on('child_added', callback);

  firebase
    .database()
    .ref()
    .child(`event/${eventNr}/photos`)
    .on('value', (snapshot) => {
      if (snapshot.numChildren() === 0) {
        callbackFn(null, 'nophotos');
      }
    });
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
  const loadPromise = firebase
    .database()
    .ref()
    .child(`event/${eventNr}/meta`)
    .once('value')
    .then((snapshot) => {
      const metaData = snapshot.val();
      if (!metaData) {
        return null;
      }
      metaData.pictureVisible = +new Date() > metaData.pictureVisibleFrom;
      if (!metaData.pictureVisible) {
        metaData.publishDate = `${new Date(
          metaData.pictureVisibleFrom,
        ).toLocaleDateString()} ${new Date(metaData.pictureVisibleFrom).toLocaleTimeString()}`;
      }
      metaData.eventNr = eventNr;
      const eventLink = `/event/${metaData.eventKey}/view`;
      metaData.eventLink = eventLink;
      localStorage.setItem(`eventMetaOf${eventNr}`, JSON.stringify(metaData));
      return metaData;
    });

  const cachedMeta = JSON.parse(localStorage.getItem(`eventMetaOf${eventNr}`));
  if (cachedMeta) {
    return Promise.resolve(cachedMeta);
  }
  return loadPromise;
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
    .then((snapshot) => snapshot.val() && snapshot.val().eventNr === +eventNr);
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
