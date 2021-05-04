const { v4: uuidv4 } = require('uuid')
const EventEmitter = require('./eventemitter')
const OrbitDB = require('orbit-db')
const { join, mergeDeepRight, groupBy, prop, toPairs, pipe, map } = require('ramda')

class IC extends EventEmitter {
  constructor (dId, db) {
    super()
    this._db = db
    this.id = dId
    this._db.events.on('replicated', () => {
      this.emit('data', this.all())
    })
  }
  db () {
    return this._db
  }

  // orbitDB dependent method
  load () {
    this._db.load()
  }

  async tag (to, from, yesNo = '+') {
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

  export () {
    const byDIds = groupBy(prop('dId'), this.all())
    const formatPerspective = tags => {
      const tagsByTos = groupBy(prop('to'), tags)
      return pipe(
        toPairs,
        map(arr => `${arr[0]}\n${map(tag => `${tag.yesNo}${tag.from},${tag.time}`, arr[1]).join("\n")}`)
      )(tagsByTos)
    } 
    return pipe(
      toPairs,
      map(arr => `_${arr[0]}\n${formatPerspective(arr[1])}`),
      join("\n")
    )(byDIds)
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
