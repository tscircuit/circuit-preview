# @tscircuit/circuit-preview

This package is primarily for usage inside ChatGPT. ChatGPT imposes certain requirements that make it difficult to run `@tscircuit/core` or `@tscircuit/runframe` directly, so this module adapts tscircuit dependencies to the constraints.

- Must use latest version of React
- Bundles all dependencies except React
- Does not use WebWorkers (renders synchronously)

## Usage

```tsx
import { CircuitPreview } from "@tscircuit/circuit-preview"

export default () => (
  <CircuitPreview
    circuit={<resistor resistance="1k" name="R1" footprint="0402" />}
  />
)
```

## Development / Internals

- Uses `@tscircuit/runframe/preview`, `CircuitJsonPreview` is used for displaying the circuit json
- Uses tsup to bundle all dependencies in browser mode
- Uses React Cosmos to preview in development
- Analyze bundle size from `tsup` `--metafile` output https://esbuild.github.io/analyze/
