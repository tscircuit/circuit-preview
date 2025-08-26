// export * from "./CircuitPreview"

import * as tscircuitCore from "@tscircuit/core"
import { CircuitJsonPreview } from "@tscircuit/runframe/preview"
import React from "react"
import { createRoot } from "react-dom/client"

declare global {
  interface Window {
    tscircuit: typeof tscircuitCore & {
      render: (component: React.ReactElement) => void
    }
    React: typeof React
  }
}

if (typeof window !== "undefined") {
  window.tscircuit = {
    ...tscircuitCore,
  } as any
  window.React = React

  window.tscircuit.render = async (component: React.ReactElement) => {
    const circuit = new window.tscircuit.Circuit()
    circuit.add(component)

    circuit.on("board:renderPhaseStarted", (event) => {
      window.dispatchEvent(new CustomEvent("tscircuit:board:renderPhaseStarted", { detail: event }))
    })
    circuit.on("autorouting:progress", () => {
      window.dispatchEvent(new CustomEvent("tscircuit:autorouting:progress", { detail: { timestamp: Date.now() } }))
    })
    circuit.on("autorouting:end", () => {
      window.dispatchEvent(new CustomEvent("tscircuit:autorouting:end", { detail: { timestamp: Date.now() } }))
    })
    circuit.on("asyncEffect:start", (event) => {
      const processedEvent = {
        ...event,
        componentDisplayName: event.componentDisplayName.replace(/#\d+/, "#"),
      }
      window.dispatchEvent(new CustomEvent("tscircuit:asyncEffect:start", { detail: processedEvent }))
    })
    circuit.on("asyncEffect:end", (event) => {
      const processedEvent = {
        ...event,
        componentDisplayName: event.componentDisplayName.replace(/#\d+/, "#"),
      }
      window.dispatchEvent(new CustomEvent("tscircuit:asyncEffect:end", { detail: processedEvent }))
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
      }),
    )
  }
}
