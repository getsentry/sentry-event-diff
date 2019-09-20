const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const snapshotHandler = require("./snapshot-handler");
const usecaseHandler = require("./usecase-handler");

app.use(cors());

app.set("views", "./usecases");
app.set("view engine", "ejs");

// Server
app.post(
  "/api/:_/store",
  bodyParser.text({
    size: "200kb"
  }),
  snapshotHandler
);

// Client
app.get("/go", function(req, res) {
  return res.render("index", { usecases: getUsecases() });
});
app.get("/list/:format", function(req, res) {
  getUsecases().map(f => `http://localhost:${port}/usecase/${f.name}/`);

  if (req.params.format === "json") {
    return res.json(dirs);
  } else {
    return res.send(dirs);
  }
});
app.use("/usecase", express.static(path.join(__dirname, "usecases")));
app.get("/usecase/:usecase/", usecaseHandler);

function getUsecases() {
  return fs
    .readdirSync(path.join(__dirname, "usecases"), { withFileTypes: true })
    .filter(f => f.isDirectory());
}

app.listen(port, () =>
  console.log(`\nSentry Event Diffing Service listening on port ${port}\n`)
);
