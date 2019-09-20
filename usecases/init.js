var pathSegments = window.location.pathname
  .split("/")
  .filter(function(segment) {
    return !!segment;
  });

var usecase = pathSegments[pathSegments.length - 1];

function IframeTransport() {}

IframeTransport.prototype.sendEvent = function(event) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        window.parent.postMessage("sent", "*");
        resolve({ status: 200 });
      }
      reject(request);
    };

    request.open("POST", "/store");
    request.send(JSON.stringify(event));
  });
};

Sentry.init({
  dsn: "http://whatever@really.com/1337",
  beforeSend: function(event) {
    event.__usecase__ = usecase;
    delete event.event_id;
    return event;
  },
  transport: IframeTransport
});
