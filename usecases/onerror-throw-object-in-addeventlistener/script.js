function foo() {
  bar();
}

function bar() {
  throw { wat: "wat" };
}

var baz = document.createElement('span');
baz.addEventListener('click', function () {
  foo()
})
baz.click()
