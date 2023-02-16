# Intelligence Collective (text/ic)

> you know how sometimes you're like "this is like that" and "that is like this"? well, this is like that

IC is an extremely simple text format designed for creating meaning. It's a simple way to collect, share, and connect our associations, perceptions, and thoughts. Here I'll teach you:

```
Intelligence Collective
+ connection collections
+ thought maps
+ distributed brainstorms
+ a *web* of meaning
+ a new medium 
+ a new demographics 
+ internet primitive
+ ponds
- streams
- hard to learn 
+ thoughts
- html
```


IC is designed for humans first and the internet second. As opposed to HTML, which combines UI, content and application logic, IC is so easy to use because it's only for one thing: recording what someone thinks. The syntax is basically just a `+`, a `-`, the `enter` key, and however you already talk. This makes it so literally anyone can contribute knowledge.  That simple syntax also makes it easy to build for and work with. 

 Imagine an index.ic sitting right alongside your index.html file representing what the website owner thinks and linking to other ICs on the internet that they endorse, like a link list for perspectives.  IC files on the internet allow us to create truly decentralized and personalized knowledge webs at any scale, without having to rely on large corporations, complex search algorithms or expensive processing power.

 There is a lot to talk about. Continue here...

* [What is IC?](/docs/ic.md)
* [The IC Standard](/docs/ic-export.md)

This is a javascript implementation of IC built to be stored in memory and external files on the internet.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Methods

### ic.tag(to, from, yesNo = '+')
> creates a tag for the perspective

### ic.all()
> returns all tags

### async ic.import(str)
> parses IC export format into db

`str` can be `.ic` [formatted string](/docs/ic-export.md) *or* url to `.ic` *or* ipfs CID containing `.ic` formatted string

### ic.export(fn, opts = { pure: false })
> returns [IC export](/docs/ic-export.md) of entire db in `.ic` formatted string

`fn` can transform/filter tags before they're output. note flattens tags to most recent. also, see [IC purity](/docs/ic-export.md#pure-ics)

### async ic.refresh()
> re-fetches external ICs

### ic.seed(['seed tags'], opts = { depth: -1 })
> returns a new IC containing only tags connected to your seed tags

by default it will take everything connected to everything connected to....the seeds tags. adding `opts.depth = 1` will only go one step out from the seeds in either direction

Eventually we'll amass enormous collections of thots managed and curated by different groups for different reasons.  "Seeding" is an approach to interacting with these unweildy data sets.  When we seed we use a small collection of our own and pull in only the thots from the larger set that are explicitly mentioned in ours and their ancestors. Like seeding a cloud.

### ic.findTagged(['parent tags'], opts = {})
> by default returns an array of all children with all given parents

This is useful for quickly finding the intersection of multiple tags.  

Add the `ic` option for a new IC object containing only the parent child connections

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
