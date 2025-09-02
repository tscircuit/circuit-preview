// import { CircuitJsonPreview } from "@tscircuit/runframe/preview"
import { useEffect, useState, type ReactElement } from "react"
import { Circuit } from "@tscircuit/core"
import { CircuitJsonPreview } from "@tscircuit/runframe"

export const CircuitPreview = (props: {
  circuitReactElement: ReactElement
}) => {
  const [circuitJson, setCircuitJson] = useState<any[] | null>(null)
  const [autoroutingGraphics, setAutoroutingGraphics] = useState<any[] | null>(
    null,
  )

  useEffect(() => {
    const rootCircuit = new Circuit()
    rootCircuit.add(props.circuitReactElement as ReactElement)
    const initialCircuitJson = rootCircuit.getCircuitJson()

    setCircuitJson(initialCircuitJson)

    let lastAutoroutingProgressAt = Date.now()
    rootCircuit.on("autorouting:progress", (event) => {
      if (Date.now() - lastAutoroutingProgressAt > 200) {
        setAutoroutingGraphics(event.debugGraphics)
      }
    })

    rootCircuit.on("autorouting:error", (event) => {
      setAutoroutingGraphics(null)
    })

    rootCircuit.on("autorouting:end", (event) => {
      setAutoroutingGraphics(null)
    })

    // Check for errors and warnings with source_ types
    for (const element of initialCircuitJson) {
      const { error_type, warning_type, type, message } = element as any
      if (error_type || warning_type) {
        console.warn(`${type}:  ${message}`)
      }
    }

    rootCircuit.renderUntilSettled().then(() => {
      // setCircuitJson(rootCircuit.getCircuitJson())
      setCircuitJson([...rootCircuit.getCircuitJson()])
      setAutoroutingGraphics(null)
    })
  }, [])

  return (
    <CircuitJsonPreview
      circuitJson={circuitJson}
      defaultToFullScreen
      isWebEmbedded
      showFileMenu
      // Causing some "hanging broken graphics" issues
      // autoroutingGraphics={autoroutingGraphics}
    />
  )
}
