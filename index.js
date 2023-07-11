import {resolve, join} from 'node:path'
import {cwd} from 'node:process'
import {existsSync} from 'node:fs'

export default class ServerlessOfflineLambdaFunctionUrls {
  constructor(serverless) {
    const configuration = serverless.config.serverless.configurationInput
    this.serverless = serverless
    this.configuration = configuration
    this.hooks = {
      'offline:start:init': () => this.init(),
    }
  }
  getLambdas(functions) {
    return Object.entries(functions).reduce(
      (lambdas, [functionKey, functionDefinition]) => [
        ...lambdas,
        {
          functionKey,
          functionDefinition: {
            ...functionDefinition,
            handler: this.getTranspiledHandlerFilepath(functionDefinition.handler),
          },
        },
      ],
      []
    )
  }
  filterNonUrlEnabledFunctions(configuration) {
    return Object.entries(configuration.functions).reduce((functions, [functionKey, functionDefinition]) => {
      if (!functionDefinition.url) {
        return functions
      }
      return {...functions, [functionKey]: functionDefinition}
    }, {})
  }
  getEvents(functions) {
    const stage = this.getStage()
    return Object.entries(functions).reduce((events, [functionKey, {handler}]) => {
      const path = `/${stage}/${encodeURIComponent(functionKey)}`
      return [
        ...events,
        {functionKey, handler, http: {routeKey: `GET ${path}`, payload: '2.0', isHttpApi: true, path, method: 'GET'}},
        {functionKey, handler, http: {routeKey: `POST ${path}`, payload: '2.0', isHttpApi: true, path, method: 'POST'}},
      ]
    }, [])
  }
  getStage() {
    return this.serverless.variables.options?.stage ?? this.configuration.provider?.stage
  }
  mergeServerlessOfflineOptions(options) {
    const stage = this.getStage()
    const serverlessOfflineOptions = this.configuration?.custom?.['serverless-offline'] ?? {}
    return {
      ...serverlessOfflineOptions,
      stage,
      host: serverlessOfflineOptions['host'] ?? '127.0.0.1',
      httpPort: serverlessOfflineOptions['urlLambdaFunctionsHttpPort'] ?? 3003,
      ...options,
    }
  }
  getTranspiledHandlerFilepath(handler) {
    const webpackDir = existsSync(this.getFullPath('.webpack'))
    if (webpackDir) {
      return join('.webpack', 'service', handler)
    }
    const esbuildDir = existsSync(this.getFullPath('.esbuild'))
    if (esbuildDir) {
      return join('.esbuild', '.build', handler)
    }

    return handler
  }
  getFullPath(...args) {
    return resolve(cwd(), ...args)
  }
  async init() {
    const {default: Lambda} = await import(
      this.getFullPath('node_modules', 'serverless-offline', 'src', 'lambda', 'Lambda.js')
    )
    const {default: Http} = await import(
      this.getFullPath('node_modules', 'serverless-offline', 'src', 'events', 'http', 'Http.js')
    )
    const functions = this.filterNonUrlEnabledFunctions(this.configuration)

    const lambda = new Lambda(this.serverless, this.mergeServerlessOfflineOptions({noTimeout: true}))
    lambda.create(this.getLambdas(functions))

    const http = new Http(this.serverless, this.mergeServerlessOfflineOptions(), lambda)

    await http.createServer()

    http.create(this.getEvents(functions))
    http.createResourceRoutes()
    http.create404Route()

    await http.start()
  }
}
