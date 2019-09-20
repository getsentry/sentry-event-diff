const wd = require("selenium-webdriver");

const host = process.env.HOST || "http://localhost:3000";
const browserstackUsername = process.env.BROWSERSTACK_USERNAME;
const browserstackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY;

const baseCapabilities = {
  browserName: "IE",
  browser_version: "10.0",
  os: "Windows",
  os_version: "7",
  resolution: "1024x768",
  "browserstack.user": browserstackUsername,
  "browserstack.key": browserstackAccessKey,
  name: "Bstack-[Node] Sample Test"
};

const browsers = [
  {
    browserName: "IE",
    browser_version: "10.0",
    os: "Windows",
    os_version: "7"
  },

  {
    browserName: "IE",
    browser_version: "11.0",
    os: "Windows",
    os_version: "10"
  },

  {
    browserName: "Edge",
    browser_version: "18.0",
    os: "Windows",
    os_version: "10"
  }
].map(b => Object.assign({}, baseCapabilities, b));

async function runBrowser(browser) {
  const driver = new wd.Builder()
    .usingServer("http://hub-cloud.browserstack.com/wd/hub")
    .withCapabilities(browser)
    .build();

  await driver.get(`${host}/go`);
  await driver.wait(wd.until.elementLocated(wd.By.id("done")), 30000);
  await driver.quit();
}

(async function run() {
  for (const browser of browsers) {
    console.log("Running:", browser.browserName, browser.browser_version);
    await runBrowser(browser);
  }

  console.log("Done!");
})();
