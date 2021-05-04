const { assert } = require('chai')
const IPFS = require('ipfs')
// const IpfsClient = require('ipfs-http-client')
const IC = require('../src/ic')

describe('Two IC instances', function () {
  let ic1, ic2
  const to = 'things that make me feel better'
  const from1 = 'sleep'
  before(async function () {
    this.timeout(5000)
    // Create the first peer
    const ipfs1_config = { repo: './ipfs1' }
    const ipfs1 = await IPFS.create(ipfs1_config)
    // Create the second peer
    const ipfs2_config = {
      repo: './ipfs2',
      config: {
        Addresses: {
          Swarm: [
            '/ip4/0.0.0.0/tcp/4012',
            '/ip4/127.0.0.1/tcp/4013/ws'
          ],
          API: '/ip4/127.0.0.1/tcp/5012',
          Gateway: '/ip4/127.0.0.1/tcp/9191'
        }
      }
    }
    const ipfs2 = await IPFS.create(ipfs2_config)

    ic1 = await IC.create({
      ipfs: ipfs1
    })

    ic2 = await IC.create({
      ipfs: ipfs2,
      orbitdb: {
        directory: './orbitdb2',
        db: ic1.db().address.toString()
      }
    })
  })

  it('have same address', function () {
    assert.equal(ic2.db().db, ic1.db().db)
  })

  describe('Tags', function () {
    it('adding a tag', async function () {
      await ic1.tag(to, from1)
      const all = ic1.all()
      assert.lengthOf(all, 1)
    })
    it('the other instance gets it via "data" event', function (done) {
      this.timeout(3000)
      const fn = all => {
        assert.lengthOf(all, 1)
        ic2.off('data', fn)
        done()
      }
      ic2.on('data', fn)
    })
  })
  describe('Export/Import', function () {
    let ice, iceLines
    const noFrom = 'push notifications'
    before(async function () {
      await ic1.tag(to, 'finishing a project')
      await ic1.tag(to, 'swimming in a river')
      await ic1.tag(to, noFrom, false)
      ice = ic1.export()
      iceLines = ice.split("\n")
    })
    it('test db has the correct number of entries', function () {
      assert.lengthOf(ic1.all(), 4)
    })
    describe('export', function () {
      it('is string', function () {
        assert.ok(typeof ice === 'string')
      })
      it('first line is dId', function () {
        const regex = new RegExp(`^_${ic1.id}`)
        assert.ok(regex.test(ice))
      })
      it('next line is first "to"', function () {
        assert.equal(iceLines[1], to)
      })
      it('has a correct yes line', function () {
        const regex = new RegExp(`\\+${from1}`)
        assert.ok(regex.test(ice))
      })
      it('has a correct no line', function () {
        const regex = new RegExp(`\\-${noFrom}`)
        assert.ok(regex.test(ice))
      })
    })
  })
})
