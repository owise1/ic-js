# Intelligence Collective

you know how in your mind you're like "this is like that" and "that is like this"? well, this is like that

* connection collections
* thought maps
* distributed brainstorms
* structured spaces built to aid introspection and imagination
* database of the subjective
* control your most precious "data"
* a web of meaning
* decrentralized text graph
* OED for thoughts

[more reading](/docs)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Methods

### ic.tag(to, from, yesNo = '+')
> creates a tag for the perspective

### all()
> returns all tags


### ic.import(str)
> parses IC export format into db

`str` can be `.ic` formatted string *or* ipfs CID containing `.ic` formatted string

### ic.export(fn)
> returns IC export of entire db in `.ic` formatted string

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


## .ic - IC Exchange Format

#### Special Characters for 

First position in line

* `//` comment
* `_` will be followed by a `Perspective Id`. Data from here pertains to this perspective - if this is missing, we'll generate one
* *No Special Character* what we will be tagging
* `+` "yes" tag
* `-` "no" tag

End of line

* `,` time


```
// this is a comment
// append _ to begin perspective id
_04916228003157dcfa0dea185fd03906a7e379e6b41a2c00c8e8200a6dc9c497cea0053387a1194d526b48d9f3f5f8448080aca756de8351c2589dc4a9a881014b
// what we're tagging leads with no special character
things to know about .ic format
+leading plus means "yes"
+tags can be timestamped by appending comma then js time,1620150217594
// leading minus means "no"
-harms hippos
// when you want to switch to a new tag
trump
+huckster
// and go back again nbd
things to know about .ic format
+super flexible
// _ will begin another perspective (no id necessary)
_
things i love
+oatmeal raisin cookies
+bats wings
-puppy dogs

```

## Roadmap

* use in browser and nodejs
* private/encrypted groups
