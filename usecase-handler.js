const path = require("path");
const fs = require("fs");

const generatedUsecasesDirectory = path.join(__dirname, "__usecases__");

module.exports = function(state) {
  return function usecaseHandler(req, res) {
    const usecasePath = path.join(
      generatedUsecasesDirectory,
      state,
      req.params.usecase,
      "index.html"
    );
    if (fs.existsSync(usecasePath)) {
      return res.sendFile(usecasePath);
    } else {
      return res.sendStatus(404);
    }
  };
};
