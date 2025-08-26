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

## Working ChatGPT Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://unpkg.com/@tscircuit/circuit-preview@0.0.10/dist/index.global.js"></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

    <script type="text/babel">
      const { Circuit } = window.tscircuit

      const circuit = new Circuit()
      circuit.add(<resistor name="R1" resistance="1k" />)
      console.log(circuit.getCircuitJson())
    </script>
  </head>
  <body></body>
</html>
```

## What to do next

We just need to convert...

```html
<script type="tscircuit-tsx">
  export default () => (
    <board><resistor /></board>
  )
</script>
```

Into something like this:

```html
<script type="babel/> const circuit = new window.tscircuit.Circuit()
circuit.add(React.createElement("board", ...)) const circuitJson =
circuit.getCircuitJson() // Communicate to RunFrame standalone that the props
should change window.emit("tscircuit:runframe-singleton:propsChanged", {
circuitJson })
```
