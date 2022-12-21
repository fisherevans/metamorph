# ![Metamorph](public/banner.png)



> **metamorph** (plural metamorphs)
>
> - An organism that has undergone metamorphosis
>
> **metamorphosis**
>
> - A transformation, such as one performed by magic. 
> - A noticeable change in character, appearance, function or condition.
>
> https://en.wiktionary.org/wiki/metamorph

**Metamorph** is a small, client-side webapp that allows you to define a series of repeatable text and data transformations. These configurations are persisted in the URL allowing you to bookmark them for later.

I created this project after getting frustrated with a repetitive procces I was forced to repeat dozens of time while debugging an issue:

1. fetch a JSON payload
2. pretty print it in order to copy a specific attribute value
3. Base64 decode that
4. pretty print again to find another field
5. un-escape an attribute value
6. pretty print YAML this time in order to find the actual field I was looking for

It may be an extreme example - one that has other underlying issues that are probably worth addressing - but this kind of practice isn't uncommon...

#### Play with it here: https://metamorph.fisherevans.com/

![sceenshot](media/screenshot.png)

## Contributing

### Run it Locally

```bash
npm install # once
npm run start
```

### Add a new Processing Action

A good example to reference is [adding the `Unescape` and `Escape` functions](https://github.com/fisherevans/metamorph/commit/68f8bd684d0b70610a8e5f91082bd8f3814bd617).

- Add a new `ActionCode` enum and any config you need to `src/components/AppConfig/protos/model.proto`

  > *We use ProtoBuf for config in order to minimize the size of the data blob we stuff in the URL*

- Run `npm run codegen`

- Follow the patterns in `src/components/ProcessingActions` (i.e. `regex/Regex.tsx`) to create the new function:

  - A processor that actually transform the data
  - If there's config involved:
    - an "Ensure*Config'er" to establish the default config values
    - a "Configure'er" to allow a user to change the config
    - a "Sumuraize'er" to display a concise version of the current config

- Add a new entry in via `registerAvailableAction(*)` in `src/components/ProcessingActions/ActionSetup.tsx`