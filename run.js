const wd = require("selenium-webdriver");
const got = require("got");

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

async function runBrowser(browser, host, state) {
  if (state !== "old" && state !== "new") {
    console.log('Possible states are only: "old" and "new"');
    process.exit(1);
  }

  const driver = new wd.Builder()
    .usingServer("http://hub-cloud.browserstack.com/wd/hub")
    .withCapabilities(browser)
    .build();

  // Remember that IE10/IE11 requires protocol for raw IP addresses!
  await driver.get(`${host}/${state}`);
  await driver.wait(wd.until.elementLocated(wd.By.id("done")), 30000);
  await driver.quit();
}

(async function run() {
  let host = process.env.HOST;

  if (!host) {
    const icanhazip = await got("https://icanhazip.com");
    const ip = icanhazip.body.trim();
    host = `http://${ip}`;
  }

  for (const browser of browsers) {
    console.log(`Old SDK: ${browser.os}-${browser.os_version}-${browser.browserName}-${browser.browser_version || 'unknown'}`);
    await runBrowser(browser, host, "old");
    console.log(`New SDK: ${browser.os}-${browser.os_version}-${browser.browserName}-${browser.browser_version || 'unknown'}`);
    await runBrowser(browser, host, "new");
  }

  console.log("Done!");
})();
