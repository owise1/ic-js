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

`.ic`s need interfaces and sometimes we want the settings for those interfaces contained in the IC itself.  We can tag the name of the IC itself with tag preceded by `:`. So for example if our interface is at `intelligencecollective.wtf` we could do somethin like:

```
intelligencecollective.wtf
+:lowercase:1
+:depth:1
```

## Stray Thots...

### Seeding (?)

Eventually we'll amass enormous collections of thots managed and curated by different groups for different reasons.  "Seeding" is an approach to interacting with these unweildy data sets.  When we seed we use a small collection of our own and pull in only the thots from the larger set that are explicitly mentioned in ours and their direct ancestors.
