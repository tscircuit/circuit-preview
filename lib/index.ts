import * as tscircuitCore from "@tscircuit/core"
import { CircuitJsonPreview } from "@tscircuit/runframe/preview"
import React from "react"
import { createRoot } from "react-dom/client"

declare global {
  interface Window {
    tscircuit: typeof tscircuitCore & {
      render: (component: React.ReactElement) => void
      processTscircuitTsxScripts: () => void
    }
    React: typeof React
    emit: (eventName: string, data: any) => void
  }
}

if (typeof window !== "undefined") {
  window.tscircuit = {
    ...tscircuitCore,
  } as any
  window.React = React

  // Simple event emitter for runframe communication
  window.emit = (eventName: string, data: any) => {
    const event = new CustomEvent(eventName, { detail: data })
    window.dispatchEvent(event)
  }

  window.tscircuit.render = (component: React.ReactElement) => {
    const circuit = new window.tscircuit.Circuit()
    circuit.add(component)

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
      React.createElement(CircuitJsonPreview, { circuitJson }),
    )
  }

  // Function to process tscircuit-tsx scripts and convert them to executable code
  window.tscircuit.processTscircuitTsxScripts = () => {
    const tsxScripts = document.querySelectorAll('script[type="tscircuit-tsx"]')
    
    for (const script of Array.from(tsxScripts)) {
      const tsxCode = script.textContent || script.innerHTML
      
      try {
        // Check if Babel is available
        if (typeof (window as any).Babel === 'undefined') {
          console.error('Babel is required for JSX transformation. Please include babel-standalone.')
          return
        }

        // Transform JSX to executable JavaScript using Babel
        const transformedCode = transformTsxToExecutableJs(tsxCode)
        
        // Execute the transformed code
        const executeCode = new Function('React', 'window', transformedCode)
        executeCode(React, window)
        
        // Remove the original script
        script.remove()
      } catch (error) {
        console.error('Error processing tscircuit-tsx script:', error)
      }
    }
  }

  // Function to transform TSX code to executable JavaScript using Babel
  function transformTsxToExecutableJs(tsxCode: string): string {
    const cleanCode = tsxCode.trim()
    
    // Extract JSX content from different export patterns
    let jsxContent = ''
    
    // Handle export default () => (...) pattern
    const exportDefaultMatch = cleanCode.match(/export\s+default\s+\(\s*\)\s*=>\s*\(([\s\S]*)\)/)
    if (exportDefaultMatch?.[1]) {
      jsxContent = exportDefaultMatch[1].trim()
    }
    // Handle export default function component pattern
    else {
      const exportFunctionMatch = cleanCode.match(/export\s+default\s+function\s*\w*\s*\(\s*\)\s*\{[\s\S]*return\s*\(([\s\S]*)\)[\s\S]*\}/)
      if (exportFunctionMatch?.[1]) {
        jsxContent = exportFunctionMatch[1].trim()
      }
      // If no export pattern found, assume it's just JSX
      else {
        jsxContent = cleanCode
      }
    }
    
    // Transform the JSX using Babel
    const jsxToTransform = `(${jsxContent})`
    const transformedJsx = (window as any).Babel.transform(jsxToTransform, {
      presets: ['react']
    }).code
    
    // Create the executable code
    return `
      // Create circuit and add the component
      const circuit = new window.tscircuit.Circuit()
      const component = ${transformedJsx}
      circuit.add(component)
      const circuitJson = circuit.getCircuitJson()

      // Communicate to RunFrame standalone that the props should change
      window.emit("tscircuit:runframe-singleton:propsChanged", { circuitJson })

      // Also render using the existing render function
      window.tscircuit.render(component)
    `
  }

  // Auto-process scripts when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.tscircuit.processTscircuitTsxScripts)
  } else {
    // DOM is already loaded
    window.tscircuit.processTscircuitTsxScripts()
  }
}
