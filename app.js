const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const snapshotsDirectory = path.join(__dirname, "__snapshots__/");
const bootstrapUsecasesTemplate = fs.readFileSync(
  path.join(__dirname, "usecases", "index.html"),
  "utf8"
);
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
app.get("/go", function(req, res) {
  return res.send(
    bootstrapUsecasesTemplate.replace(
      "/* REPLACE_ME */",
      getUsecases()
        .map(x => `<iframe src="${x}"></iframe>`)
        .join("\n    ")
    )
  );
});
app.get("/list", function(req, res) {
  return res.send(
    getUsecases()
      .map(x => `<a href="${x}">${x}</a>`)
      .join("<br/>")
  );
});
app.use("/usecase", express.static(path.join(__dirname, "usecases")));
app.get("/usecase/:usecase/", usecaseHandler);

function getUsecases() {
  return fs
    .readdirSync(path.join(__dirname, "usecases"), { withFileTypes: true })
    .filter(f => f.isDirectory())
    .map(f => `/usecase/${f.name}/`);
}

const server = app.listen(port, () =>
  console.log(`\nSentry Event Diffing Service listening on port ${port}\n`)
);

function cleanup() {
  if (fs.existsSync(snapshotsDirectory)) {
    rimraf.sync(snapshotsDirectory);
  }

  server.close(function() {
    console.log("Cleanup successful");
    process.exit();
  });
}

process.on("SIGINT", cleanup);
