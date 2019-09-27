function foo() {
  bar();
}

function bar() {
  throw "wat";
}

setTimeout(function() {
  foo();
}, 0);
