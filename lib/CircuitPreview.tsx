// import { CircuitJsonPreview } from "@tscircuit/runframe/preview"
import { useEffect, useState, type ReactElement } from "react"
import { Circuit } from "@tscircuit/core"

export const CircuitPreview = (props: { circuit: ReactElement }) => {
  const [circuitJson, setCircuitJson] = useState<any[] | null>(null)

  useEffect(() => {
    const rootCircuit = new Circuit()
    rootCircuit.add(props.circuit as ReactElement)
    const circuitJsonData = rootCircuit.getCircuitJson()

    // Check for errors and warnings with source_ types
    for (const element of circuitJsonData) {
      console.log(element)
      const { error_type, warning_type, type, message } = element as any
      if (error_type || warning_type) {
        console.warn(`${type}:  ${message}`)
      }
    }

    setCircuitJson(circuitJsonData)
    // TODO handle circuit json changes with renderUntilSettled
  }, [])

  return (
    <div className="circuit-preview">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {circuitJson?.map((element, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-mono">
                {element.type}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(element, null, 2)}
                </pre>
              </td>
            </tr>
          )) || (
            <tr>
              <td
                colSpan={2}
                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
              >
                Loading circuit data...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
