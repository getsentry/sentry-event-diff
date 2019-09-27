function foo() {
  bar();
}

function bar() {
  throw new TypeError("wat");
}

var baz = document.createElement('span');
baz.addEventListener('click', function () {
  foo()
})
baz.dispatchEvent(new MouseEvent("click"));