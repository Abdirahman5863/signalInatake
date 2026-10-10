const ts = require('typescript')
const fs = require('node:fs')
const path = require('node:path')
function load(file, mocks = {}, cache = new Map()) {
  file = path.resolve(file)
  if (cache.has(file)) return cache.get(file).exports
  const module = { exports: {} }; cache.set(file, module)
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText
  const localRequire = name => {
    if (Object.hasOwn(mocks, name)) return mocks[name]
    if (name.startsWith('.') || name.startsWith('@/')) {
      const target = name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(path.dirname(file), name)
      return load(target.endsWith('.ts') ? target : target + '.ts', mocks, cache)
    }
    return require(name)
  }
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports)
  return module.exports
}
module.exports = { load }
