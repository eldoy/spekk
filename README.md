# Spekk

Javascript test runner for NodeJS applications.

### Install

```
# Install globally
npm i -g spekk

# Install locally in app
npm i spekk
```

### Usage

Add your tests in `spec/tests`. Data and test helpers can be added in `spec/data` and `spec/lib` respectively, they will be loaded automatically if they exist.

Optionally create a spekk file in `spec/spekk.js`. The `spec/spekk.js` file must export a function that returns a Javascript object with the things you need for your tests:

```js
module.exports = async function() {
  // Set up db connection for example
  var db = await db({ name: 'spekk-test' })

  // Run before run if defined
  async function setup() {}

  // Run after run if defined
  async function teardown() {}

  return { db, setup, teardown }
}
```

Whatever the spekk file returns will be available in the tests:

```js
// spec/tests/spec-test.js
it('should test something', async function({ t, db, data, lib }) {
  var user = await db('user').get()
  t.ok(user.id)
})
```

The `t` in the function above is included automatically and is [Node assert.](https://nodejs.org/api/assert.html)

There are some built in global functions you can use in [your tests](https://github.com/eldoy/spekk/blob/master/spec/tests/spekk-test.js):

* `it` or `test`- defines a test which will be run
* `xit` or `x` - skips a test and does nothing
* `only` or `o` - only these tests will be run
* `beforeEach` - run before each test
* `afterEach` - run after each test
* `beforeAll` - run before all tests in a file
* `afterAll` - run after all tests in a file

Run the tests with:
```
spekk
```
The name of the test will be taken from the file name, so if your test file is named `project-test.js`, then the test name will be `Project Test`.

This is a full example, stored in `spec/tests/spekk-test.js`:
```js
// Setup is run before each test
beforeEach(async function({ t }){
  // Do something before each test
})

// This test is being run
it('should test it', async ({ t }) => {
  t.ok(true)
})

// This test is skipped
xit('should test it', async ({ t }) => {
  t.ok(true)
})

// Only this test will be run
only('should test it', async ({ t }) => {
  t.ok(true)
})
```

To run only certain tests, you can match with a regex pattern:
```
# Match any test file name that includes 'pattern'
spekk pattern

# Multiple patterns file, comma separated
spekk todo,project
```

If you want automatically run the tests when you save a file you can use [nodemon:](https://github.com/remy/nodemon)

```
nodemon --exec spekk
```

Add this to you `package.json` file to run with `npm`:
```json
"scripts": {
  "test": "nodemon -q --exec spekk"
}
```
Then run with `npm run test` in your application.

MIT Licensed. Enjoy!
