function foo() {
  bar();
}

function bar() {
  try {
    throw new Error('wat');
  } catch (o_O) {
    Sentry.captureException(o_O);
  }
}

foo();