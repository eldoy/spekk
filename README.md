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

Create the spekk file in `spec/spekk.js`. Add your tests in `spec/tests`. Data and test helpers can be added in `spec/data` and `spec/lib` respectively, they will be loaded automatically if they exist.

The `spec/spekk.js` file must return a function that returns a Javascript object with the things you need for your tests:

```js
module.exports = async function() {
  // Set up db connection for example
  const db = await db({ name: 'spekk-test' })

  // Run before each test if defined
  async function before() {}

  // Run after each test if defined
  async function after() {}

  return { db, before, after }
}
```

Whatever the spekk file returns will be available in the tests:

```js
// spec/tests/spec-test.js
it('should test something', async function({ t, db, data, lib }) {
  const user = await db('user').get()
  t.ok(user.id)
})
```

The `t` in the function above is included automatically and is [Node assert.](https://nodejs.org/api/assert.html)

There are 4 built in global functions you can use in [your tests](https://github.com/eldoy/spekk/blob/master/spec/tests/spekk-test.js):

* `it` or `test`- defines a test which will be run
* `xit` or `x` - skips a test and does nothing
* `only` or `o` - only these tests will be run
* `setup` or `s` - run before each test

Run the tests with:
```
spekk
```
The name of the test will be taken from the file name, so if your test file is named `project-test.js`, then the test name will be `Project Test`.

This is a full example:
```js
// Setup is run before each test
setup(async function({ t }){
  // Do some setup
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
