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
* notice that the initial thot is `IC is` not `IC`. It could have been with `IC` too, nbd. However, at that moment I chose to keep it more "natural". That's how I ended up writing it and then I hit "enter". It really depends on what you intend to use the `IC` for.  Writing more colloquially or more "off the cuff" will end up connecting you to perspectives closer to your own.  Writing more formally will make your contributions broader.

The following is a valid `.ic`
```
IC
+so hella siiiick
```

# Structure 
* newlines separate everything
* lines with no leading special character define the [thot](/docs/ic.md#Thots) we'll be describing 
* leading and ending whitespace is stripped

## Special Characters

First position in line
* `+` - "yes" / connect
* `-` - "no" / repel
* `//` - comment
* `_` - starts a new perspective. It's not necessary for the first perspective. But if you want to include more than one perspective in a single file use `_` to start a new one.  You can *optionally* follow `_` by a `Perspective Id` if your use case requires tying it to an exisiting perspective. In general we dont want to publish our internal ids [though](/docs/privacy.md)

End of line (optional)

* `,` digits and `.`s - I'm calling this the "timepart" rn. It is usually used for a js timestamp, but can also be used to store more info. for example:

```
the timepart can be used to
+ store the time a tag was created,1676486294449
+ an aggregation from multiple .ics,45.12 
+ something insane like base 10 representations of data,23.45.13.245
+ anything that only uses digits and a dot
```

## External ICs

An IC URL always ends in `.ic` and begins `http....`. If an IC URL is encountered either at the top level or as a tag it'll be imported.


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
+oatmeal raisin cookies,1000 // or we can use a number to indicate a count.
+bats wings
-puppy dogs

```


## Advanced Topics

### Grouping Tags

If a child tag has multiple parents you can combine the parents like:

```
apples
pears
+ green
+ fruit
```

In the above example both `apples` and `pears` will be tagged with `green` and `fruit`

### "Pure" ICs

A "pure" IC is designed to make it easy to identify ICs with the exact same content.  Two pure ICs will have the same content hash if they are the same. This allow us to create composable ICs and efficiently structure all knowledge in this way.  To make a pure IC we need to follow a few rules:

* pure ICs represent a single perspective and contain no initial `_`
* pure ICs have no comments and do not use the optional `,{number}` for any tag
* top level parents, as well as tags within a parent are ordered by unicode char code
* parents should be fully grouped, with groups of the most parents coming first and descending to single parent tags
* parents in groups should also be ordered by unicode char code
