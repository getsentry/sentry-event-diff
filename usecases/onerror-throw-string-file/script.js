function foo() {
  bar();
}

function bar() {
  throw "wat";
}

foo();
