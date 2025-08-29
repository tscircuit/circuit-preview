import * as tscircuitCore from "@tscircuit/core"
import { CircuitJsonPreview } from "@tscircuit/runframe/preview"
import * as Babel from "@babel/standalone"
import React from "react"
import { createRoot } from "react-dom/client"

declare global {
  interface Window {
    tscircuit: typeof tscircuitCore & {
      render: (component: React.ReactElement) => void
    }
    React: typeof React
    Babel: typeof Babel
  }
}

if (typeof window !== "undefined") {
  window.tscircuit = {
    ...tscircuitCore,
  } as any
  window.React = React
  window.Babel = Babel

  window.tscircuit.render = async (component: React.ReactElement) => {
    const circuit = new window.tscircuit.Circuit()
    circuit.add(component)

    /**
     * TODO SHOW CIRCUIT JSON via getCircuitJson PRIOR TO
     * RENDER UNTIL SETTLED
     *
     * TODO MOVE ALL THIS CIRCUIT RENDER MANAGEMENT INTO CircuitPreview
     */
    await circuit.renderUntilSettled()

    const circuitJson = circuit.getCircuitJson()

    // Check for errors and warnings with source_ types
    for (const element of circuitJson) {
      const { error_type, warning_type, type, message } = element as any
      if (error_type || warning_type) {
        console.warn(`${type}:  ${message}`)
      }
    }

    // Create root div if it doesn't exist
    let rootDiv = document.getElementById("tscircuit-root")
    if (!rootDiv) {
      rootDiv = document.createElement("div")
      rootDiv.id = "tscircuit-root"
      document.body.appendChild(rootDiv)
    }

    // Render the CircuitJsonPreview
    /** TODO USE TSX */
    createRoot(rootDiv).render(
      React.createElement(CircuitJsonPreview, {
        circuitJson,
        defaultToFullScreen: true,
        isWebEmbedded: true,
        showFileMenu: true,
      }),
    )
  }
}
