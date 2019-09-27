function foo() {
  bar();
}

function bar() {
  new Promise(function (resolve, reject) {
    reject("wat");
  });
}

foo();