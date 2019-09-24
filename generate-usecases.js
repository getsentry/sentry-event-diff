const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");

const usecasesDirectory = path.join(__dirname, "usecases");
const generatedUsecasesDirectory = path.join(__dirname, "__usecases__");

function storeSnapshot(snapshot, snapshotPath) {
  if (!fs.existsSync(snapshotsDirectory)) {
    fs.mkdirSync(snapshotsDirectory);
  }

  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
}

function getUsecases() {
  return fs
    .readdirSync(usecasesDirectory, { withFileTypes: true })
    .filter(f => f.isDirectory())
    .map(f => f.name);
}

function generateUsecasesState(state, sdkUrl) {
  const statePath = path.join(generatedUsecasesDirectory, state);
  fs.mkdirSync(statePath);

  const usecases = getUsecases();
  generateIndex(usecases, state, statePath);
  fs.copyFileSync(
    path.join(usecasesDirectory, "init.js"),
    path.join(statePath, "init.js")
  );
  usecases.forEach(usecase =>
    generateSingleUsecase(usecase, statePath, sdkUrl)
  );
}

function generateIndex(usecases, state, statePath) {
  const index = fs
    .readFileSync(path.join(usecasesDirectory, "index.html"), "utf8")
    .replace(
      "/* IFRAMES_REPLACE */",
      usecases
        .map(usecase => `<iframe src="/${state}/${usecase}/"></iframe>`)
        .join("\n    ")
    );

  fs.writeFileSync(path.join(statePath, "index.html"), index);
}

function generateSingleUsecase(usecase, statePath, sdkUrl) {
  const usecasePath = path.join(statePath, usecase);
  const singleUsecaseDirectory = path.join(usecasesDirectory, usecase);

  fs.mkdirSync(usecasePath);

  const index = fs
    .readFileSync(path.join(singleUsecaseDirectory, "index.html"), "utf8")
    .replace("/* SDK_URL_REPLACE */", sdkUrl);

  fs.writeFileSync(path.join(usecasePath, "index.html"), index);

  fs.readdirSync(singleUsecaseDirectory, { withFileTypes: true })
    .filter(f => f.name.endsWith(".js"))
    .map(f => f.name)
    .forEach(file => {
      fs.copyFileSync(
        path.join(singleUsecaseDirectory, file),
        path.join(usecasePath, file)
      );
    });
}

async function generateUsecases(oldSdkUrl, newSdkUrl) {
  rimraf.sync(generatedUsecasesDirectory);
  fs.mkdirSync(generatedUsecasesDirectory);
  generateUsecasesState("old", oldSdkUrl);
  generateUsecasesState("new", newSdkUrl);
}

(async () => {
  await generateUsecases("oldurl", "newurl");
})();

module.exports = generateUsecases;
