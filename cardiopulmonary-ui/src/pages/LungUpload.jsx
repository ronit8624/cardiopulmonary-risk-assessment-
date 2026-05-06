import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useResult } from "../context/ResultContext"

function LungUpload() {
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setLungResult } = useResult()
  const navigate = useNavigate()

  function handleImageChange(e) {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setImage(URL.createObjectURL(selectedFile))
      setError(null)
    }
  }

  async function handleAnalyze() {
    if (!file) {
      setError("Pehle image upload karo!")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://127.0.0.1:8000/predict/lung", {
        method: "POST",
        body: formData
      })
      const data = await response.json()
      setLungResult(data)
      navigate("/results")
    } catch (err) {
      setError("Server se connect nahi ho pa raha. Backend chal raha hai?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 60%, #0ea5e9 100%)",
        borderRadius: "20px",
        padding: "30px 40px",
        color: "white",
        marginBottom: "36px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-30px", right: "-30px",
          width: "160px", height: "160px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "50%"
        }} />
        <svg style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.1 }} width="100%" height="60" viewBox="0 0 600 60">
          <path d="M0,40 C50,40 50,10 100,10 C150,10 150,50 200,50 C250,50 250,20 300,20 C350,20 350,45 400,45 C450,45 450,15 500,15 C550,15 550,40 600,40"
            stroke="white" strokeWidth="2" fill="none" />
        </svg>
        <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.75, marginBottom: "8px" }}>
          Module 02 — Pulmonary Analysis
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.5px" }}>
          🫁 Lung X-ray Analysis
        </h1>
        <p style={{ opacity: 0.85, marginTop: "6px", fontSize: "14px" }}>
          Upload a chest X-ray image for AI-powered lung disease detection
        </p>
      </div>

      {/* Upload Section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

        <div style={{
          background: "#ffffff",
          border: "2px dashed #93c5fd",
          borderRadius: "20px",
          padding: "50px 40px",
          width: "100%",
          maxWidth: "520px",
          textAlign: "center",
          boxShadow: "0 4px 16px rgba(59,130,246,0.08)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", bottom: "-20px", right: "-20px",
            fontSize: "120px", opacity: 0.04, userSelect: "none"
          }}>🫁</div>
          <div style={{ fontSize: "52px", marginBottom: "12px" }}>🩻</div>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
            Upload Chest X-ray Image
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "24px" }}>
            Supported formats: JPG, PNG, JPEG
          </p>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ cursor: "pointer" }} />
        </div>

        {image && (
          <div style={{ marginTop: "28px", width: "100%", maxWidth: "520px" }}>
            <div style={{ fontSize: "13px", color: "#64748b", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
              Preview
            </div>
            <img src={image} alt="X-ray Preview" style={{
              width: "100%", borderRadius: "16px",
              border: "2px solid #93c5fd",
              boxShadow: "0 8px 24px rgba(59,130,246,0.12)"
            }} />
          </div>
        )}

        {error && (
          <div style={{ marginTop: "20px", background: "#fee2e2", color: "#ef4444", padding: "12px 20px", borderRadius: "10px", fontSize: "14px" }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginTop: "28px" }}>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              background: loading ? "#94a3b8" : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              color: "white",
              padding: "14px 48px",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "600",
              boxShadow: "0 6px 20px rgba(59,130,246,0.35)",
            }}>
            {loading ? "⏳ Analyzing..." : "🫁 Analyze Lung"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default LungUpload