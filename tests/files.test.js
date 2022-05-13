const { assert } = require('chai')
const fs = require('fs')
const IC = require('../src/IC')

describe('Basic IC instances', function () {
  describe('import type: url', function () {
    let internalIc, file, urlIc
    const TEST_URL = 'https://raw.githubusercontent.com/owise1/ic-js/main/tests/test.ic'
    const TEST_2_URL = 'https://raw.githubusercontent.com/owise1/ic-js/main/tests/test2.ic'
    before(async function () {
      file = await fs.promises.readFile('./tests/test.ic', 'utf8')
      internalIc = new IC
    })
    it('has a test file to import', function () {
      assert.isString(file)
    })
    it('imports the test file as string', async function () {
      await internalIc.import(file)
      assert.ok(internalIc.all().filter(t => t.to === 'IC').length > 0)
    })
    it('fetches the url of the same file', async function () {
      urlIc = new IC
      await urlIc.import(TEST_URL)
      assert.ok(internalIc.all().length === urlIc.all().length)
    })
    it('will not fetch the same url twice', async function () {
      await urlIc.import(TEST_URL)
      assert.ok(internalIc.all().length === urlIc.all().length)
    })
    it('will fetch however if it has the same info', async function () {
      await internalIc.import(TEST_URL)
      assert.ok(internalIc.all().length === urlIc.all().length * 2)
    })
    it('will fetch internally linked ics at the top level', async function () {
      const ic = new IC
      const newFile = file + `\n` + TEST_2_URL
      await ic.import(newFile)
      assert.ok(ic.all().length > internalIc.all().length)
    })
    it('will fetch internally linked ics that are tags too', async function () {
      const icStr = `linked Ics\n+${TEST_URL}`
      const ic = new IC
      await ic.import(icStr)
      internalIc = new IC
      await internalIc.import(file)
      assert.equal(ic.all().length - 1, internalIc.all().length)
    })
  })
})