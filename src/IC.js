const { v4: uuidv4 } = require('uuid')
const EventEmitter = require('./eventemitter')
const OrbitDB = require('orbit-db')
const { join, mergeDeepRight, groupBy, prop, toPairs, pipe, map } = require('ramda')

class IC extends EventEmitter {
  constructor (dId, db) {
    super()
    this._db = db
    this.id = dId
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

  async tag (to, from, yesNo = '+', opts = {}) {
    const tag = Object.assign({
      from: this.clean(from),
      to: this.clean(to),
      yesNo: !yesNo || yesNo === '-' ? '-' : '+',
      time: new Date().getTime(),
      dId: this.id
    }, opts)
    await this._db.add(tag)
    this.emit('data', this.all())
    return tag
  }

  all () {
    return this._db.iterator({ limit: -1 })
      .collect()
      .map((e) => e.payload.value)
  }

  clean (str) {
    return str.toLowerCase().slice(0, 50)
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

  async import (str) {
    const lines = str.split("\n").filter(line => !/^#/.test(line) && line)
    let dId = uuidv4()
    let to = null
    return Promise.all(lines.map(async line => {
      if (/^_/.test(line)) {
        dId = line.replace(/^_/, '') || uuidv4()
      } else if (/^[+-]/.test(line)) {
        if (to) {
          const pieces = line.replace(/^[+-]/, '').split(',')
          await this.tag(to, pieces[0], !/^-/.test(line), {
            dId,
            time: pieces[1] ? parseInt(pieces[1], 10) : null
          })
        }
      } else {
        to = line
      }
    }))
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
    const db = await orbitdb.log(dbAddr, {
      sync: true,
      accessController: {
        write: ['*']
      }
    })
    const instance = new IC(orbitdb.id, db)
    instance.orbitdb = orbitdb // used for testing
    return instance
  }
}

module.exports = IC
