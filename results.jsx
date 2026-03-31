import { useResult } from "../context/ResultContext"
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import jsPDF from "jspdf"

function getRiskLevel(confidence, predictedClass) {
  if (predictedClass === "Normal") return { label: "Low Risk", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" }
  if (confidence >= 80) return { label: "High Risk", color: "#ef4444", bg: "#fee2e2", border: "#fecaca" }
  if (confidence >= 50) return { label: "Moderate Risk", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" }
  return { label: "Low Risk", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" }
}

const MEDICAL_INFO = {
  "Normal": {
    shouldConsult: false,
    consultNote: "No immediate consultation needed. Routine annual checkup recommended.",
    causes: [
      "Heart is functioning within normal parameters",
      "Regular sinus rhythm detected",
      "No significant abnormalities found"
    ],
    patientAdvice: [
      "Maintain regular exercise (30 mins, 5 days/week)",
      "Follow a heart-healthy diet low in saturated fats",
      "Avoid smoking and limit alcohol consumption",
      "Monitor blood pressure regularly",
      "Schedule annual cardiac checkup"
    ],
    doctorChecklist: [
      "Confirm normal sinus rhythm",
      "Check PR, QRS, QT intervals",
      "Review patient history for risk factors",
      "Assess blood pressure and cholesterol levels"
    ],
    furtherTests: [
      "Annual lipid profile",
      "Blood pressure monitoring",
      "Routine blood work (CBC, metabolic panel)"
    ]
  },
  "Myocardial Infarction": {
    shouldConsult: true,
    consultNote: "URGENT: Consult a cardiologist immediately. This condition requires emergency medical attention.",
    causes: [
      "Blockage in one or more coronary arteries",
      "Reduced blood flow to heart muscle",
      "Possible plaque rupture in coronary artery",
      "Blood clot formation in coronary artery",
      "Risk factors: hypertension, diabetes, smoking, high cholesterol"
    ],
    patientAdvice: [
      "Seek emergency medical care immediately",
      "Do NOT ignore chest pain, shortness of breath, or arm pain",
      "Avoid physical exertion until evaluated by doctor",
      "Take prescribed medications (aspirin if advised)",
      "Inform doctor about all current medications",
      "Have someone accompany you to the hospital"
    ],
    doctorChecklist: [
      "Check ST elevation or depression in leads",
      "Assess Q wave development",
      "Review T wave changes across leads",
      "Order cardiac biomarkers (Troponin I/T, CK-MB)",
      "Assess hemodynamic stability",
      "Evaluate for immediate intervention (PCI/thrombolysis)"
    ],
    furtherTests: [
      "Cardiac Troponin I and T (stat)",
      "CK-MB enzyme test",
      "Coronary angiography",
      "Echocardiogram",
      "Chest X-ray",
      "Complete blood count and metabolic panel",
      "Lipid profile"
    ]
  },
  "Abnormal Heartbeat": {
    shouldConsult: true,
    consultNote: "Consult a cardiologist within 24-48 hours for further evaluation and treatment.",
    causes: [
      "Irregular electrical signals in the heart",
      "Possible atrial or ventricular arrhythmia",
      "Electrolyte imbalance (potassium, magnesium)",
      "Side effects of certain medications",
      "Underlying structural heart disease",
      "Stress, caffeine, or stimulant use"
    ],
    patientAdvice: [
      "Schedule a cardiology appointment soon",
      "Avoid caffeine, alcohol, and stimulants",
      "Monitor for palpitations, dizziness, or fainting",
      "Do not stop any prescribed heart medications",
      "Reduce stress through relaxation techniques",
      "Keep a symptom diary to share with your doctor"
    ],
    doctorChecklist: [
      "Identify type of arrhythmia (AFib, VTach, etc.)",
      "Check heart rate and rhythm consistency",
      "Assess P wave morphology and regularity",
      "Review QRS complex width and shape",
      "Evaluate for pre-excitation (WPW syndrome)",
      "Check electrolyte levels"
    ],
    furtherTests: [
      "24-hour Holter monitor",
      "Event monitor (30-day)",
      "Echocardiogram",
      "Electrolyte panel (K+, Mg2+, Ca2+)",
      "Thyroid function tests",
      "Exercise stress test",
      "Electrophysiology study (if needed)"
    ]
  }
}

function Results() {
  const { heartResult, lungResult } = useResult()
  const navigate = useNavigate()
  const reportRef = useRef()

  function handleDownloadPDF() {
    const pdf = new jsPDF("p", "mm", "a4")
    const info = MEDICAL_INFO[heartResult.predicted_class]
    const risk = getRiskLevel(heartResult.confidence, heartResult.predicted_class)
    let y = 20

    const addText = (text, size, color, bold) => {
      pdf.setFontSize(size)
      pdf.setTextColor(color[0], color[1], color[2])
      pdf.setFont("helvetica", bold ? "bold" : "normal")
      const lines = pdf.splitTextToSize(text, 170)
      lines.forEach(line => {
        if (y > 270) { pdf.addPage(); y = 20 }
        pdf.text(line, 20, y)
        y += size * 0.5
      })
      y += 3
    }

    const addSection = (title, items) => {
      if (y > 250) { pdf.addPage(); y = 20 }
      addText(title, 13, [30, 78, 216], true)
      items.forEach(item => {
        if (y > 270) { pdf.addPage(); y = 20 }
        pdf.setFontSize(11)
        pdf.setTextColor(71, 85, 105)
        pdf.setFont("helvetica", "normal")
        const lines = pdf.splitTextToSize(`• ${item}`, 165)
        lines.forEach(line => {
          pdf.text(line, 25, y)
          y += 6
        })
      })
      y += 4
    }

    // Header
    pdf.setFillColor(29, 78, 216)
    pdf.rect(0, 0, 210, 30, "F")
    pdf.setFontSize(16)
    pdf.setTextColor(255, 255, 255)
    pdf.setFont("helvetica", "bold")
    pdf.text("Cardiopulmonary Risk Assessment Report", 20, 18)
    y = 40

    // Date
    addText(`Generated: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`, 10, [100, 116, 139], false)
    y += 4

    // Result Summary
    addText("HEART ECG ANALYSIS", 14, [30, 78, 216], true)
    addText(`Predicted Condition: ${heartResult.predicted_class}`, 12, [239, 68, 68], true)
    addText(`AI Confidence: ${heartResult.confidence}%`, 12, [30, 78, 216], true)
    addText(`Risk Level: ${risk.label}`, 12, [71, 85, 105], false)
    y += 4

    // Probability
    addText("PROBABILITY BREAKDOWN", 13, [30, 78, 216], true)
    Object.entries(heartResult.all_predictions).forEach(([cls, prob]) => {
      addText(`${cls}: ${prob}%`, 11, [71, 85, 105], false)
    })
    y += 4

    // Causes
    addSection("POSSIBLE CAUSES", info.causes)

    // Consultation
    addText("DOCTOR CONSULTATION", 13, [30, 78, 216], true)
    addText(info.consultNote, 11, [71, 85, 105], false)
    y += 4

    // Patient Advice
    addSection("WHAT YOU SHOULD DO", info.patientAdvice)

    // Doctor Checklist
    addSection("FOR DOCTORS - CLINICAL CHECKLIST", info.doctorChecklist)

    // Further Tests
    addSection("RECOMMENDED FURTHER TESTS", info.furtherTests)

    // Disclaimer
    y += 4
    pdf.setFillColor(241, 245, 249)
    pdf.rect(15, y, 180, 20, "F")
    pdf.setFontSize(9)
    pdf.setTextColor(148, 163, 184)
    pdf.setFont("helvetica", "normal")
    const disclaimer = "DISCLAIMER: This report is generated by an AI model for informational purposes only. It does not constitute medical advice. Always consult a qualified healthcare professional."
    const dLines = pdf.splitTextToSize(disclaimer, 165)
    dLines.forEach(line => { pdf.text(line, 20, y + 6); y += 5 })

    pdf.save("cardiopulmonary-report.pdf")
  }

  const heartInfo = heartResult ? MEDICAL_INFO[heartResult.predicted_class] : null
  const heartRisk = heartResult ? getRiskLevel(heartResult.confidence, heartResult.predicted_class) : null

  return (
    <div>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
        borderRadius: "20px", padding: "30px 40px",
        color: "white", marginBottom: "36px",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-30px", right: "-30px",
          width: "160px", height: "160px",
          background: "rgba(255,255,255,0.06)", borderRadius: "50%"
        }} />
        <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.75, marginBottom: "8px" }}>
          Assessment Report
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: "700" }}>📊 Risk Assessment Results</h1>
        <p style={{ opacity: 0.85, marginTop: "6px", fontSize: "14px" }}>
          AI-generated cardiopulmonary risk analysis
        </p>
      </div>

      <div ref={reportRef}>

        {/* Heart Result */}
        {heartResult ? (
          <div style={{
            background: "#ffffff", borderRadius: "20px",
            border: `1px solid ${heartRisk.border}`,
            padding: "32px", marginBottom: "24px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)"
          }}>

            {/* Title Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "36px" }}>❤️</div>
                <div>
                  <div style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Heart ECG Analysis</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>Cardiac Risk Report</div>
                </div>
              </div>
              <span style={{
                background: heartRisk.bg, color: heartRisk.color,
                padding: "8px 16px", borderRadius: "20px",
                fontSize: "13px", fontWeight: "700",
                border: `1px solid ${heartRisk.border}`
              }}>
                {heartRisk.label}
              </span>
            </div>

            {/* Predicted Class + Confidence */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: "14px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Predicted Condition</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#ef4444", marginTop: "8px" }}>
                  {heartResult.predicted_class}
                </div>
              </div>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: "14px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>AI Confidence</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#1d4ed8", marginTop: "8px" }}>
                  {heartResult.confidence}%
                </div>
              </div>
            </div>

            {/* Probability Bars */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                Probability Breakdown
              </div>
              {Object.entries(heartResult.all_predictions).map(([cls, prob]) => (
                <div key={cls} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                    <span style={{ color: "#0f172a", fontWeight: "500" }}>{cls}</span>
                    <span style={{ fontWeight: "700", color: "#ef4444" }}>{prob}%</span>
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: "8px", height: "8px" }}>
                    <div style={{
                      width: `${prob}%`,
                      background: "linear-gradient(90deg, #be123c, #ef4444)",
                      height: "8px", borderRadius: "8px"
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Possible Causes */}
            <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
                Possible Causes
              </div>
              {heartInfo.causes.map((cause, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                  <span style={{ color: "#ef4444", fontWeight: "700" }}>•</span>
                  <span>{cause}</span>
                </div>
              ))}
            </div>

            {/* Should Consult */}
            <div style={{
              background: heartInfo.shouldConsult ? "#fee2e2" : "#f0fdf4",
              border: `1px solid ${heartInfo.shouldConsult ? "#fecaca" : "#bbf7d0"}`,
              borderRadius: "14px", padding: "20px", marginBottom: "16px"
            }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: heartInfo.shouldConsult ? "#ef4444" : "#16a34a", marginBottom: "8px" }}>
                {heartInfo.shouldConsult ? "Doctor Consultation Required" : "No Immediate Consultation Needed"}
              </div>
              <div style={{ fontSize: "14px", color: "#475569" }}>{heartInfo.consultNote}</div>
            </div>

            {/* Patient Advice */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#92400e", marginBottom: "12px" }}>
                What You Should Do
              </div>
              {heartInfo.patientAdvice.map((advice, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                  <span style={{ color: "#f59e0b", fontWeight: "700" }}>{i + 1}.</span>
                  <span>{advice}</span>
                </div>
              ))}
            </div>

            {/* Doctor Checklist */}
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1d4ed8", marginBottom: "12px" }}>
                For Doctors — Clinical Checklist
              </div>
              {heartInfo.doctorChecklist.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                  <span style={{ color: "#3b82f6", fontWeight: "700" }}>☐</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Further Tests */}
            <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed", marginBottom: "12px" }}>
                Recommended Further Tests
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {heartInfo.furtherTests.map((test, i) => (
                  <span key={i} style={{
                    background: "#ede9fe", color: "#7c3aed",
                    padding: "6px 14px", borderRadius: "20px",
                    fontSize: "13px", fontWeight: "500",
                    border: "1px solid #ddd6fe"
                  }}>
                    {test}
                  </span>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: "#f1f5f9", borderRadius: "12px", padding: "14px 18px" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.6" }}>
                <strong>Disclaimer:</strong> This report is generated by an AI model and is intended for informational purposes only. It does not constitute medical advice. Always consult a qualified healthcare professional for diagnosis and treatment.
              </div>
            </div>

          </div>
        ) : (
          <div style={{
            background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0",
            padding: "40px", textAlign: "center", marginBottom: "24px"
          }}>
            <div style={{ fontSize: "48px" }}>❤️</div>
            <p style={{ color: "#94a3b8", marginTop: "12px" }}>No heart analysis done yet.</p>
            <button onClick={() => navigate("/heart")} style={{
              marginTop: "16px", background: "linear-gradient(135deg, #be123c, #ef4444)",
              color: "white", padding: "10px 28px", border: "none",
              borderRadius: "10px", cursor: "pointer", fontWeight: "600"
            }}>
              Analyze ECG
            </button>
          </div>
        )}

        {/* Lung Result */}
        {lungResult && (
          <div style={{
            background: "#ffffff", borderRadius: "20px",
            border: "1px solid #bfdbfe", padding: "32px", marginBottom: "24px"
          }}>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>Lung Analysis</div>
            <p style={{ color: "#64748b", marginTop: "8px" }}>Lung result will appear here.</p>
          </div>
        )}

      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "32px", marginBottom: "20px" }}>
        {!lungResult && (
          <button onClick={() => navigate("/lung")} style={{
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            color: "white", padding: "14px 32px", border: "none",
            borderRadius: "12px", cursor: "pointer", fontSize: "15px", fontWeight: "600",
            boxShadow: "0 6px 20px rgba(59,130,246,0.35)"
          }}>
            Analyze Lung X-ray
          </button>
        )}
        {heartResult && (
          <button onClick={handleDownloadPDF} style={{
            background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            color: "white", padding: "14px 32px", border: "none",
            borderRadius: "12px", cursor: "pointer", fontSize: "15px", fontWeight: "600",
            boxShadow: "0 6px 20px rgba(124,58,237,0.35)"
          }}>
            Download Report (PDF)
          </button>
        )}
      </div>

    </div>
  )
}

export default Results