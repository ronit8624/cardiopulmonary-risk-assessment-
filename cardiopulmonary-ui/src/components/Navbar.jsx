function Navbar() {
  return (
    <div style={{
      height: "64px",
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      padding: "0 36px",
      justifyContent: "space-between",
      boxShadow: "0 1px 6px rgba(14,30,60,0.06)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
          borderRadius: "10px",
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px"
        }}>
          🫀
        </div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a", letterSpacing: "-0.3px" }}>
            Cardiopulmonary Risk System
          </div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>
            AI-Powered Medical Analysis
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{
          background: "linear-gradient(135deg, #dbeafe, #e0f2fe)",
          color: "#1d4ed8",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          border: "1px solid #bfdbfe"
        }}>
          ✦ AI Powered
        </span>
        <span style={{
          background: "#f0fdf4",
          color: "#16a34a",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          border: "1px solid #bbf7d0"
        }}>
          ● Live
        </span>
      </div>

    </div>
  )
}

export default Navbar