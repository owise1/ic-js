const { assert } = require('chai')
const IPFS = require('ipfs')
// const IpfsClient = require('ipfs-http-client')
const IC = require('../src/ic')

describe('Two IC instances', function () {
  let ic1, ic2
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

  describe('Adding a tag', function () {
    it('adds a tag', async function () {
      await ic1.tag('things that make me feel better', 'sleep')
      const all = ic1.all()
      assert.lengthOf(all, 1)
    })
    it('the other instance gets it via "data" event', function (done) {
      this.timeout(3000)
      ic2.on('data', all => {
        assert.lengthOf(all, 1)
        done()
      })
    })
  })
})
