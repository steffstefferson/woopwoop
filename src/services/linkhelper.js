

function createAdminLink(eventKey, adminKey) {
  return `/#/event/${eventKey}/edit/${adminKey}`;
}

function createEventLink(eventKey) {
  return `/#/event/${eventKey}`;
}


export { createAdminLink, createEventLink };
