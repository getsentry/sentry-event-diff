const wd = require("selenium-webdriver");

const got = require("got");
const browserstackUsername = process.env.BROWSERSTACK_USERNAME;
const browserstackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY;

const oldSdkUrl = process.argv[2];
const newSdkUrl = process.argv[3];

if (!browserstackUsername || !browserstackAccessKey) {
  console.log("BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY are required");
  process.exit(1);
}

if (!oldSdkUrl || !newSdkUrl) {
  console.log("Usage: node run.js <old-sdk-url> <new-sdk-url>");
  process.exit(1);
}

const baseCapabilities = {
  resolution: "1024x768",
  "browserstack.user": browserstackUsername,
  "browserstack.key": browserstackAccessKey,
  name: "sentry-event-diff"
};

const browsers = require("./browsers").map(b =>
  Object.assign({}, baseCapabilities, b)
);

async function runBrowser(browser, ip, state) {
  if (state !== "old" || state !== "new") {
    console.log('Possible states are only: "old" and "new"');
    process.exit(1);
  }

  const driver = new wd.Builder()
    .usingServer("http://hub-cloud.browserstack.com/wd/hub")
    .withCapabilities(browser)
    .build();

  // IE10/IE11 requires protocol for raw IP addresses
  await driver.get(`http://${ip}/${state}`);
  await driver.wait(wd.until.elementLocated(wd.By.id("done")), 30000);
  await driver.quit();
}

(async function run() {
  const icanhazip = await got("https://icanhazip.com");
  const ip = icanhazip.body.trim();

  await generateUsecases(oldSdkUrl, newSdkUrl);

  for (const browser of browsers) {
    const state = "old";
    console.log(
      "Running:",
      oldSdkUrl,
      browser.browserName,
      browser.browser_version
    );
    await runBrowser(browser, ip, "old");
  }

  for (const browser of browsers) {
    console.log(
      "Running:",
      newSdkUrl,
      browser.browserName,
      browser.browser_version
    );
    await runBrowser(browser, ip, "new");
  }

  console.log("Done!");
})();
