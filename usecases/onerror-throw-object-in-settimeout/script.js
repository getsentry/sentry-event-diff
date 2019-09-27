function foo() {
  bar();
}

function bar() {
  throw { wat: "wat" };
}

setTimeout(function() {
  foo();
}, 0);
