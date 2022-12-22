# [![Metamorph](public/banner.png)](https://metamorph.fisherevans.com/)

**Hosted here: [metamorph.fisherevans.com](https://metamorph.fisherevans.com/)**

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

![sceenshot](media/screenshot.png)

## Recipes

- [Decompress AWS CloudWatch log payloads](https://metamorph.fisherevans.com/?config=CAESFQgqEhFiDwoNLmF3c2xvZ3MuZGF0YRIICFsSBHoCCAESKggqEiZiJAoiLmxvZ0V2ZW50c1tdIHwgLm1lc3NhZ2UgfCBmcm9tanNvbhIKCBUSBloECAIQARgB&input=H4sIAI7To2MAAxXRu5KiQABA0Xy-wjI1QEQEtmqChh6EVhCUd9YgbwS1m-fW_Pu64bnp_fu1Wq3xSJouJ-s_q__8hDum-KO1tic6sBbU7QwANqwzuAI0ZJhuptuVn8IEcRqNC888jVGOlXAsayTgkmugRJ52E2Sa06Mt1c3SbibxAe8SZ7UOgybebBTWTZBCtiKviu6xvedBz_qvx_NVSEzjxabpKfHiS4Ov8jfWjYDHTsKzuclUAvYc3zDsd0Iq_cRoR8pXYLyT3Dz7_MlVfVFXKFIbvoXuvZGEyFZxtFDdetAxnLIlQvvNdBnYTPYyQXazDjrZOaYaHK2aJTVst6lcza3aqNbJv8rGMTGSeiysS2IUBIsIiPpewhe70O3FHmadtIK7P-KaS2hdhP1bvcJTlxdVZgRvyqVVdThvLU31lcp2yqOsIFpyiNHQG245tveiTlO1ZfMDehzgA8NV4qPtJDG8d70iEYzTPOd0sBs1lh7CS8kBQRniRJy8FuT13FwCggcnTa3M0RcGMXiZTvEezpnPpNX1YPc4enq4tG0AwPf3-rP39-v3H5VS3WX1AQAA)

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