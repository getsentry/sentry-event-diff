function foo() {
  bar();
}

function bar() {
  baz();
}

function baz() {
  throw "wat";
}

foo();
