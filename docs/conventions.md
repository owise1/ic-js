# IC Conventions

IC is so flexible it'd be a good idea to have some conventions. Here are a few ideas.

## Lowercase

Unless it's necessary use all lowercase.

## Misspellings / Deduping

Tag `is spelled ___`. Ex:

```
cherios
+is spelled cherrios
```

When you publish an `.ic` you can decide whether to clean these up

## Settings

`.ic`s need interfaces and sometimes we want the settings for those interfaces contained in the IC itself.  We can tag the identifier of the IC itself with a tag preceded by `|`. So for example if our interface is at `intelligencecollective.wtf` we could do something like:

```
intelligencecollective.wtf
+|lowercase|1
+|depth|1
```

## Newlines

thots are intentionally stored using new lines because we're trying to store thoughts, not text. However, even I will admit that some people think in paragraphs. For those people (or for the meddlers out there, excited about their new tool, willing to burn untold hours shoehorning it into their latest project) I offer you the carriage return `\r`

## Stray Thots...

### "Pure" ICs

A "pure" IC is designed to make it easy to identify ICs with the exact same content.  Two pure ICs will have the same content hash if they are the same. This could make things more efficient and allow us to more easily create composable ICs.  In order to make this happen we need to follow a few rules:

* pure ICs represent a single perspective and contain no initial `_`
* pure ICs have no comments and do not use the optional `,{number}` for any tag
* top level parents, as well as tags within a parent are ordered by unicode char code

ICs created by `ic-js` are pure by default.

### Seeding (?)

Eventually we'll amass enormous collections of thots managed and curated by different groups for different reasons.  "Seeding" is an approach to interacting with these unweildy data sets.  When we seed we use a small collection of our own and pull in only the thots from the larger set that are explicitly mentioned in ours and their direct ancestors. Like seeding a cloud.
