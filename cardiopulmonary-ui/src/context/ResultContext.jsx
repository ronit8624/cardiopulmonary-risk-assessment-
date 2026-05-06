import { createContext, useContext, useState } from "react"

const ResultContext = createContext()

export function ResultProvider({ children }) {
  const [heartResult, setHeartResult] = useState(null)
  const [lungResult, setLungResult] = useState(null)

  return (
    <ResultContext.Provider value={{ heartResult, setHeartResult, lungResult, setLungResult }}>
      {children}
    </ResultContext.Provider>
  )
}

export function useResult() {
  return useContext(ResultContext)
}