# Serverless Offline - Lambda Function Urls

## Description

This plugin provides a temporal solution to the issue described [here](https://github.com/dherault/serverless-offline/issues/1382).

### Setup

1. Inside your project's `serverless.yml` file, add the following entry in the `plugins` section.

```yaml
plugins:
  - serverless-offline
  - serverless-offline-lambda-function-urls
```

2. Configure the port where the new server will be running. By default, the server will run on 3003.

```yaml
serverless-offline:
  urlLambdaFunctionsHttpPort: 3003
```

3. Configure a lambda url function. When you add the `url` option, the handler will expose it as a `GET/POST` HTTP endpoint(`/dev/ping`). The HTTP endpoint doesn't go through the API Gateway, which means that you can set your own `timeout` and it will respect it. Traditionally, the API Gateway would timeout after 30 seconds.

```yaml
ping:
  handler: ./src/functions/ping.handler
  url: true
  timeout: 120 # The handler will timeout after 2 minutes and API Gateway won't interrupt it
```

4. Run `serverless offline` and the plugin will be triggerred by the `offline:start:init` event.

```bash
serverless offline start
```
