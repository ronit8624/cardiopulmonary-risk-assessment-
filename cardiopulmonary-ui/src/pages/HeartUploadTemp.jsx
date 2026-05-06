import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useResult } from "../context/ResultContext"

function HeartUpload() {
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setHeartResult } = useResult()
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
      const response = await fetch("http://127.0.0.1:8000/predict/heart", {
        method: "POST",
        body: formData
      })
      const data = await response.json()
      setHeartResult(data)
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
        background: "linear-gradient(135deg, #be123c 0%, #ef4444 60%, #f97316 100%)",
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
          <polyline points="0,30 60,30 80,30 100,10 120,50 140,5 160,55 180,30 220,30 240,20 260,40 280,30 600,30"
            stroke="white" strokeWidth="2" fill="none" />
        </svg>
        <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.75, marginBottom: "8px" }}>
          Module 01 — Cardiac Analysis
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.5px" }}>
          ❤️ Heart ECG Analysis
        </h1>
        <p style={{ opacity: 0.85, marginTop: "6px", fontSize: "14px" }}>
          Upload a 12-lead ECG image for AI-powered cardiac risk detection
        </p>
      </div>

      {/* Upload Section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

        <div style={{
          background: "#ffffff",
          border: "2px dashed #fca5a5",
          borderRadius: "20px",
          padding: "50px 40px",
          width: "100%",
          maxWidth: "520px",
          textAlign: "center",
          boxShadow: "0 4px 16px rgba(239,68,68,0.08)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", bottom: "-20px", right: "-20px",
            fontSize: "120px", opacity: 0.04, userSelect: "none"
          }}>❤️</div>
          <div style={{ fontSize: "52px", marginBottom: "12px" }}>📋</div>
          <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
            Upload ECG Image
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
            <img src={image} alt="ECG Preview" style={{
              width: "100%", borderRadius: "16px",
              border: "2px solid #fca5a5",
              boxShadow: "0 8px 24px rgba(239,68,68,0.12)"
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
              background: loading ? "#94a3b8" : "linear-gradient(135deg, #be123c, #ef4444)",
              color: "white",
              padding: "14px 48px",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "600",
              boxShadow: "0 6px 20px rgba(239,68,68,0.35)",
            }}>
            {loading ? "⏳ Analyzing..." : "❤️ Analyze ECG"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default HeartUpload