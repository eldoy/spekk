// Set to true to see flow:
var LOG = 0
function log(msg) {
  if (LOG) console.log(msg)
}

// Do some setup before each test
beforeEach(async function ({ t }) {
  log('beforeEach.')
  t.ok(true)
})

// Do some teardown after each test
afterEach(async function ({ t }) {
  log('afterEach.')
  t.ok(true)
})

// Do something once before all tests
beforeAll(async function ({ t }) {
  log('beforeAll.')
  t.ok(true)
})

// Do something once after all tests
afterAll(async function ({ t }) {
  log('afterAll.')
  t.ok(true)
})

// This test is being run
it('should test it', async ({ t }) => {
  log('Test 1.')
  t.ok(true)
})

// This test is skipped
it('should test it', async ({ t }) => {
  log('Test 2.')
  t.ok(true)
})

// Only this test will be run
it('should test it', async ({ t }) => {
  log('Test 3.')
  t.ok(true)
})
