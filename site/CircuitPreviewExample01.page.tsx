import { CircuitPreview } from "../lib/CircuitPreview"

export default () => (
  <CircuitPreview
    circuitReactElement={
      <resistor resistance="1k" name="R1" footprint="0402" />
    }
  />
)
