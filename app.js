const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 80;

const snapshotsDirectory = path.join(__dirname, "__snapshots__");
const generatedUsecasesDirectory = path.join(__dirname, "__usecases__");
const snapshotHandler = require("./snapshot-handler");
const usecaseHandler = require("./usecase-handler");

app.use(cors());

// Server
app.post(
  "/store",
  bodyParser.text({
    size: "200kb"
  }),
  snapshotHandler
);

// Client
app.get("/old", (req, res) =>
  res.send(path.join(generatedUsecasesDirectory, "/old/index.html"))
);
app.get("/new", (req, res) =>
  res.send(path.join(generatedUsecasesDirectory, "/new/index.html"))
);
app.use("/__usecases__", express.static(path.join(__dirname, "usecases")));
app.get("/usecase/:usecase/", usecaseHandler);

const server = app.listen(port, () =>
  console.log(`\nSentry Event Diffing Service listening on port ${port}\n`)
);

function cleanup() {
  rimraf.sync(snapshotsDirectory);
  rimraf.sync(generatedUsecasesDirectory);

  server.close(function() {
    console.log("Cleanup successful");
    process.exit();
  });
}

process.on("SIGINT", cleanup);
