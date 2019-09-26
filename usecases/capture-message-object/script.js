function foo() {
  bar();
}

function bar() {
  try {
    throw { wat: "wat" };
  } catch (o_O) {
    Sentry.captureMessage(o_O);
  }
}

foo();