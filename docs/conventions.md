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

`.ic`s need interfaces and sometimes we want the settings for those interfaces contained in the IC itself.  We can tag the identifier of the IC itself with a tag preceded by `|`. So for example if our interface is at `intelligencecollective.wtf` we could do somethin like:

```
intelligencecollective.wtf
+|lowercase|1
+|depth|1
```

## Linked ICs

It's not necessary to reproduce all the data from an IC if you want to incorporate or modify it in some way. Just link to it. Export the original to IPFS if you dont want it to change, or host it a url if you do, then link to it in your new IC.  We'll use `linked ICs` and make sure any linked IC ends in `.ic`

```
linked ICs
+/ipfs/QmZYk6ArdhH6AqE3hk1nfDnZf92DZaLHFiZWK8k9opPoSB/orbitdb-zdpuAm8F2GT1fhBto9NYT2AXP8fEfqdoC3K59qwukEZJ4zCmv-Feedback.ic
```

## Stray Thots...

### Seeding (?)

Eventually we'll amass enormous collections of thots managed and curated by different groups for different reasons.  "Seeding" is an approach to interacting with these unweildy data sets.  When we seed we use a small collection of our own and pull in only the thots from the larger set that are explicitly mentioned in ours and their direct ancestors.
