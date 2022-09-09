# Intelligence Collective (text/ic)

> you know how sometimes you're like "this is like that" and "that is like this"? well, this is like that

IC is an extremely simple text format designed for creating meaning. It's an easy way to collect, share, and connect our associations, perceptions, and thoughts. Here I'll teach you:

```
Intelligence Collective
+ connection collections
+ thought maps
+ distributed brainstorms
+ a database of the subjective
+ a *web* of meaning
+ decentralized text graph
+ OED for thoughts
+ a new medium 
+ a new demographics 
+ internet primitive
+ auteur protocol
+ pools not streams
+ structured spaces built to aid introspection and imagination
- hard to learn 
+ thoughts
- html
```

* [What is IC?](/docs/ic.md)
* [The IC Standard](/docs/ic-export.md)
* [Conventions](/docs/conventions.md)
* [Privacy](/docs/privacy.md)

This is a javascript implementation of IC built to be stored in memory and external files on the internet.

There is also an experimental implementation built on [IPFS](https://ipfs.io/) and [OrbitDB](https://github.com/orbitdb/orbit-db). That means we can do lots of cool things like collaborate and control our ICs. There's no central database. The only people who have it are the ones who use it. It's also effortless to export, share and remix them.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Methods

### ic.tag(to, from, yesNo = '+')
> creates a tag for the perspective

### ic.all()
> returns all tags


### ic.import(str)
> parses IC export format into db

`str` can be `.ic` [formatted string](/docs/ic-export.md) *or* url to `.ic` *or* ipfs CID containing `.ic` formatted string

### ic.export(fn)
> returns [IC export](/docs/ic-export.md) of entire db in `.ic` formatted string

`fn` can transform/filter tags before they're output
note flattens tags to most recent

### ic.refresh()
> re-fetches external ICs

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

### IC.isIcUrl(str)
> basic regex check for `http` and `.ic`

## Events

### 'data'
> when new data arrives

## Roadmap

* use in browser and nodejs
