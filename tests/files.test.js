const { assert } = require('chai')
const fs = require('fs')
const IC = require('../src/IC')

describe('Basic IC instances', function () {
  describe('import type: url', function () {
    let internalIc, file, urlIc 
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
      await urlIc.import('https://raw.githubusercontent.com/owise1/ic-js/main/tests/test.ic')
      assert.ok(internalIc.all().length === urlIc.all().length)
    })
    it('will not fetch the same url twice', async function () {
      await urlIc.import('https://raw.githubusercontent.com/owise1/ic-js/main/tests/test.ic')
      assert.ok(internalIc.all().length === urlIc.all().length)
    })
    it('will fetch however if it has the same info', async function () {
      await internalIc.import('https://raw.githubusercontent.com/owise1/ic-js/main/tests/test.ic')
      assert.ok(internalIc.all().length === urlIc.all().length * 2)
    })
  })
})