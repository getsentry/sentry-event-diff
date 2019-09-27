function foo() {
  bar();
}

function bar() {
  throw "wat";
}

var baz = document.createElement('span');
baz.addEventListener('click', function () {
  foo()
})
baz.dispatchEvent(new MouseEvent("click"));
