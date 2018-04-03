import { addEvent, addEventKey } from '@/services/dataprovider';
import config from '@/config';

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
  const key = createKey(config.eventKeyLength);
  return addEventKey(key, { eventNr })
    .then(() => key)
    .catch(() => {
      if (attempts === 0) {
        return null;
      }
      return tryCreateEventKey(eventNr, attempts - 1);
    });
}

function createEvent(metaDataEvent) {
  const metaData = {
    eventNr: +new Date(),
    ...metaDataEvent,
  };

  return addEvent(metaData)
    .then(() => tryCreateEventKey(metaData.eventNr))
    .then((key) => {
      if (key) {
        metaData.eventKey = key;
        metaData.adminKey = createKey(32);
        return metaData;
      }
      return null;
    });
}

function editEvent() {}

export { createEvent, editEvent };
