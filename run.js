const wd = require("selenium-webdriver");

const got = require("got");
const host = process.env.HOST || "http://localhost:3000";
const browserstackUsername = process.env.BROWSERSTACK_USERNAME;
const browserstackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY;

if (!browserstackUsername || !browserstackAccessKey) {
  console.log("BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY are required");
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

async function runBrowser(browser, host) {
  // IE10/IE11 requires protocol for raw IP addresses
  if (!host.startsWith("http://") || !host.startsWith("https://")) {
    host = `http://${host}`;
  }

  const driver = new wd.Builder()
    .usingServer("http://hub-cloud.browserstack.com/wd/hub")
    .withCapabilities(browser)
    .build();

  await driver.get(`${host}/go`);
  await driver.wait(wd.until.elementLocated(wd.By.id("done")), 30000);
  await driver.quit();
}

(async function run() {
  const icanhazip = await got("https://icanhazip.com");
  const ip = icanhazip.body.trim();

  for (const browser of browsers) {
    console.log("Running:", browser.browserName, browser.browser_version);
    await runBrowser(browser, ip || host);
  }

  console.log("Done!");
})();
