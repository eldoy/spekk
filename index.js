process.env.NODE_ENV ??= 'test'

var fs = require('node:fs')
var path = require('node:path')
var assert = require('node:assert')
var spekkFile = path.join(process.cwd(), 'spec', 'spekk.js')
if (fs.existsSync(spekkFile)) {
  var spekk = require(spekkFile)
}
if (typeof spekk != 'function') {
  var spekk = function () {}
}
var { load } = require('conficurse')
var data = load('spec/data')
var lib = load('spec/lib')

var base = path.join(process.cwd(), 'spec', 'tests')
var files = fs.readdirSync(base)

var patterns = process.argv[2]
if (patterns) {
  patterns = patterns.split(',').map((x) => new RegExp(x.trim(), 'ig'))
}

var current
var store = {}
function push(key, obj) {
  if (!store[current]) {
    store[current] = {
      beforeEach: [],
      afterEach: [],
      beforeAll: [],
      afterAll: [],
      tests: [],
      only: []
    }
  }
  store[current][key].push(obj)
}

global.beforeAll = function (fn) {
  push('beforeAll', fn)
}

global.afterAll = function (fn) {
  push('afterAll', fn)
}

global.beforeEach = function (fn) {
  push('beforeEach', fn)
}

global.afterEach = function (fn) {
  push('afterEach', fn)
}

global.it = global.test = function (name, fn) {
  push('tests', { name, fn })
}

global.only = global.o = function (name, fn) {
  push('only', { name, fn })
}

global.xit = global.x = function () {}

for (var file of files) {
  current = file
  if (!patterns || patterns.some((r) => r.test(file))) {
    require(path.join(base, file))
  }
}

async function run() {
  console.log(`\n⭐ Starting test suite`)
  console.time('Time elapsed')

  var tools = (await spekk({ data, lib })) || {}
  if (!tools.options) tools.options = {}
  var sleep = tools.options.time || 0.5
  await new Promise((r) => setTimeout(r, sleep * 1000))

  if (!tools.t) tools.t = assert
  if (!tools.data) tools.data = data
  if (!tools.lib) tools.lib = lib

  if (typeof tools.setup == 'function') {
    await tools.setup()
  }

  for (var item in store) {
    var text = item
      .replace(/\.js$/g, '')
      .split('-')
      .map((x) => (x[0].toUpperCase() + x.slice(1)).replace('.', ' '))
      .join(' ')
    console.log(`\n🔥 ${text}`)

    var { beforeEach, afterEach, beforeAll, afterAll, tests, only } =
      store[item]

    if (only.length) {
      tests = only
    }

    for (var fn of beforeAll) {
      await fn(tools)
    }

    for (var test of tests) {
      for (var fn of beforeEach) {
        await fn(tools)
      }
      var { name, fn } = test
      try {
        await fn(tools)
        if (name) console.log(`✅ ${name}`)
      } catch (e) {
        if (name) console.log(`❌ ${name}`)
        console.log(e.stack)
        process.exit()
      }
      for (var fn of afterEach) {
        await fn(tools)
      }
    }
    for (var fn of afterAll) {
      await fn(tools)
    }
    console.log(`\n${tests.length} tests passed.`)
  }

  if (typeof tools.teardown == 'function') {
    await tools.teardown()
  }

  console.log()
  console.timeEnd('Time elapsed')
  process.exit(0)
}
run()
