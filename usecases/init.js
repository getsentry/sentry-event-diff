var pathSegments = window.location.pathname
  .split("/")
  .filter(function(segment) {
    return !!segment;
  });

var usecase = pathSegments[pathSegments.length - 1];
var unhandledrejectionSupport = "onunhandledrejection" in window;
var eventDelivered = false;

setTimeout(function() {
  if (!eventDelivered && !unhandledrejectionSupport) {
    console.log("No onunhandledrejection support. Skipping usecase:", usecase);
    window.parent.postMessage("sent", "*");
  }
}, 1000);

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
        eventDelivered = true;
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

Sentry.configureScope(scope => {
  const obj = {
    a: "wat"
  };
  obj.c = obj;
  obj.b = [obj, obj.a, obj.c, "ok"];

  obj.foo = {
    bar: {
      baz: {
        qux: {
          quaz: [1, 2, 3]
        }
      }
    }
  };

  obj.foo.bar.baz = obj.foo;

  scope.setUser({
    foo: "bar",
    baz: "qux"
  });

  scope.setExtra("foo", obj);

  scope.setExtras({
    foo: "bar",
    baz: obj
  });

  scope.setContext("foo", obj);

  scope.addBreadcrumb({
    type: "foo",
    message: "ok",
    data: obj
  });
});

if (!"onunhandledrejection" in window) {
  console.log("No onunhandledrejection support. Skipping usecase:", usecase);
  window.parent.postMessage("sent", "*");
}
