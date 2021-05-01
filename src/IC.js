const { v4: uuidv4 } = require('uuid')
const EventEmitter = require('./eventemitter')
const OrbitDB = require('orbit-db')
const { mergeDeepRight } = require('ramda')

class IC extends EventEmitter {
  constructor (dId, db) {
    super()
    this._db = db
    this.id = dId 
  }
  db () {
    return this._db
  }

  load () {
    this._db.load()
  }

  async tag (from, to, yesNo = '+') {
    await this._db.add({
      from: this.clean(from),
      to: this.clean(to),
      yesNo: !yesNo || yesNo === '-' ? '-' : '+',
      time: new Date().getTime(),
      dId: this.id
    })
  }

  all () {
    return this._db.iterator({ limit: -1 })
      .collect()
      .map((e) => e.payload.value)
  }

  clean (str) {
    return str.toLowerCase().replace(/[A-Z/\\%#()<>{}[\]:?@!$&*+,;=|^`]/g, '').slice(0, 50)
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
    return new IC(orbitdb.id, db)
  }
}

module.exports = IC
