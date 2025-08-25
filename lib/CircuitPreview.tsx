import { CircuitJsonPreview } from "@tscircuit/runframe/preview"
import { useEffect, useState, type ReactElement } from "react"
import { Circuit } from "@tscircuit/core"

export const CircuitPreview = (props: { circuit: ReactElement }) => {
  const [circuitJson, setCircuitJson] = useState<any[] | null>(null)

  useEffect(() => {
    const rootCircuit = new Circuit()
    rootCircuit.add(props.circuit as ReactElement)
    setCircuitJson(rootCircuit.getCircuitJson())
    // TODO handle circuit json changes with renderUntilSettled
  }, [])

  return <CircuitJsonPreview circuitJson={circuitJson} />
}
