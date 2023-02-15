const { v4: uuidv4 } = require('uuid')
const EventEmitter = require('./eventemitter')
const isIPFS = require('is-ipfs')
const { uniq, intersection, concat, filter, sort, identity, join, mergeDeepRight, groupBy, prop, toPairs, pipe, map, flatten, reverse, uniqBy, uniqWith } = require('ramda')
const fetch = require('cross-fetch')

const DELIM = "\n"

class IC extends EventEmitter {
  constructor (opts = {}) {
    super()
    this.opts = Object.assign({
      id: uuidv4(),
      inMemory: true,
      importDepth: -1
    }, opts)
    this.id = this.opts.id
    if (this.opts.inMemory) {
      this.tags = []
    }
    if (this.opts.ipfs) {
      this.ipfs = this.opts.ipfs
    }
    this._importedIcs = []
  }

  async tag (to, from, yesNo = '+', opts = {}) {
    if (to === '') return
    if (from === '') return
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

  all (opts = {}) {
    const ret = this.tags.slice(0)
    if (opts.flatten) {
      return pipe(
        reverse, // reverse so uniq will take the latest
        uniqWith((a, b) => a.dId === b.dId && a.from === b.from && a.to === b.to),
        reverse // put it back so newest are at the end
      )(ret)
    }
    return ret
  }

  export (fn, opts = {}) {
    if (typeof fn === 'object') {
      opts = fn
      fn = null
    }
    const all = fn ? fn(this.all()) : this.all()
    const byDIds = groupBy(prop('dId'), all)
    const _sort = what => opts.pure ? IC.sort(what) : what
    const cleanTags = pipe(
      reverse,
      uniqBy(prop('from')),
      reverse,
      map(tag => `${tag.yesNo}${tag.from}${!this.opts.pure && tag.time ? ',' + tag.time : ''}`),
      _sort,
      join(DELIM)
    )
    const formatPerspective = tags => {
      if (opts.pure) {
        return pipe(
          groupBy(t => t.yesNo + t.from),
          toPairs,
          map(arr => [IC.sort(arr[1].map(prop('to'))).join(DELIM), arr[0]]),
          groupBy(prop(0)),
          toPairs,
          map(arr => [arr[0], arr[1].map(prop(1))]),
          sort((a, b) => {
            // count newlines
            const aCount = (a[0].match(/\n/g) || []).length
            const bCount = (b[0].match(/\n/g) || []).length
            if (aCount > bCount) return -1
            if (aCount < bCount) return 1
            return IC.sort(a[0], b[0])
          }),
          map(arr => `${arr[0]}${DELIM}${IC.sort(arr[1]).join(DELIM)}`),
          join(DELIM)
        )(tags)

      } else {
        const tagsByTos = groupBy(prop('to'), tags)
        return pipe(
          toPairs,
          map(arr => `${arr[0]}${DELIM}${cleanTags(arr[1])}`),
          _sort,
          join(DELIM)
        )(tagsByTos)
      }
    }
    return pipe(
      toPairs,
      map(arr => {
        let start = '_'
        const firstTag = arr[1][0]
        if (opts.pure) {
          start = ''
        } else if (firstTag) {
          start = `_${firstTag.dId}`
        }
        return `${start}${DELIM}${formatPerspective(arr[1])}`
      }),
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

  // TODO: honor depth value
  _shouldImport (str) {
    return IC.isIcUrl(str) && (this.opts.importDepth === -1 || this.opts.importDepth > 1)
  }

  async import (str, source) {
    if (!str) return false
    const lines = str.split(DELIM).filter(line => !/^\/\//.test(line) && IC.clean(line))

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
    let tos = [] 
    let foundTag = false
    const resetTos = () => {
      tos = []
      foundTag = false
    }
    return Promise.all(lines.map(async line => {
      if (/^_/.test(line)) {
        dId = line.replace(/^_/, '') || source || uuidv4()
        resetTos()
      } else if (/^[+-]/.test(line)) {
        foundTag = true
        if (tos.length > 0) {
          const timePieceRegEx = /,[0-9.]+$/
          let time
          if (timePieceRegEx.test(line)) {
            const pieces = line.split(',')
            time = (pieces[pieces.length -1]).trim()
          }
          const from = IC.clean(line).replace(timePieceRegEx, '')
          await Promise.all(tos.map(async to => {
            await this.tag(to, from, !/^-/.test(line), {
              dId,
              source: source || this.id,
              time
            })
          }))
          if (this._shouldImport(from)) {
            await this.import(from, from)
          }
        }
      // top level
      } else {
        if (foundTag) {
          resetTos()
        }
        tos.push(line)
        // fetch those
        if (this._shouldImport(line)) {
          await this.import(line, line)
        }
      }
    }))
  }

  seed (tags = []) {
    const ic = new IC
    ic.id = this.id
    const tagsForSeeds = seeds => this.tags.filter(t => seeds.includes(t.to) || seeds.includes(t.from))
    let usedSeeds = []
    let seeds = []
    let newSeeds = []
    do {
      usedSeeds = usedSeeds.concat(tags)
      seeds = pipe(
        concat(tagsForSeeds(tags)),
        uniqWith((a, b) => a.to === b.to && a.from === b.from && a.dId === b.dId && a.yesNo === b.yesNo),
      )(seeds)
      newSeeds = pipe(
        map(t => [t.to, t.from]),
        flatten,
        filter(t => !usedSeeds.includes(t))
      ) (seeds)
      tags = newSeeds
    } while (newSeeds.length > 0)
    ic.tags = seeds
    return ic
  }

  findTagged (parents = [], opts = {}) {
    const all = this.all({ flatten: true })
    const options = Object.assign({
      ic: false
    }, opts)
    let ret 
    while (parents.length > 0) {
      const parent = parents.shift()
      if (options.ic) {
        const children = all.filter(t => t.to === parent)
        if (!ret) {
          ret = children 
        } else {
          ret = concat(ret, children)
        }

      } else {
        const children = all.filter(t => t.to === parent && t.yesNo !== '-')
        const tags = children.map(t => t.from)
        if (!ret) {
          ret = tags
        } else {
          ret = intersection(ret, tags) 
        }
        if (ret.length === 0) {
          break
        }
      }
    }
    if (options.ic) {
      const ic = new IC
      ic.tags = ret 
      return ic
    } else {
      return uniq(ret)
    }
  }

  static clean (str) {
    return str.replace(/^[_+-\s]/, '').replace(/^\/\//, '').trim()
  }

  static isIcUrl (str) {
    const domain = str.replace(/^https?:\/\//g, '')
    return (/^.+\.[^.]{2,3}\//.test(domain) || /^localhost/.test(domain)) && /\.ic$/.test(str)
  }
}
IC.sort = sort((a = '', b = '') => {
  return a.localeCompare(b)
})
module.exports = IC
