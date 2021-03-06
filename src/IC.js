const { v4: uuidv4 } = require('uuid')
const EventEmitter = require('./eventemitter')
const isIPFS = require('is-ipfs')
const { sort, identity, join, mergeDeepRight, groupBy, prop, toPairs, pipe, map, flatten, reverse, uniqBy } = require('ramda')
const fetch = require('cross-fetch')

const DELIM = "\n"

class IC extends EventEmitter {
  constructor (opts = {
    id: uuidv4(),
    inMemory: true,
    pure: true
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
    this._importedIcs = []
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
    const _sort = what => this.opts.pure ? IC.sort(what) : what
    const cleanTags = pipe(
      reverse,
      uniqBy(prop('from')),
      reverse,
      map(tag => `${tag.yesNo}${tag.from}${this.opts.pure ? '' : ',' + tag.time}`),
      _sort,
      join(DELIM)
    )
    const formatPerspective = tags => {
      const tagsByTos = groupBy(prop('to'), tags)
      return pipe(
        toPairs,
        map(arr => `${arr[0]}${DELIM}${cleanTags(arr[1])}`),
        _sort,
        join(DELIM)
      )(tagsByTos)
    }
    return pipe(
      toPairs,
      map(arr => `_${DELIM}${formatPerspective(arr[1])}`),
      _sort,
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

  externalIcs () {
    return this._importedIcs.slice(0)
  }

  // refetch external ICs
  async refresh () {
    const importedIcs = this._importedIcs.slice(0)
    this._importedIcs = []
    this.tags = this.tags.filter(tag => !importedIcs.includes(tag.source))
    return await this.import(importedIcs.join(DELIM))
  }

  async import (str, source) {
    const lines = str.split(DELIM).filter(line => !/^\/\//.test(line) && line)
    if (!source) {
      source = this.id
    }

    // perhaps we're importing from somehwere else
    if (lines.length === 1) {
      // import from ipfs
      if (this.ipfs && (isIPFS.cid(str) || isIPFS.path(str))) {
        if (this._importedIcs.includes(str)) {
          return false
        } else {
          this._importedIcs.push(str)
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
            // should only be one file so return
            return this.import(importStr, str)
          }
        }
      }
      // import from url
      if (IC.isIcUrl(str)) {
        if (this._importedIcs.includes(str)) {
          return false
        } else {
          this._importedIcs.push(str)
          const importStr = await fetch(str)
            .then(res => res.text())
            .catch(err => console.log(err))
          return importStr && this.import(importStr, str)
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
          if (IC.isIcUrl(pieces[0])) {
            await this.import(pieces[0], pieces[0])
          }
          await this.tag(to, pieces[0], !/^-/.test(line), {
            dId,
            source,
            time: pieces[1] ? parseInt(pieces[1], 10) : null
          })
        }
      // top level
      } else {
        // fetch those
        if (IC.isIcUrl(line)) {
          await this.import(line, line)
        }
        to = line
      }
    }))
  }

  static clean (str) {
    return str.replace(/^[_+-\s]/, '').replace(/^\/\//, '')
  }

  static isIcUrl (str) {
    return /^https?:\/\//.test(str) && /\.ic$/.test(str)
  }
}
IC.sort = sort((a = '', b = '') => {
  return a.localeCompare(b)
})
module.exports = IC
