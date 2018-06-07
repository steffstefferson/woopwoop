export default function reportError(msg, err) {
  /* eslint-disable-next-line */
  window.Rollbar && window.Rollbar.error(msg, err);
}
