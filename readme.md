# ic-js

Intelligence Collective

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Public Instance Methods

### ic.tag(from, to, yesNo = '+')
> creates a tag for the perspective

### all()
> returns all tags

### ic.clean(str)
> utility function to enforce tag string format

The goal is keep a tags as open as possible while limiting inadvertant dupes and keeping them relatively URL safe.
* Lower case
* 50 character max
* remove potentially dangerous characters
* Remove special characters used in exchange format i.e `_` `#` `-` & `+`

### ic.import(str)
> parses IC export format into db

### ic.export()
> returns IC export of entire db

### ic.db()
> return underlying db (orbitDB)

## Events

### 'data'
> when new data arrives


## .ice - IC Exchange Format

#### Special Characters for first position of a line
* `#` comment
* `_` will be followed by a `Perspective Id`. Data from here pertains to this perspective
* *No Special Character* what we will be tagging
* `+` "yes" tag
* `-` "no" tag

```
# this is a comment
# append _ to begin perspective id
_04916228003157dcfa0dea185fd03906a7e379e6b41a2c00c8e8200a6dc9c497cea0053387a1194d526b48d9f3f5f8448080aca756de8351c2589dc4a9a881014b
# what we're tagging has no special character
things i love
# "yes" tag
+warmth
+my family
# "no" tag
-trump
# when you want to switch to a new tag
trump
+loser
# and go back again nbd
things i love
+good bread

```
