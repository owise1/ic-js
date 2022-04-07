const { v4: uuidv4 } = require('uuid')
const EventEmitter = require('./eventemitter')
const isIPFS = require('is-ipfs')
const { identity, join, mergeDeepRight, groupBy, prop, toPairs, pipe, map, flatten, reverse, uniqBy } = require('ramda')
const fetch = require('cross-fetch')

const DELIM = "\n"

class IC extends EventEmitter {
  constructor (opts = {
    id: uuidv4(),
    inMemory: true
  }) {
    super()
    this.opts = opts
    this.id = opts.id
    if (this.opts.inMemory) {
      this.tags = []
    }
    if (this.opts.ipfs) {
      this.ipfs = this.opts.ipfs
    }
    this._importedUrls = []
  }

  async tag (to, from, yesNo = '+', opts = {}) {
    const tag = Object.assign({
      from: IC.clean(from),
      to: IC.clean(to),
      yesNo: !yesNo || yesNo === '-' ? '-' : '+',
      time: new Date().getTime(),
      dId: this.id
    }, opts)
    this.emit('tag', tag)
    if (this.opts.inMemory) {
      this.tags.push(tag)
      this.emit('data', this.all())
    }
    return tag
  }

  all () {
    return this.tags.slice(0)
  }

  export (fn) {
    const all = fn ? fn(this.all()) : this.all()
    const byDIds = groupBy(prop('dId'), all)
    const cleanTags = pipe(
      reverse,
      uniqBy(prop('from')),
      reverse,
      map(tag => `${tag.yesNo}${tag.from},${tag.time}`),
      join(DELIM)
    )
    const formatPerspective = tags => {
      const tagsByTos = groupBy(prop('to'), tags)
      return pipe(
        toPairs,
        map(arr => `${arr[0]}${DELIM}${cleanTags(arr[1])}`),
        join(DELIM)
      )(tagsByTos)
    } 
    return pipe(
      toPairs,
      map(arr => `_${DELIM}${formatPerspective(arr[1])}`),
      join(DELIM)
    )(byDIds)
  }

  async exportToIpfs (fn, opts = {}) {
    if (!this.ipfs) {
      throw new Error('this method requires an ipfs instance')
    }
    if (typeof fn === 'object') {
      opts = Object.assign({}, fn)
      fn = identity
    }
    const content = this.export(fn)
    if (opts.add) {
      opts.add(content)
    }
    return this.ipfs.add({
      content
    })
  }

  async import (str) {
    const lines = str.split(DELIM).filter(line => !/^\/\//.test(line) && line)

    // perhaps we're importing from somehwere else
    if (lines.length === 1) {
      // import from ipfs
      if (this.ipfs && (isIPFS.cid(str) || isIPFS.path(str))) {
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
      // import from url
      if(/^https?:\/\//.test(str) && /\.ic$/.test(str)) {
        if (this._importedUrls.includes(str)) {
          return false
        } else {
          this._importedUrls.push(str)
          const importStr = await fetch(str).then(res => res.text())
          return this.import(importStr)
        }
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
    return str.replace(/^[_+-\s]/, '').replace(/^\/\//, '')
  }
}
module.exports = IC
