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
    const autoroutingGraphics: any[] = []

    const circuit = new window.tscircuit.Circuit()
    circuit.add(component)

    circuit.on("autorouting:progress", (event) => {
      console.log("autorouting:progress", event)
      autoroutingGraphics.push(event.debugGraphics)
    })
    circuit.on("autorouting:end", (event) => {
      autoroutingGraphics.push(event.debugGraphics)
    })

    await circuit.renderUntilSettled()

    const circuitJson = circuit.getCircuitJson()

    // Create root div if it doesn't exist
    let rootDiv = document.getElementById("tscircuit-root")
    if (!rootDiv) {
      rootDiv = document.createElement("div")
      rootDiv.id = "tscircuit-root"
      document.body.appendChild(rootDiv)
    }

    // Render the CircuitJsonPreview
    createRoot(rootDiv).render(
      React.createElement(CircuitJsonPreview, {
        circuitJson,
        defaultToFullScreen: true,
        isWebEmbedded: true,
        showFileMenu: true,
        autoroutingGraphics,
      }),
    )
  }
}
