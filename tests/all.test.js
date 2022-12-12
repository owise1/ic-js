const { assert } = require('chai')
const fs = require('fs')
const IC = require('../src/IC')

describe('all() method', function () {
  let ic
  before(async function () {
    file = await fs.promises.readFile('./tests/all.ic', 'utf8')
    ic = new IC
    await ic.import(file)
  })
  it('has a test file to import', function () {
    assert(ic.all().length > 0)
  })
  it('all() returns all tags', function () {
      const all = ic.all()
      const toYeses = all.filter(t => t.to === 'yes')
      assert.lengthOf(toYeses, 3)
  })
  describe('all({ flatten: true })', function () {
    it('returns only the latest choice for each tag', function () {
      const all = ic.all({ flatten: true })
      const toYeses = all.filter(t => t.to === 'yes')
      assert.lengthOf(toYeses, 1)
      assert.equal(toYeses[0].from, 'is yes')
      assert.equal(toYeses[0].yesNo, '+')
      const toNos = all.filter(t => t.to === 'no')
      assert.lengthOf(toNos, 1)
      assert.equal(toNos[0].from, 'is yes')
      assert.equal(toNos[0].yesNo, '-')
    })
  })
  describe('grouping parents', function () {
    before(async function () {
      file = await fs.promises.readFile('./tests/grouping.ic', 'utf8')
      ic = new IC
      await ic.import(file)
    })
    it('import correctly tags grouped thots', function () {
      assert.lengthOf(ic.all(), 3)
      assert.lengthOf(ic.findTagged(['icfs', 'name']), 1)
      assert.lengthOf(ic.findTagged(['another']), 1)
    })
    describe('exporting', function () {
      it('groups on exports', function () {
        console.log(ic.export())
      })
    })
  })
})
