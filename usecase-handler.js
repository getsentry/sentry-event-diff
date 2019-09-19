const path = require("path");
const fs = require("fs");

const usecasesDirectory = path.join(__dirname, "usecases/");

module.exports = function usecaseHandler(req, res) {
  const usecasePath = path.join(
    usecasesDirectory,
    req.params.usecase,
    "index.html"
  );
  if (fs.existsSync(usecasePath)) {
    return res.sendFile(usecasePath);
  } else {
    return res.sendStatus(404);
  }
};
