# type-guardian

A simple type and interface translator for openapi to interface, and zod definitions

# CONSIDER AS _whatever comes before pre alpha_ VESRION

It is only intended as CLI tool, however it does contain a set of zod tools, you can import them via

```
import {zodGTRefine, zodLTRefine, zodXorRefine} from "@bunnio/type-guardian/dist/custom-zod/types"
```

# CLI usage

!! FOR CLI INSTALL IT GLOBALLY !!

> npm install -g @bunnio@type-guardian

every file should be transformed into a folder with multiple result options

## tg-full

use as:

> tg-full -i input/openapifile.yaml -o output/folder

This will generate the full stack which currently is a zod rules, typescript interface, and a direct lookup for the yaml source

## tg-int

use as:

> tg-int -i input/openapifile.yaml -o output/folder

This will generate the typescript interface

## tg-zod

use as:

> tg-zod -i input/openapifile.yaml -o output/folder

This will generate the zod rules
