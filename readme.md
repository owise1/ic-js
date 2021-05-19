# Intelligence Collective

you know how in your mind you're like "this is like that" and "that is like this"? well, this is like that

* connection collections
* thought maps
* distributed brainstorms
* structured spaces built to aid introspection and imagination
* a database of the subjective
* own and control your most precious "data"
* a web of meaning
* OED for thoughts

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Methods

### ic.tag(to, from, yesNo = '+')
> creates a tag for the perspective

### all()
> returns all tags


### ic.import(str)
* Remove special leading characters used in exchange format i.e `_` `#` `-` & `+`
> parses IC export format into db

### ic.export()
> returns IC export of entire db

### ic.db()
> return underlying db (orbitDB)

## Static

### IC.clean(str)
> utility function to enforce tag string format

* Lower case
* 50 character max

### IC.create(opts)
> factory function 

## Events

### 'data'
> when new data arrives


## .ice - IC Exchange Format

#### Special Characters for 

First position in line

* `#` comment
* `_` will be followed by a `Perspective Id`. Data from here pertains to this perspective - if this is missing, we'll generate one
* *No Special Character* what we will be tagging
* `+` "yes" tag
* `-` "no" tag

End of line

* `,` time


```
# this is a comment
# append _ to begin perspective id
_04916228003157dcfa0dea185fd03906a7e379e6b41a2c00c8e8200a6dc9c497cea0053387a1194d526b48d9f3f5f8448080aca756de8351c2589dc4a9a881014b
# what we're tagging has no special character
things i love
# "yes" tag
+warmth,1620150217594
+my family
# "no" tag
-trump
# when you want to switch to a new tag
trump
+huckster
# and go back again nbd
things i love
+good bread
# _ will begin another perspective (no id necessary)
_
things i love
+shots
+bats wings
-puppy dogs

```

## Roadmap

* post ice to ipfs
* private/encrypted groups
