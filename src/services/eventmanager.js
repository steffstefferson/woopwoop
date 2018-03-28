import { addEvent, addEventKey } from '@/services/dataprovider';

const charSet = 'qwrtzpdfghjkyxcvbnm';

function createKey(numberOfChars) {
  let key = '';
  for (let i = 0; i < numberOfChars; i += 1) {
    const rand = charSet[Math.floor(Math.random() * charSet.length)];
    key = `${key}${rand}`;
  }
  return key;
}

function tryCreateEventKey(eventNr, attempts = 6) {
  const key = createKey(6);
  return addEventKey(key, { eventNr })
    .then(() => key)
    .catch(() => {
      if (attempts === 0) {
        return null;
      }
      return tryCreateEventKey(eventNr, attempts - 1);
    });
}

function createEvent(eventTitle, eventDate) {
  const metaData = {
    eventNr: +new Date(),
    title: eventTitle,
    eventDate,
  };

  return addEvent(metaData)
    .then(() => tryCreateEventKey(metaData.eventNr))
    .then((key) => {
      metaData.eventKey = key;
      metaData.adminKey = createKey(32);
      return metaData;
    });
}

function editEvent() {}

export { createEvent, editEvent };
