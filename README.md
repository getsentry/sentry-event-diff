1. Deploy to EC2
2. SSH into the instance
3. `node app.js <old-sdk-url> <new-sdk-url>
4. Move process to the background
5. `BROWSERSTACK_USERNAME=<username> BROWSERSTACK_ACCESS_KEY=<key> node run.js`
or locally:
`HOST=<ec2-instance-url> BROWSERSTACK_USERNAME=<username> BROWSERSTACK_ACCESS_KEY=<key> node run.js`

To add a new usecase copy/paste one of previous directories in `usecases` directory and change its behavior. The rest is automatic.
