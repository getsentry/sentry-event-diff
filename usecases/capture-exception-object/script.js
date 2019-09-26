function foo() {
  bar();
}

function bar() {
  try {
    throw { wat: "wat" };
  } catch (o_O) {
    Sentry.captureException(o_O);
  }
}

foo();