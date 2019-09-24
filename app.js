const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const snapshotsDirectory = path.join(__dirname, "__snapshots__");
const generatedUsecasesDirectory = path.join(__dirname, "__usecases__");
const snapshotHandler = require("./snapshot-handler");
const usecaseHandler = require("./usecase-handler");
const generateUsecases = require("./generate-usecases");

const oldSdkUrl = process.argv[2];
const newSdkUrl = process.argv[3];

if (!oldSdkUrl || !newSdkUrl) {
  console.log("Usage: node run.js <old-sdk-url> <new-sdk-url>");
  process.exit(1);
}

generateUsecases(oldSdkUrl, newSdkUrl);

console.log("\nUsecases generated.");

app.use(cors());

// Server
app.post(
  "/store",
  bodyParser.text({
    size: "200kb"
  }),
  snapshotHandler
);

app.get("/", (req, res) => res.send("hi"));

// Client
app.use("/old", express.static(path.join(__dirname, "__usecases__/old")));
app.get("/old", (req, res) =>
  res.sendFile(path.join(generatedUsecasesDirectory, "/old/index.html"))
);
app.get("/old/:usecase", usecaseHandler("old"));

app.use("/new", express.static(path.join(__dirname, "__usecases__/new")));
app.get("/new", (req, res) =>
  res.sendFile(path.join(generatedUsecasesDirectory, "/new/index.html"))
);
app.get("/new/:usecase", usecaseHandler("new"));

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
