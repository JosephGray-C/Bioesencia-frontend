import React from 'react'
import { ClipLoader } from "react-spinners";

export default function Loading({message = "Cargando"}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <ClipLoader
        size={22}
        color="var(--green)"
        speedMultiplier={0.9}
      />
      <span>{message}...</span>
    </div>
  )
}
