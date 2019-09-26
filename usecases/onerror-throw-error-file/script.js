function foo() {
  bar();
}

function bar() {
  throw new Error("wat");
}

foo();
