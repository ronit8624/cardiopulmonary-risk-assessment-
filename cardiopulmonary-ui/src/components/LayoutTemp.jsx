import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{
          flex: 1,
          padding: "36px 40px",
          position: "relative",
          backgroundColor: "#eef2f7",
          backgroundImage: `
            radial-gradient(circle at 15% 15%, rgba(59,130,246,0.08) 0%, transparent 40%),
            radial-gradient(circle at 85% 85%, rgba(14,165,233,0.08) 0%, transparent 40%),
            radial-gradient(circle at 85% 15%, rgba(99,102,241,0.05) 0%, transparent 30%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3C!-- ECG line --%3E%3Cpolyline points='0,400 60,400 80,400 100,340 120,460 140,300 160,500 180,400 220,400 240,380 260,420 280,400 800,400' stroke='%233b82f6' stroke-width='1.5' fill='none' opacity='0.08'/%3E%3C!-- Cross symbols --%3E%3Cline x1='50' y1='80' x2='50' y2='120' stroke='%233b82f6' stroke-width='2' opacity='0.08'/%3E%3Cline x1='30' y1='100' x2='70' y2='100' stroke='%233b82f6' stroke-width='2' opacity='0.08'/%3E%3Cline x1='700' y1='180' x2='700' y2='220' stroke='%230ea5e9' stroke-width='2' opacity='0.08'/%3E%3Cline x1='680' y1='200' x2='720' y2='200' stroke='%230ea5e9' stroke-width='2' opacity='0.08'/%3E%3Cline x1='120' y1='650' x2='120' y2='690' stroke='%233b82f6' stroke-width='2' opacity='0.08'/%3E%3Cline x1='100' y1='670' x2='140' y2='670' stroke='%233b82f6' stroke-width='2' opacity='0.08'/%3E%3Cline x1='680' y1='600' x2='680' y2='640' stroke='%230ea5e9' stroke-width='2' opacity='0.08'/%3E%3Cline x1='660' y1='620' x2='700' y2='620' stroke='%230ea5e9' stroke-width='2' opacity='0.08'/%3E%3C!-- Heart shape --%3E%3Cpath d='M400 720 C380 700 340 680 340 650 C340 630 360 620 380 635 C390 642 400 655 400 655 C400 655 410 642 420 635 C440 620 460 630 460 650 C460 680 420 700 400 720Z' fill='%23ef4444' opacity='0.05'/%3E%3C!-- Circles --%3E%3Ccircle cx='200' cy='200' r='60' stroke='%233b82f6' stroke-width='1' fill='none' opacity='0.05'/%3E%3Ccircle cx='200' cy='200' r='40' stroke='%233b82f6' stroke-width='1' fill='none' opacity='0.05'/%3E%3Ccircle cx='600' cy='600' r='80' stroke='%230ea5e9' stroke-width='1' fill='none' opacity='0.05'/%3E%3Ccircle cx='600' cy='600' r='55' stroke='%230ea5e9' stroke-width='1' fill='none' opacity='0.05'/%3E%3C!-- Dots grid --%3E%3Ccircle cx='100' cy='300' r='2' fill='%233b82f6' opacity='0.08'/%3E%3Ccircle cx='150' cy='300' r='2' fill='%233b82f6' opacity='0.08'/%3E%3Ccircle cx='200' cy='300' r='2' fill='%233b82f6' opacity='0.08'/%3E%3Ccircle cx='250' cy='300' r='2' fill='%233b82f6' opacity='0.08'/%3E%3Ccircle cx='550' cy='150' r='2' fill='%230ea5e9' opacity='0.08'/%3E%3Ccircle cx='600' cy='150' r='2' fill='%230ea5e9' opacity='0.08'/%3E%3Ccircle cx='650' cy='150' r='2' fill='%230ea5e9' opacity='0.08'/%3E%3Ccircle cx='700' cy='150' r='2' fill='%230ea5e9' opacity='0.08'/%3E%3C/svg%3E")
          `,
          backgroundSize: "auto, auto, auto, 800px 800px",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat, repeat",
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout