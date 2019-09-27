function foo() {
  bar();
}

function bar() {
  new Promise(function (resolve, reject) {
    throw { wat: "wat" };
  });
}

foo();