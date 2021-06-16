const { v4: uuidv4 } = require('uuid')
const EventEmitter = require('./eventemitter')
const OrbitDB = require('orbit-db')
const isIPFS = require('is-ipfs')
const { reverse, uniqBy, join, mergeDeepRight, groupBy, prop, toPairs, pipe, map } = require('ramda')

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
      from: IC.clean(from),
      to: IC.clean(to),
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


  export (fn) {
    const all = fn ? fn(this.all()) : this.all()
    const byDIds = groupBy(prop('dId'), all)
    const cleanTags = pipe(
      reverse,
      uniqBy(prop('from')),
      reverse,
      map(tag => `${tag.yesNo}${tag.from},${tag.time}`),
      join("\n")
    )
    const formatPerspective = tags => {
      const tagsByTos = groupBy(prop('to'), tags)
      return pipe(
        toPairs,
        map(arr => `${arr[0]}${"\n"}${cleanTags(arr[1])}`),
        join("\n")
      )(tagsByTos)
    } 
    return pipe(
      toPairs,
      map(arr => `_${arr[0]}${"\n"}${formatPerspective(arr[1])}`),
      join("\n")
    )(byDIds)
  }

  async exportToIpfs (fn) {
    return this.ipfs.add({
      content: this.export(fn)
    })
  }

  async import (str) {
    const lines = str.split("\n").filter(line => !/^\/\//.test(line) && line)
    // import from ipfs
    if (lines.length === 1 && isIPFS.cid(str)) {
      for await (const file of this.ipfs.get(str)) {
        if (!file.content) continue
        const content = []
        for await (const chunk of file.content) {
          content.push(chunk)
        }
        const importStr = pipe(
          map(s => s.toString()),
          join('')
        )(content)
        // should only be on file so return
        return this.import(importStr)
      }
    }
    // import from string
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

  static clean (str) {
    return str.replace(/^[_+-]/, '').replace(/^\/\//, '')
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
    const instance = new IC(orbitdb.id, db)
    instance.orbitdb = orbitdb
    instance.ipfs = options.ipfs
    return instance
  }
}

module.exports = IC
