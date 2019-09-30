function foo(e) {
  bar(e);
}

function bar(e) {
  new Promise(function (resolve, reject) {
    reject(e);
  });
}

var baz = document.getElementById('foo');
baz.addEventListener('click', function fooHandler(e) {
  foo(e);
});
baz.click();