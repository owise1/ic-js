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
      assert(newIc.all().length === 4)
    })
    it('honors depth option', function () {
      const newIc = ic.seed(['icfs'], { depth: 1 })
      assert(newIc.all().length === 1)
    })
    it('honors depth option 2', function () {
      const newIc = ic.seed(['icfs'], { depth: 2 })
      assert(newIc.all().length === 3)
    })
    it('honors depth option alot', function () {
      const newIc = ic.seed(['icfs'], { depth: 102 })
      assert(newIc.all().length === 4)
    })
  })
})
