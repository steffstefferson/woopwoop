
const storageKey = 'myOpenedEvents';
const emptyStorage = { events: [] };

function getEvents() {
  if (!localStorage) return emptyStorage;
  const data = JSON.parse(localStorage.getItem(storageKey)) || emptyStorage;
  return data.events;
}

function setEvents(events) {
  if (!localStorage) return;
  localStorage.setItem(storageKey, JSON.stringify({ events }));
}

function addFavoriteEvent(title, eventKey, adminKey) {
  const events = getEvents();
  const exists = events.filter(x => x.eventKey === eventKey).length > 0;
  if (!exists) {
    events.push({ title, eventKey, adminKey });
    setEvents(events);
  }
}


function removeFavoriteEvent(eventKey) {
  let events = getEvents();
  events = events.filter(x => x.eventKey !== eventKey);
  setEvents(events);
  return events;
}

function getFavoriteEvents() {
  return getEvents();
}

export { removeFavoriteEvent, addFavoriteEvent, getFavoriteEvents };
