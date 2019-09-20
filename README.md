```js
# Run the server
$ node app.js
```

Go to: http://localhost:3000/go to trigger locally or to use browserstack (ngrok has a request limit, so need to deploy it somewhere - TBD):

```js
$ ngrok http 3000
$ HOST=<ngrok-url> BROWSERSTACK_ACCESS_KEY=<key> BROWSERSTACK_USERNAME=<username> node run.js
```
