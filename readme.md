# Intelligence Collective

> you know how in your mind you're like "this is like that" and "that is like this"? well, this is like that

connection collections. thought maps. distributed brainstorms. structured spaces built to aid introspection and imagination. databases of the subjective. a *web* of meaning. decrentralized text graph. OED for thoughts. a new medium. an alternative demographics based on what we see.

* [Intro](/docs/intelligence-collective.md)
* [IC Protocol](/docs/ic-export.md)
* [Privacy](/docs/privacy.md)

This is a javascript implementation of IC built on [IPFS](https://ipfs.io/) and [OrbitDB](https://github.com/orbitdb/orbit-db). That means we can do lots of cool things like collaborate and control our ICs. It's effortless to export, share and remix them.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Methods

### ic.tag(to, from, yesNo = '+')
> creates a tag for the perspective

### all()
> returns all tags


### ic.import(str)
> parses IC export format into db

`str` can be `.ic` [formatted string](/docs/ic-export.md) *or* ipfs CID containing `.ic` formatted string

### ic.export(fn)
> returns [IC export](/docs/ic-export.md) of entire db in `.ic` formatted string

`fn` can transform/filter tags before they're output
note flattens tags to most recent

### ic.exportToIpfs()
> returns CID of `.ic` formatted string

### ic.db()
> return underlying db (orbitDB)

## Static

### IC.clean(str)
> utility function to enforce tag string format

* remove special leading characters `//`, `_`, `+`, `-`

### IC.create(opts)
> factory function 

## Events

### 'data'
> when new data arrives

## Roadmap

* use in browser and nodejs
* private/encrypted groups
