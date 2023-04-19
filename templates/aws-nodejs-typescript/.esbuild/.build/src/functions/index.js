var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames
var __hasOwnProp = Object.prototype.hasOwnProperty
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, {get: all[name], enumerable: true})
}
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable})
  }
  return to
}
var __toCommonJS = mod => __copyProps(__defProp({}, '__esModule', {value: true}), mod)

// src/functions/index.ts
var functions_exports = {}
__export(functions_exports, {
  ping: () => ping,
})
module.exports = __toCommonJS(functions_exports)
var wait = sec => new Promise(resolve => setTimeout(resolve, sec * 1e3))
var ping = async event => {
  await wait(45)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    ping,
  })
//# sourceMappingURL=index.js.map
