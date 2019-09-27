function foo() {
  bar();
}

function bar() {
  throw new TypeError("wat");
}

var baz = document.getElementById('foo');
baz.addEventListener('click', function fooHandler() {
  foo();
});
baz.click();