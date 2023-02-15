const { assert } = require('chai')
const fs = require('fs')
const IC = require('../src/IC')

describe('the number part of the ic file', function () {
  let ic
  before(async function () {
    file = await fs.promises.readFile('./tests/digits.ic', 'utf8')
    ic = new IC
    await ic.import(file)
  })
  it('has a test file to import', function () {
    assert(ic.all().length > 0)
  })
  it('properly parses the trailing digits', function () {
    const tag = ic.findTagged(['ic'])[0]
    assert(!/\d/.test(tag), 'tag should not have a number')
  })
})