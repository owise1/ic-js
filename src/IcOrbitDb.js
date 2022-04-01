const { v4: uuidv4 } = require('uuid')
const OrbitDB = require('orbit-db')
const { identity, join, mergeDeepRight, groupBy, prop, toPairs, pipe, map, flatten, reverse, uniqBy } = require('ramda')
const IC = require('./ic')

const DELIM = "\n"

class IcOrbitDb extends IC {
  constructor (dId, db, ipfs) {
    super({
      inMemory: false,
      id: dId,
      ipfs
    })
    this._db = db
    const emitData = what => {
      this.emit('data', this.all())
    }
    this._db.events.on('replicated', emitData)
    this._db.events.on('ready', emitData)
    // this._db.events.on('write', console.log)
  }

  db () {
    return this._db
  }

  // orbitDB dependent method
  load () {
    this._db.load()
  }

  async tag () {
    const tag = await super.tag(...arguments)
    await this._db.add(tag)
    this.emit('data', this.all())
    return tag
  }

  all () {
    return this._db.iterator({ limit: -1 })
      .collect()
      .map((e) => e.payload.value)
  }

  static isValidAddress (address) {
    return OrbitDB.isValidAddress(address)
  }

  static async create (opts = {}) {
    const options = mergeDeepRight({
      orbitdb: {
        directory: './orbitdb'
      }
    }, opts)
    if (!options.ipfs) {
      throw new Error('You must pass in an IPFS instance')
    }
    const orbitdb = await OrbitDB.createInstance(options.ipfs, options.orbitdb)
    const dbAddr = options.orbitdb.db || options.name || uuidv4()
    const db = await orbitdb.log(dbAddr, {
      sync: true,
      accessController: {
        write: ['*']
      }
    })
    const instance = new IcOrbitDb(orbitdb.id, db, options.ipfs)
    instance.orbitdb = orbitdb // used for testing
    return instance
  }
}
module.exports = IcOrbitDb
