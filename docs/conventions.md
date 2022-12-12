# IC Conventions

The ic format is simple to use and extremely flexible so it's a good idea to have some conventions. Conventions will be global to the extent that we can agree on things. But more than likely they will be regional, local and communal, "dialectical" and goal dependent. You dont need an international body when you already have the mind. 

Here are a few ideas.

## Lowercase

Unless it's necessary use all lowercase.

## Misspellings / Deduping

a few options...

```
cherios
+is spelled cherrios
+is really cherrios
+cherrios
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
