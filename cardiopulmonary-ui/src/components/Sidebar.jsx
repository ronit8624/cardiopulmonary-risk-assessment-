import { Link, useLocation } from "react-router-dom"

function Sidebar() {
  const location = useLocation()

  const linkStyle = {
    color: "#93c5fd",
    textDecoration: "none",
    padding: "11px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.2s ease"
  }

  const activeLinkStyle = {
    ...linkStyle,
    background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(37,99,235,0.4)"
  }

  return (
    <div style={{
      width: "230px",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
      color: "white",
      padding: "28px 16px",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #1e3a5f"
    }}>

      <div style={{ marginBottom: "36px", paddingLeft: "8px" }}>
        <div style={{ fontSize: "22px", fontWeight: "700", color: "#f0f9ff", letterSpacing: "-0.5px" }}>
          🫀 AI Health
        </div>
        <div style={{
          color: "#38bdf8",
          fontSize: "11px",
          marginTop: "4px",
          letterSpacing: "1.5px",
          textTransform: "uppercase"
        }}>
          Risk Assessment System
        </div>
      </div>

      <div style={{
        fontSize: "10px",
        color: "#475569",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        paddingLeft: "8px",
        marginBottom: "10px"
      }}>
        Navigation
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Link to="/" style={location.pathname === "/" ? activeLinkStyle : linkStyle}>🏠 Dashboard</Link>
        <Link to="/heart" style={location.pathname === "/heart" ? activeLinkStyle : linkStyle}>❤️ Heart ECG</Link>
        <Link to="/lung" style={location.pathname === "/lung" ? activeLinkStyle : linkStyle}>🫁 Lung X-ray</Link>
        <Link to="/results" style={location.pathname === "/results" ? activeLinkStyle : linkStyle}>📊 Results</Link>
        <Link to="/chatbot" style={location.pathname === "/chatbot" ? activeLinkStyle : linkStyle}>🤖 Chatbot</Link>
      </nav>

      <div style={{
        marginTop: "auto",
        padding: "16px",
        background: "rgba(37,99,235,0.1)",
        borderRadius: "12px",
        border: "1px solid rgba(37,99,235,0.2)"
      }}>
        <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "600" }}>🔒 Secure & Private</div>
        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Your data stays on device</div>
      </div>

    </div>
  )
}

export default Sidebar