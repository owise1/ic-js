const { assert } = require('chai')
const fs = require('fs')
const IC = require('../src/IC')

describe('IC methods', function () {
  let ic
  before(async function () {
    file = await fs.promises.readFile('./tests/methods.ic', 'utf8')
    ic = new IC
    await ic.import(file)
  })
  it('has a test file to import', function () {
    assert(ic.all().length > 0)
  })
  describe('findTagged() method', function () {
    it('by default finds all children with the given parents - 1', function () {
      const children = ic.findTagged(['icfs'])
      assert.lengthOf(children, 3)
    })
    it('by default finds all children with the given parents - 2', function () {
      const children = ic.findTagged(['icfs', 'name'])
      assert.lengthOf(children, 2)
    })
    it('by default finds all children with the given parents - 3!', function () {
      const children = ic.findTagged(['icfs', 'name', 'fun names'])
      assert.lengthOf(children, 1)
    })
  })
})
