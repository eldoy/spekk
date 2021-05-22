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