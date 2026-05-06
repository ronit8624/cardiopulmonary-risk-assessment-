import { Routes, Route } from "react-router-dom"
import Layout from "../components/LayoutTemp"
import Dashboard from "../pages/dashboard"
import HeartUpload from "../pages/HeartUploadTemp"
import LungUpload from "../pages/LungUpload"
import Results from "../pages/results"
import Chatbot from "../pages/chatbot"

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/heart" element={<HeartUpload />} />
        <Route path="/lung" element={<LungUpload />} />
        <Route path="/results" element={<Results />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes