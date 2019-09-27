function foo() {
  bar();
}

function bar() {
  new Promise(function (resolve, reject) {
    reject(new TypeError("wat"));
  });
}

foo();