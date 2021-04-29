const { v4: uuidv4 } = require('uuid')
const EventEmitter = require('./eventemitter')
const OrbitDB = require('orbit-db')
const { mergeDeepRight } = require('ramda')

class IC extends EventEmitter {
  constructor (db) {
    super()
    this._db = db
    console.log('ii');
  }
  db () {
    return this._db
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
    const dbAddr = options.orbitdb.db || uuidv4()
    const db = await orbitdb.log(dbAddr)
    return new IC(db)
  }
}

module.exports = IC
