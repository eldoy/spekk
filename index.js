process.env.NODE_ENV = 'test'

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const spekkFile = path.join(process.cwd(), 'spec', 'spekk.js')
if (!fs.existsSync(spekkFile)) {
  console.log('⛄ spec/spekk.js file is missing')
  process.exit(0)
}
const spekk = require(spekkFile)
if (typeof spekk != 'function') {
  console.log('⛄ spec/spekk.js must export a function')
  process.exit(0)
}
const { load } = require('conficurse')
const data = load('spec/data')
const lib = load('spec/lib')

const base = path.join(process.cwd(), 'spec', 'tests')
const files = fs.readdirSync(base)

let current
const store = {}
function push(key, obj) {
  if (!store[current]) {
    store[current] = { setup: [], tests: [] }
  }
  store[current][key].push(obj)
}

global.setup = function(fn) {
  push('setup', fn)
}

global.it = function(name, fn) {
  push('tests', { name, fn})
}
global.xit = function(){}

for (const file of files) {
  current = file
  require(path.join(base, file))
}

async function run() {
  console.log(`\n⭐ Starting test suite`)
  console.time('Time elapsed')

  const tools = await spekk() || {}
  if (!tools.options) tools.options = {}
  const sleep = tools.options.time || 0.5
  await new Promise(r => setTimeout(r, sleep * 1000))

  if (!tools.t) tools.t = assert
  if (!tools.data) tools.data = data
  if (!tools.lib) tools.lib = lib

  for (const item in store) {
    const text = item
      .replace(/\.js$/g, '')
      .split('-')
      .map(x => x[0].toUpperCase() + x.slice(1))
      .join(' ')
    console.log(`\n🔥 ${text}`)
    const { setup, tests } = store[item]

    for (const test of tests) {
      if (typeof tools.before == 'function') {
        await tools.before()
      }
      for (const fn of setup) {
        await fn(tools)
      }
      const { name, fn } = test
      try {
        await fn(tools)
        if (name) console.log(`✅ ${name}`)
      } catch (e) {
        if (name) console.log(`❌ ${name}`)
        console.log(e.stack)
        process.exit(0)
      }
      if (typeof tools.after == 'function') {
        await tools.after()
      }
    }
  }
  console.log()
  console.timeEnd('Time elapsed')
  process.exit(0)
}
run()
