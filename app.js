const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const uaParser = require("ua-parser-js");
const md5 = require("md5");
const jsonDiff = require("json-diff");
const app = express();
const port = 3000;

/**
 * BOOTSTRAP
 **/

app.use(cors());
app.use(
  bodyParser.text({
    size: "200kb"
  })
);
app.post("/store", snapshotHandler);

app.listen(port, () =>
  console.log(
    `\nSentry Event Diffing Service listening on http://localhost:${port}/store\n`
  )
);

/**
 * ACTUAL WORK
 **/

const eventNameRegexp = /_BEGIN_([a-zA-Z\-]+)_END_/;
const snapshotsDirectory = path.join(__dirname, "__snapshots__/");

function snapshotHandler(req, res) {
  const body = req.body;
  let name;

  try {
    [_, name] = eventNameRegexp.exec(body);
  } catch (e) {
    console.log("Unidentifiable event");
    return res.sendStatus(400);
  }

  const ua = uaParser(req.headers["user-agent"]);
  const sdk = JSON.parse(req.body).sdk;
  const snapshot = { ua, sdk, name, body };
  const snapshotFilename = getSnapshotFilename(snapshot);
  const snapshotPath = path.join(snapshotsDirectory, snapshotFilename);

  if (fs.existsSync(snapshotPath)) {
    console.log(`Snapshot Found: ${snapshotFilename}`);
    const content = JSON.parse(fs.readFileSync(snapshotPath));
    console.log(
      jsonDiff.diffString(JSON.parse(content.body), JSON.parse(body))
    );
  } else {
    console.log(`New Snapshot: ${snapshotFilename}`);
    storeSnapshot(snapshot, snapshotPath);
  }

  res.sendStatus(200);
}

function getSnapshotFilename(snapshot) {
  return `${snapshot.sdk.name}-${snapshot.sdk.version}-${
    snapshot.ua.browser.name
  }-${snapshot.ua.browser.major || snapshot.browser.version}-${
    snapshot.name
  }.json`;
}

function storeSnapshot(snapshot, snapshotPath) {
  if (!fs.existsSync(snapshotsDirectory)) {
    fs.mkdirSync(snapshotsDirectory);
  }

  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot));
}
