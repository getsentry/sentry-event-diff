function foo(e) {
  bar(e);
}

function bar(e) {
  throw e;
}

var baz = document.getElementById('foo');
baz.addEventListener('click', function fooHandler(e) {
  foo(e);
});
baz.click();