import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>

      <div style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)",
        borderRadius: "20px",
        padding: "36px 40px",
        color: "white",
        marginBottom: "36px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "200px", height: "200px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", right: "120px",
          width: "150px", height: "150px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "50%"
        }} />
        <div style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.7, marginBottom: "10px" }}>
          Welcome to
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: "700", letterSpacing: "-0.5px" }}>
          Cardiopulmonary Risk Assessment
        </h1>
        <p style={{ opacity: 0.8, marginTop: "8px", fontSize: "15px" }}>
          AI-powered analysis for Heart ECG & Lung X-ray imaging
        </p>
        <div style={{ display: "flex", gap: "20px", marginTop: "24px" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 20px" }}>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>2</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Analysis Modules</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 20px" }}>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>AI</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Powered Engine</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 20px" }}>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>99%</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Accuracy Target</div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: "13px", color: "#64748b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
        Select Analysis Module
      </div>

      <div style={{ display: "flex", gap: "24px" }}>

        <div
          onClick={() => navigate("/heart")}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            padding: "32px",
            borderRadius: "20px",
            width: "280px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(14,30,60,0.06)",
            transition: "all 0.25s ease",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-6px)"
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(239,68,68,0.15)"
            e.currentTarget.style.borderColor = "#fca5a5"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0px)"
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,30,60,0.06)"
            e.currentTarget.style.borderColor = "#e2e8f0"
          }}
        >
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: "80px", height: "80px",
            background: "linear-gradient(135deg, rgba(254,226,226,0.6), transparent)",
            borderRadius: "0 20px 0 80px"
          }} />
          <div style={{
            background: "linear-gradient(135deg, #fee2e2, #fecaca)",
            width: "56px", height: "56px",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", marginBottom: "16px"
          }}>❤️</div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>Heart Analysis</h2>
          <p style={{ marginTop: "8px", color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
            Upload ECG image for AI-powered heart risk assessment
          </p>
          <div style={{
            marginTop: "20px", color: "#ef4444",
            fontWeight: "600", fontSize: "13px",
            display: "flex", alignItems: "center", gap: "6px"
          }}>
            Start Analysis <span>→</span>
          </div>
        </div>

        <div
          onClick={() => navigate("/lung")}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            padding: "32px",
            borderRadius: "20px",
            width: "280px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(14,30,60,0.06)",
            transition: "all 0.25s ease",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-6px)"
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(59,130,246,0.15)"
            e.currentTarget.style.borderColor = "#93c5fd"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0px)"
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,30,60,0.06)"
            e.currentTarget.style.borderColor = "#e2e8f0"
          }}
        >
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: "80px", height: "80px",
            background: "linear-gradient(135deg, rgba(219,234,254,0.6), transparent)",
            borderRadius: "0 20px 0 80px"
          }} />
          <div style={{
            background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
            width: "56px", height: "56px",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", marginBottom: "16px"
          }}>🫁</div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>Lung Analysis</h2>
          <p style={{ marginTop: "8px", color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
            Upload X-ray image for AI-powered lung risk assessment
          </p>
          <div style={{
            marginTop: "20px", color: "#3b82f6",
            fontWeight: "600", fontSize: "13px",
            display: "flex", alignItems: "center", gap: "6px"
          }}>
            Start Analysis <span>→</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard