const { assert } = require('chai')
const IPFS = require('ipfs')
// const IpfsClient = require('ipfs-http-client')
const IC = require('../src/ic')

describe('Two IC instances', function () {
  let ic1, ic2, ipfs1, ipfs2
  const to = 'things that make me feel better'
  const from1 = 'sleep'
  before(async function () {
    this.timeout(5000)
    // Create the first peer
    const ipfs1_config = { repo: './ipfs1' }
    ipfs1 = await IPFS.create(ipfs1_config)
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
    ipfs2 = await IPFS.create(ipfs2_config)

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
    after(async function () {
      await ic2.orbitdb.disconnect()
    })
  })
  describe('Export/Import', function () {
    let ice, iceLines, exportItemCount, exportCid
    const noFrom = 'push notifications'
    before(async function () {
      await ic1.tag(to, 'finishing a project')
      await ic1.tag(to, 'swimming in a river')
      await ic1.tag(to, noFrom, false)
      exportItemCount = 4
      ice = ic1.export()
      iceLines = ice.split("\n")
    })
    it('test db has the correct number of entries', function () {
      assert.lengthOf(ic1.all(), exportItemCount)
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
      it('exports to ipfs', async function () {
        const res = await ic1.exportToIpfs()
        exportCid = res.cid.toString()
        assert.ok(exportCid)
      })
    })
    describe('import', function () {
      before(async function () {
        ic2 = await IC.create({
          ipfs: ipfs2
        })
      })
      it('starts with an empty db', function () {
        assert.lengthOf(ic2.all(), 0)
      })
      it('imports', async function () {
        await ic2.import(ice)
        assert.lengthOf(ic2.all(), exportItemCount)
      })
      it('imports from ipfs', async function () {
        const what = await ic2.import(exportCid)
        assert.ok(what)
      })
      after(async function () {
        await ic2.orbitdb.disconnect()
      })
    })
    describe('import from ipfs', function () {
      before(async function () {
        ic2 = await IC.create({
          ipfs: ipfs2
        })
      })
      it('starts with an empty db', function () {
        assert.lengthOf(ic2.all(), 0)
      })
      it('ignores a bad cid', async function () {
        await ic2.import(exportCid + 'no')
        assert.lengthOf(ic2.all(), 0)
      })
      it('imports from ipfs', async function () {
        await ic2.import(exportCid)
        assert.lengthOf(ic2.all(), exportItemCount)
      })
    })
  })
})
