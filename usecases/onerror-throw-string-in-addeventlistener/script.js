function foo() {
  bar();
}

function bar() {
  throw "wat";
}

var baz = document.getElementById('foo');
baz.addEventListener('click', function foo() {
  foo();
});
baz.click();
