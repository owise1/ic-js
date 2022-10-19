const { assert } = require('chai')
const fs = require('fs')
const IC = require('../src/IC')

describe('Seeding', function () {
  let ic
  before(async function () {
    file = await fs.promises.readFile('./tests/seeding.ic', 'utf8')
    ic = new IC
    await ic.import(file)
  })
  it('has a test file to import', function () {
    assert(ic.all().length > 0)
  })
  describe('seed()', function () {
    it('returns a new IC', function () {
      const newIc = ic.seed()
      assert(Array.isArray(newIc.all()))
    })
    it('returns only tags connected to seeds', function () {
      const newIc = ic.seed(['icfs'])
      assert(newIc.all().length === 3)
    })
  })
})
