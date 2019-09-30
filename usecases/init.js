var pathSegments = window.location.pathname
  .split("/")
  .filter(function(segment) {
    return !!segment;
  });

var usecase = pathSegments[pathSegments.length - 1];

if (!"onunhandledrejection" in window) {
  console.log('No onunhandledrejection support. Skipping usecase:', usecase);
  return void window.parent.postMessage("sent", "*");
}

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
  transport: IframeTransport,
  attachStacktrace: true,
  beforeSend: function(event) {
    event.__usecase__ = usecase;
    return event;
  }
});