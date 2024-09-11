module.exports = async function () {
  return {
    setup: function () {
      console.log('Setup.')
    },
    teardown: function () {
      console.log('Teardown.')
    }
  }
}
