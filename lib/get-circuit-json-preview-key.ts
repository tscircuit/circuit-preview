export const getCircuitJsonPreviewKey = (circuitJson: any[] | null) => {
  if (!Array.isArray(circuitJson)) return "empty"

  return circuitJson
    .map((element) => {
      const id =
        element?.pcb_trace_id ??
        element?.pcb_component_id ??
        element?.source_trace_id ??
        element?.source_component_id ??
        element?.source_port_id ??
        element?.type ??
        "unknown"

      if (element?.type === "pcb_trace") {
        const routeLength = Array.isArray(element.route)
          ? element.route.length
          : 0
        return `${element.type}:${id}:route=${routeLength}`
      }

      return `${element?.type ?? "unknown"}:${id}`
    })
    .sort()
    .join("|")
}
