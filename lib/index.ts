import * as tscircuitCore from "@tscircuit/core"
import { CircuitJsonPreview } from "@tscircuit/runframe/preview"
import * as Babel from "@babel/standalone"
import React from "react"
import { createRoot } from "react-dom/client"
import { CircuitPreview } from "./CircuitPreview"

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

  window.tscircuit.render = async (circuitReactElement: React.ReactElement) => {
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
      React.createElement(CircuitPreview, {
        circuitReactElement,
      }),
    )
  }
}
