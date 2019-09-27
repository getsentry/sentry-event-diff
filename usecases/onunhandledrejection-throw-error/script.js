function foo() {
  bar();
}

function bar() {
  new Promise(function (resolve, reject) {
    throw new TypeError("wat");
  });
}

foo();