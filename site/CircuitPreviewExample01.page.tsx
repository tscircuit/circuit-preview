import { CircuitPreview } from "../lib/CircuitPreview"

export default () => (
  <CircuitPreview
    circuit={<resistor resistance="1k" name="R1" footprint="0402" />}
  />
)
