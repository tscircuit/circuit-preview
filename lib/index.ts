// export * from "./CircuitPreview"

import * as tscircuitCore from "@tscircuit/core"

declare global {
  interface Window {
    tscircuit: typeof tscircuitCore
  }
}

if (typeof window !== "undefined") {
  window.tscircuit = tscircuitCore
}
