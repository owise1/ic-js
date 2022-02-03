# .ic - The IC Standard 

IC is a standardized way to share thots. It's meant to be incredibly simple so anyone can contribute and benefit.

Here's an example:

```
IC is
+ plain text
+ with a couple simple rules
- complicated
```
That's it. The preceding example demonstrates the fundamental concepts of  IC:

* When we encounter a file on the internet or a text string formatted like so that's an `IC`.  By default we assume it represents a single perspective. 
* the first line- `IC is` - declares that this is the [thot](#Thots) we're about to describe. 
* lines that start with a `+` are like "yes".  In this case, this person thinks `IC is` *is* `plain text`, and from a certain perspective they're right. `+plain text` strengthens the connection between `IC is` and `plain text`. The connection is directional: `plain text` describes `IC is` or you could say that `plain text` is a child of `IC is`.
* a `-` at the beginning of the line is like a "no". `IC is` is "repelling" `complicated`
* notice that the initial thot is `IC is` not `IC`. It could have been with `IC` too, nbd. However, at that moment I chose to keep it more "natural". That's how I ended up writing it and then I hit <enter>. It really depends on what you intend to use the `IC` for.  Writing more colloquially or more "off the cuff" will end up connecting you to perspectives closer to your own.  Writing more formally will make your contributions broader.

The following is a valid `.ic`
```
IC
+so hella siiiick
```

# Structure 
* newlines separate everything
* lines with no leading special character define the [thot](/docs/ic.md#Thots) we'll be describing 
* leading and ending whitespace is stripped

#### Special Characters

First position in line
* `+` - "yes" / connect
* `-` - "no" / repel
* `//` - comment
* `_` - starts a new perspective. It's not necessary for the first perspective. But if you want to include more than one perspective in a single file use `_` to start a new one.  You can *optionally* follow `_` by a `Perspective Id` if your use case requires tying it to an exisiting perspective. In general we dont want to publish our internal ids [though](/docs/privacy.md)

End of line (optional)

* `,` time. It's here if you need it, but I'm starting to question this.

#### Extended Example

```
// this is a comment
// what we're tagging leads with no special character
things to know about .ic format
+leading plus means "yes"
+tags can be timestamped by appending comma the js time,1620150217594
+leading minus means "no"
-harms hippos
// when you want to switch to a new tag
trump
+gone but not forgotten
// and go back again nbd
things to know about .ic format
+super flexible
// _ will begin another perspective (no id necessary)
_
things i love
+love
+loving things
-bats wings
// append _ to begin perspective id
_0491622800
things i love
+oatmeal raisin cookies
+bats wings
-puppy dogs

```