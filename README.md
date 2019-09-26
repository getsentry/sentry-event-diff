# sentry-event-diff

The tool that let you diff JS SDK events between multiple browsers that run locally or on BrowserStack.
Given 2 SDK urls (eg. one from CDN, one fresh bundle stored on S3), it'll show the differences between each corresponding usecase.
Each usecase is a single way to throw an exception and it provides enough confidence to know, that your core changes
didn't break a way in which SDK catches and translates them into the events.

## Setup

1. Deploy to EC2
2. SSH into the instance
3. `node app.js <old-sdk-url> <new-sdk-url>
4. Move process to the background
5. `BROWSERSTACK_USERNAME=<username> BROWSERSTACK_ACCESS_KEY=<key> node run.js`
or locally:
`HOST=<ec2-instance-url> BROWSERSTACK_USERNAME=<username> BROWSERSTACK_ACCESS_KEY=<key> node run.js`

### Locally

Run the app as explained above and go to `http://localhost:3000/old` first and then to `http://localhost:3000/new`.
Observe the diff inside the terminal output.

### Usecases

To add a new usecase copy/paste one of previous directories in `usecases` directory and change its behavior. The rest is automatic.
