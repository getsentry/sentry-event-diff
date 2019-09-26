function foo() {
  bar();
}

function bar() {
  try {
    throw new Error('wat');
  } catch (o_O) {
    Sentry.captureMessage(o_O);
  }
}

foo();