# .ic - IC Protocol 

The IC protocol is a standardized way to share our thoughts. It's meant to be incredibly simple so anyone can contribute and benefit.

The following is a valid `.ic`
```
IC
+so hella siiiick
```

#### Special Characters

First position in line

* `//` - comment
* `_` - starts a new perspective. It's not necessary for the first perspective. But if you want to include more than one perspective in a single file use `_` to start a new one.  You can *optionally* follow `_` by a `Perspective Id` if your use case requires tying it to an exisiting perspective. In general we dont want to publish our internal ids [though](/docs/privacy.md)
* *No Special Character* - what we will be decribing 
* `+` - "yes" / connect
* `-` - "no" / repel

End of line (optional)

* `,` time. It's here if you need it, but I'm starting to question this.


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