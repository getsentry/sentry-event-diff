var pathSegments = window.location.pathname
  .split("/")
  .filter(function(segment) {
    return !!segment;
  });

Sentry.init({
  dsn: "http://whatever@localhost:3000/1337",
  beforeSend: function(event) {
    event.__usecase__ = pathSegments[pathSegments.length - 1];
    delete event.event_id;
    return event;
  },
  transport: Sentry.Transports.XHRTransport
});
