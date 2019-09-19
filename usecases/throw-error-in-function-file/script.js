function foo() {
  bar();
}

function bar() {
  baz();
}

function baz() {
  throw new TypeError("wat");
}

foo();
