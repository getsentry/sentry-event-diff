function foo() {
  bar();
}

function bar() {
  throw { wat: "wat" };
}

foo();
