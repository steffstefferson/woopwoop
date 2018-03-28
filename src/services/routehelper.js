import { setCookie, getCookie } from '@/services/cookieprovider';
import { getEventData } from '@/services/dataprovider';

const cookieEventKeyEventNr = 'eventKeyEventNr';

function revalidateKey(eventKey) {
  return getEventData(eventKey).then((eventData) => {
    if (!eventData) {
      return null;
    }
    setCookie(`${cookieEventKeyEventNr}_${eventKey}`, eventData.eventNr, 7);
    return eventData.eventNr;
  });
}

export default function checkEventData(eventKey) {
  const eventNr = getCookie(`${cookieEventKeyEventNr}_${eventKey}`);
  if (!eventNr) {
    return revalidateKey(eventKey);
  }
  return Promise.resolve(eventNr);
}
