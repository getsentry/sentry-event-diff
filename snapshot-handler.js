const path = require("path");
const fs = require("fs");
const uaParser = require("ua-parser-js");
const jsonDiff = require("json-diff");
const clc = require("cli-color");

const snapshotsDirectory = path.join(__dirname, "__snapshots__");

module.exports = function snapshotHandler(req, res) {
  let event;
  try {
    // Just a silly way to remove differences between /new and /old endpoints ¯\_(ツ)_/¯
    const body = req.body.replace(/\/new\//g, "/_/").replace(/\/old\//g, "/_/");
    event = JSON.parse(body);
  } catch (e) {
    console.log(clc.red("Malformed event: incorrect JSON data"));
    return res.sendStatus(400);
  }

  const usecase = event.__usecase__;

  if (!event.__usecase__) {
    console.log(
      clc.red("Unidentifiable event: missing top-level __usecase__ attribute")
    );
    return res.sendStatus(400);
  }

  if (!event.event_id) {
    console.log(
      clc.red("Incorrect event: missing top-level event_id attribute")
    );
    return res.sendStatus(400);
  }

  // Fields that should be removed as they are either different for every event,
  // do not contribute to the test or are "known changes"
  const filterFields = ["__usecase__", "event_id"];
  filterFields.forEach(field => {
    delete event[field];
  });

  // NOTE: This feature is not necessary right now
  //
  // const sdk = {
  //   name: event.sdk.name,
  //   version: event.sdk.version
  // };
  // const snapshot = { ua, sdk, usecase, event };
  const ua = uaParser(req.headers["user-agent"]);
  const snapshot = { ua, usecase, event };
  const snapshotFilename = getSnapshotFilename(snapshot);
  const snapshotPath = path.join(snapshotsDirectory, snapshotFilename);

  // NOTE: This feature is not necessary right now
  //
  // const overwrite = event.__overwrite__;
  // delete event.__overwrite__;
  // if (overwrite && fs.existsSync(snapshotPath)) {
  //   console.log(clc.yellow(`Snapshot Overwritten: ${snapshotFilename}`));
  //   storeSnapshot(snapshot, snapshotPath);
  //   return res.sendStatus(200);
  // }

  if (fs.existsSync(snapshotPath)) {
    console.log(clc.blue(`Snapshot Found: ${snapshotFilename}`));
    const content = JSON.parse(fs.readFileSync(snapshotPath));
    const diff = jsonDiff.diffString(content.event, event);
    if (!diff) {
      console.log(clc.green("✓ Snapshot Match"));
    } else {
      console.log(clc.red("𝗫 Snapshot Mismatch"));
      console.log(diff);
      // Move cursor 1 line up
      process.stdout.write("\033[1A\r");
    }
  } else {
    console.log(clc.yellow(`New Snapshot: ${snapshotFilename}`));
    storeSnapshot(snapshot, snapshotPath);
  }

  return res.sendStatus(200);
};

function getSnapshotFilename(snapshot) {
  return `${snapshot.ua.os.name}-${snapshot.ua.os.version}-${
    snapshot.ua.browser.name
  }-${snapshot.ua.browser.major}-${snapshot.usecase}.json`;
}

function storeSnapshot(snapshot, snapshotPath) {
  if (!fs.existsSync(snapshotsDirectory)) {
    fs.mkdirSync(snapshotsDirectory);
  }

  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
}
