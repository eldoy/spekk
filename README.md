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

There are 3 built in global functions you can use in your tests:

* `it` - defines a test which will be run
* `xit` - skips a test and does nothing
* `setup` - run before each test

Run the tests with:
```
spekk
```

To run only certain tests, you can match with a regex pattern:
```
# Match any test file name that includes 'pattern'
spekk pattern

# Multiple patterns file
spekk "todo|project"
```

If you want automatically run the tests when you save a file you can use [nodemon.](https://github.com/remy/nodemon) Add this to you `package.json` file:
```json
"scripts": {
  "test": "nodemon -q spekk"
}
```

MIT Licensed. Enjoy!
