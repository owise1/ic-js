# .ic - IC Protocol 

The IC protocol is a standardized way to share our thoughts. It's mean to be incredibly simple so anyone can contribute and benefit.

The following is a valid `.ic`
```
IC is
+cool
```

#### Special Characters for 

First position in line

* `//` - comment
* `_` - starts a new perspective. It's not necessary for the first perspective. But if you want to include more than one perspective in a single file use `_` to start a new one.  You can *optionally* follow `_` by a `Perspective Id` if you'd like to tie it to an exisiting persepctive.
* *No Special Character* what we will be tagging
* `+` "yes" tag
* `-` "no" tag

End of line (optional)

* `,` time


#### Extended Example


```
// this is a comment
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
+love
-bats wings
// append _ to begin perspective id
_0491622800
things i love
+oatmeal raisin cookies
+bats wings
-puppy dogs

```