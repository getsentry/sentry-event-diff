function foo() {
  bar();
}

function bar() {
  throw new TypeError("wat");
}

setTimeout(function() {
  foo();
}, 0);
