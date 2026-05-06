import { useResult } from "../context/ResultContext"
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import jsPDF from "jspdf"

const RADIOLOGICAL_FINDINGS = ["Mass", "Nodule"]

function isRadiologicalFinding(name) {
  return RADIOLOGICAL_FINDINGS.includes(name)
}

function getRiskLevel(confidence, predictedClass) {
  if (predictedClass === "Normal") return { label: "Low Risk", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" }
  if (confidence >= 80) return { label: "High Risk", color: "#ef4444", bg: "#fee2e2", border: "#fecaca" }
  if (confidence >= 50) return { label: "Moderate Risk", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" }
  return { label: "Low Risk", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" }
}

function getLungRiskLevel(confidence) {
  if (confidence >= 80) return { label: "High Risk", color: "#ef4444", bg: "#fee2e2", border: "#fecaca" }
  if (confidence >= 50) return { label: "Moderate Risk", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" }
  return { label: "Low Risk", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" }
}

// ─── Heart Medical Info ──────────────────────────────────────────────────────
const HEART_MEDICAL_INFO = {
  "Normal": {
    shouldConsult: false,
    consultNote: "No immediate consultation needed. Routine annual checkup recommended.",
    causes: ["Heart is functioning within normal parameters", "Regular sinus rhythm detected", "No significant abnormalities found"],
    patientAdvice: ["Maintain regular exercise (30 mins, 5 days/week)", "Follow a heart-healthy diet low in saturated fats", "Avoid smoking and limit alcohol consumption", "Monitor blood pressure regularly", "Schedule annual cardiac checkup"],
    doctorChecklist: ["Confirm normal sinus rhythm", "Check PR, QRS, QT intervals", "Review patient history for risk factors", "Assess blood pressure and cholesterol levels"],
    furtherTests: ["Annual lipid profile", "Blood pressure monitoring", "Routine blood work (CBC, metabolic panel)"]
  },
  "Myocardial Infarction": {
    shouldConsult: true,
    consultNote: "URGENT: Consult a cardiologist immediately. This condition requires emergency medical attention.",
    causes: ["Blockage in one or more coronary arteries", "Reduced blood flow to heart muscle", "Possible plaque rupture in coronary artery", "Blood clot formation in coronary artery", "Risk factors: hypertension, diabetes, smoking, high cholesterol"],
    patientAdvice: ["Seek emergency medical care immediately", "Do NOT ignore chest pain, shortness of breath, or arm pain", "Avoid physical exertion until evaluated by doctor", "Take prescribed medications (aspirin if advised)", "Inform doctor about all current medications", "Have someone accompany you to the hospital"],
    doctorChecklist: ["Check ST elevation or depression in leads", "Assess Q wave development", "Review T wave changes across leads", "Order cardiac biomarkers (Troponin I/T, CK-MB)", "Assess hemodynamic stability", "Evaluate for immediate intervention (PCI/thrombolysis)"],
    furtherTests: ["Cardiac Troponin I and T (stat)", "CK-MB enzyme test", "Coronary angiography", "Echocardiogram", "Chest X-ray", "Complete blood count and metabolic panel", "Lipid profile"]
  },
  "Abnormal Heartbeat": {
    shouldConsult: true,
    consultNote: "Consult a cardiologist within 24-48 hours for further evaluation and treatment.",
    causes: ["Irregular electrical signals in the heart", "Possible atrial or ventricular arrhythmia", "Electrolyte imbalance (potassium, magnesium)", "Side effects of certain medications", "Underlying structural heart disease", "Stress, caffeine, or stimulant use"],
    patientAdvice: ["Schedule a cardiology appointment soon", "Avoid caffeine, alcohol, and stimulants", "Monitor for palpitations, dizziness, or fainting", "Do not stop any prescribed heart medications", "Reduce stress through relaxation techniques", "Keep a symptom diary to share with your doctor"],
    doctorChecklist: ["Identify type of arrhythmia (AFib, VTach, etc.)", "Check heart rate and rhythm consistency", "Assess P wave morphology and regularity", "Review QRS complex width and shape", "Evaluate for pre-excitation (WPW syndrome)", "Check electrolyte levels"],
    furtherTests: ["24-hour Holter monitor", "Event monitor (30-day)", "Echocardiogram", "Electrolyte panel (K+, Mg2+, Ca2+)", "Thyroid function tests", "Exercise stress test", "Electrophysiology study (if needed)"]
  }
}

// ─── Lung Medical Info (12 real diseases only — Mass & Nodule removed) ───────
const LUNG_MEDICAL_INFO = {
  "Atelectasis": {
    shouldConsult: true,
    consultNote: "Consult a pulmonologist within 48 hours for further evaluation.",
    causes: ["Partial or complete collapse of lung tissue", "Blocked airway due to mucus or foreign object", "Post-surgical complication", "Prolonged bed rest or immobility", "Pleural effusion compressing lung tissue"],
    patientAdvice: ["Seek medical attention promptly", "Practice deep breathing exercises", "Avoid smoking and second-hand smoke", "Stay hydrated to keep airways clear", "Follow prescribed respiratory therapy"],
    doctorChecklist: ["Check for breath sounds reduction on affected side", "Assess oxygen saturation levels", "Review recent surgical history", "Order CT scan if X-ray inconclusive", "Evaluate for underlying obstruction"],
    furtherTests: ["CT scan of chest", "Bronchoscopy", "Pulmonary function tests", "Arterial blood gas (ABG)", "Complete blood count"]
  },
  "Cardiomegaly": {
    shouldConsult: true,
    consultNote: "Consult a cardiologist as soon as possible for cardiac evaluation.",
    causes: ["Heart failure (systolic or diastolic)", "High blood pressure (hypertension)", "Coronary artery disease", "Cardiomyopathy", "Valve disease or congenital heart defect"],
    patientAdvice: ["Seek cardiology consultation promptly", "Restrict salt and fluid intake", "Monitor daily weight for sudden changes", "Avoid strenuous physical activity", "Take all prescribed cardiac medications"],
    doctorChecklist: ["Assess cardiothoracic ratio on X-ray", "Order echocardiogram urgently", "Check BNP/NT-proBNP levels", "Review medication history", "Evaluate for signs of heart failure"],
    furtherTests: ["Echocardiogram", "BNP/NT-proBNP blood test", "ECG/EKG", "Cardiac MRI", "Stress test", "Coronary angiography"]
  },
  "Effusion": {
    shouldConsult: true,
    consultNote: "Consult a pulmonologist or cardiologist within 24-48 hours.",
    causes: ["Pleural fluid accumulation around lungs", "Heart failure causing fluid backup", "Infection or pneumonia", "Malignancy (lung or metastatic cancer)", "Kidney or liver disease"],
    patientAdvice: ["Seek medical evaluation promptly", "Avoid strenuous activities", "Monitor for worsening breathlessness", "Report fever, chills, or chest pain immediately", "Follow prescribed diuretic therapy if advised"],
    doctorChecklist: ["Assess dullness to percussion on affected side", "Check for mediastinal shift", "Order ultrasound-guided thoracentesis if large", "Analyze pleural fluid (Light's criteria)", "Evaluate underlying cause"],
    furtherTests: ["Chest ultrasound", "Thoracentesis and pleural fluid analysis", "CT chest with contrast", "Echocardiogram", "LDH, protein, glucose levels"]
  },
  "Infiltration": {
    shouldConsult: true,
    consultNote: "Consult a physician promptly — may indicate active infection or inflammation.",
    causes: ["Bacterial or viral pneumonia", "Aspiration of food or liquid", "Pulmonary edema", "Inflammatory lung disease", "Allergic reaction in lung tissue"],
    patientAdvice: ["Start prescribed antibiotics if bacterial infection confirmed", "Rest and stay well hydrated", "Monitor temperature and oxygen levels", "Avoid smoking", "Return immediately if breathlessness worsens"],
    doctorChecklist: ["Assess fever, cough, and sputum production", "Order sputum culture and sensitivity", "Check CBC for elevated WBC", "Evaluate oxygen saturation", "Consider bronchoscopy if no improvement"],
    furtherTests: ["Sputum culture", "CBC with differential", "CRP and procalcitonin", "Blood cultures", "CT chest"]
  },
  "Pneumonia": {
    shouldConsult: true,
    consultNote: "Consult a physician immediately. Pneumonia requires prompt antibiotic treatment.",
    causes: ["Bacterial infection (Streptococcus pneumoniae most common)", "Viral infection (influenza, COVID-19)", "Aspiration of food or liquids", "Fungal infection in immunocompromised patients", "Hospital-acquired pneumonia"],
    patientAdvice: ["Start prescribed antibiotics immediately", "Rest completely and stay well hydrated", "Monitor oxygen levels with pulse oximeter", "Seek emergency care if oxygen drops below 94%", "Complete full antibiotic course even if feeling better"],
    doctorChecklist: ["Assess CURB-65 score for severity", "Check oxygen saturation and respiratory rate", "Order blood cultures before antibiotics", "Evaluate for complications (empyema, abscess)", "Consider ICU admission if severe"],
    furtherTests: ["Sputum culture and sensitivity", "Blood cultures", "CBC, CRP, procalcitonin", "Urinary antigen test (Legionella, Pneumococcal)", "CT chest if no improvement in 48-72 hours"]
  },
  "Pneumothorax": {
    shouldConsult: true,
    consultNote: "URGENT: Seek emergency medical care immediately. Pneumothorax can be life-threatening.",
    causes: ["Spontaneous rupture of lung bleb", "Trauma or chest injury", "Complication of mechanical ventilation", "Underlying lung disease (COPD, asthma)", "Medical procedure complication"],
    patientAdvice: ["Call emergency services immediately", "Do not delay — this is a medical emergency", "Avoid air travel until fully resolved", "Do not smoke as it increases recurrence risk", "Follow up strictly after treatment"],
    doctorChecklist: ["Check tracheal deviation (tension pneumothorax)", "Assess breath sounds and percussion", "Order urgent chest X-ray", "Evaluate for hemodynamic compromise", "Prepare for chest tube insertion if large"],
    furtherTests: ["Emergency chest X-ray", "CT chest", "ABG analysis", "Pulse oximetry monitoring", "Repeat X-ray post-treatment"]
  },
  "Consolidation": {
    shouldConsult: true,
    consultNote: "Consult a physician promptly. Consolidation often indicates active lung infection.",
    causes: ["Bacterial pneumonia", "Lung abscess", "Pulmonary infarction", "Organizing pneumonia", "Lung cancer filling alveolar space"],
    patientAdvice: ["Start prescribed treatment immediately", "Rest and stay hydrated", "Monitor for worsening fever or breathlessness", "Avoid smoking", "Complete full treatment course"],
    doctorChecklist: ["Assess fever, productive cough, and WBC", "Order sputum culture", "Evaluate for air bronchograms on imaging", "Check for pleural effusion", "Monitor response to antibiotics at 48-72 hours"],
    furtherTests: ["Sputum culture", "CBC with differential", "CT chest", "Blood cultures", "Bronchoscopy if no response to treatment"]
  },
  "Edema": {
    shouldConsult: true,
    consultNote: "URGENT: Consult a cardiologist or pulmonologist immediately. Pulmonary edema is serious.",
    causes: ["Left heart failure", "Fluid overload from kidney disease", "ARDS (Acute Respiratory Distress Syndrome)", "Negative pressure pulmonary edema", "High altitude pulmonary edema"],
    patientAdvice: ["Seek emergency care immediately if breathless at rest", "Strictly follow prescribed diuretic therapy", "Restrict salt intake to less than 2g/day", "Monitor daily weight — report 2kg gain in 2 days", "Elevate head of bed while sleeping"],
    doctorChecklist: ["Assess JVP and peripheral edema", "Check BNP/NT-proBNP levels urgently", "Order echocardiogram", "Evaluate fluid balance and renal function", "Initiate diuretic therapy and oxygen support"],
    furtherTests: ["BNP/NT-proBNP", "Echocardiogram", "Renal function tests", "Chest X-ray serial monitoring", "ABG if severe"]
  },
  "Emphysema": {
    shouldConsult: true,
    consultNote: "Consult a pulmonologist. Emphysema is a chronic condition requiring long-term management.",
    causes: ["Long-term cigarette smoking (primary cause)", "Alpha-1 antitrypsin deficiency", "Chronic exposure to air pollutants", "Occupational dust exposure", "Recurrent respiratory infections"],
    patientAdvice: ["Quit smoking immediately — most important step", "Use prescribed inhalers regularly", "Enroll in pulmonary rehabilitation program", "Get annual flu and pneumococcal vaccines", "Avoid air pollution and cold air exposure"],
    doctorChecklist: ["Assess smoking history and pack-year history", "Order spirometry for GOLD staging", "Check for hyperinflation on X-ray", "Evaluate for concurrent chronic bronchitis", "Consider referral for lung volume reduction"],
    furtherTests: ["Spirometry (FEV1/FVC ratio)", "CT chest (HRCT)", "Alpha-1 antitrypsin level", "ABG", "6-minute walk test", "Echocardiogram for cor pulmonale"]
  },
  "Fibrosis": {
    shouldConsult: true,
    consultNote: "Consult a pulmonologist urgently. Pulmonary fibrosis requires specialist management.",
    causes: ["Idiopathic pulmonary fibrosis (IPF)", "Autoimmune disease (scleroderma, rheumatoid arthritis)", "Chronic hypersensitivity pneumonitis", "Drug-induced (amiodarone, methotrexate)", "Radiation therapy to chest"],
    patientAdvice: ["Seek specialist pulmonology care urgently", "Avoid known triggers (dust, birds, mold)", "Use supplemental oxygen if prescribed", "Consider pulmonary rehabilitation", "Discuss antifibrotic therapy with specialist"],
    doctorChecklist: ["Identify pattern on HRCT (UIP vs NSIP)", "Check autoimmune markers (ANA, RF, anti-CCP)", "Assess medication history for drug causes", "Order BAL and lung biopsy if needed", "Evaluate for lung transplant candidacy"],
    furtherTests: ["HRCT chest", "Pulmonary function tests (TLC, DLCO)", "Autoimmune panel (ANA, RF, anti-CCP)", "BAL analysis", "Surgical lung biopsy if diagnosis unclear"]
  },
  "Pleural_Thickening": {
    shouldConsult: true,
    consultNote: "Consult a pulmonologist for further evaluation of pleural changes.",
    causes: ["Previous pleural infection or empyema", "Asbestos exposure (mesothelioma risk)", "Hemothorax organization", "Previous tuberculosis", "Connective tissue disease"],
    patientAdvice: ["Report any history of asbestos exposure to doctor", "Monitor for new symptoms — chest pain, breathlessness", "Avoid further asbestos exposure completely", "Attend scheduled follow-up imaging", "Report occupational history in detail"],
    doctorChecklist: ["Assess extent and location of thickening", "Inquire about occupational and asbestos exposure", "Check for calcification pattern", "Order CT for mesothelioma evaluation", "Consider thoracentesis if effusion present"],
    furtherTests: ["CT chest with contrast", "PET scan if mesothelioma suspected", "Thoracoscopy and biopsy", "Pulmonary function tests", "Asbestos exposure history documentation"]
  },
  "Hernia": {
    shouldConsult: true,
    consultNote: "Consult a thoracic surgeon for evaluation of diaphragmatic hernia.",
    causes: ["Congenital diaphragmatic defect", "Traumatic injury to diaphragm", "Hiatal hernia (stomach into chest)", "Post-surgical complication", "Increased intra-abdominal pressure"],
    patientAdvice: ["Avoid heavy lifting and straining", "Eat smaller, frequent meals if hiatal hernia", "Elevate head of bed by 30 degrees", "Avoid lying down immediately after meals", "Follow surgical consultation advice"],
    doctorChecklist: ["Assess bowel sounds in chest cavity", "Order CT scan for hernia characterization", "Evaluate for bowel obstruction or strangulation", "Review surgical history", "Assess respiratory compromise"],
    furtherTests: ["CT chest and abdomen", "Barium swallow study", "Upper GI endoscopy if hiatal hernia", "Pulmonary function tests", "Surgical consultation"]
  }
}

// ─── Radiological Finding fallback info ─────────────────────────────────────
const RADIOLOGICAL_FINDING_INFO = {
  patientAdvice: [
    "Consult a pulmonologist or chest specialist as soon as possible",
    "Do not panic — many such findings turn out to be benign (non-cancerous)",
    "Inform your doctor about smoking history, past infections (TB), and occupational exposure",
    "Do not ignore persistent cough, weight loss, or breathlessness",
    "Follow up with CT scan as advised by your doctor"
  ],
  furtherTests: ["CT chest with contrast", "PET-CT scan", "CT-guided biopsy", "Bronchoscopy", "Sputum cytology", "Tumor markers (CEA, CYFRA 21-1)"]
}

// ─── Helper: get best real disease (skip Mass & Nodule) ──────────────────────
function getBestRealDisease(allDiseases) {
  const sorted = Object.entries(allDiseases).sort((a, b) => b[1] - a[1])
  const realDisease = sorted.find(([name]) => !isRadiologicalFinding(name))
  return realDisease || sorted[0]
}

function Results() {
  const { heartResult, lungResult } = useResult()
  const navigate = useNavigate()
  const reportRef = useRef()

  const effectiveLungTop = lungResult
    ? isRadiologicalFinding(lungResult.top_disease)
      ? getBestRealDisease(lungResult.all_diseases)
      : [lungResult.top_disease, lungResult.top_confidence]
    : null

  const hasRadiologicalWarning = lungResult && isRadiologicalFinding(lungResult.top_disease)

  function handleDownloadPDF() {
    const pdf = new jsPDF("p", "mm", "a4")
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
        lines.forEach(line => { pdf.text(line, 25, y); y += 6 })
      })
      y += 4
    }

    pdf.setFillColor(29, 78, 216)
    pdf.rect(0, 0, 210, 30, "F")
    pdf.setFontSize(16)
    pdf.setTextColor(255, 255, 255)
    pdf.setFont("helvetica", "bold")
    pdf.text("Cardiopulmonary Risk Assessment Report", 20, 18)
    y = 40

    addText(`Generated: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`, 10, [100, 116, 139], false)
    y += 4

    if (heartResult) {
      const info = HEART_MEDICAL_INFO[heartResult.predicted_class]
      const risk = getRiskLevel(heartResult.confidence, heartResult.predicted_class)
      addText("HEART ECG ANALYSIS", 14, [30, 78, 216], true)
      addText(`Predicted Condition: ${heartResult.predicted_class}`, 12, [239, 68, 68], true)
      addText(`AI Confidence: ${heartResult.confidence}%`, 12, [30, 78, 216], true)
      addText(`Risk Level: ${risk.label}`, 12, [71, 85, 105], false)
      y += 4
      addText("PROBABILITY BREAKDOWN", 13, [30, 78, 216], true)
      Object.entries(heartResult.all_predictions).forEach(([cls, prob]) => {
        addText(`${cls}: ${prob}%`, 11, [71, 85, 105], false)
      })
      y += 4
      addSection("POSSIBLE CAUSES", info.causes)
      addText("DOCTOR CONSULTATION", 13, [30, 78, 216], true)
      addText(info.consultNote, 11, [71, 85, 105], false)
      y += 4
      addSection("WHAT YOU SHOULD DO", info.patientAdvice)
      addSection("FOR DOCTORS - CLINICAL CHECKLIST", info.doctorChecklist)
      addSection("RECOMMENDED FURTHER TESTS", info.furtherTests)
      y += 4
    }

    if (lungResult) {
      const [topName, topConf] = effectiveLungTop
      const lungInfo = LUNG_MEDICAL_INFO[topName] || LUNG_MEDICAL_INFO["Pneumonia"]
      const lungRisk = getLungRiskLevel(topConf)
      if (y > 200) { pdf.addPage(); y = 20 }
      addText("LUNG X-RAY ANALYSIS", 14, [29, 78, 216], true)
      if (hasRadiologicalWarning) {
        addText(`NOTE: Model flagged "${lungResult.top_disease}" — this is a radiological descriptor, not a confirmed disease. Further evaluation required.`, 11, [220, 38, 38], true)
        y += 4
      }
      addText(`Top Detected Condition: ${topName.replace("_", " ")}`, 12, [29, 78, 216], true)
      addText(`AI Confidence: ${topConf}%`, 12, [30, 78, 216], true)
      addText(`Pneumonia Probability (RSNA): ${lungResult.pneumonia_rsna_confidence}%`, 12, [71, 85, 105], false)
      addText(`Risk Level: ${lungRisk.label}`, 12, [71, 85, 105], false)
      y += 4
      addText("ALL DISEASE PROBABILITIES (Mass & Nodule excluded — not diseases)", 13, [30, 78, 216], true)
      Object.entries(lungResult.all_diseases)
        .filter(([name]) => !isRadiologicalFinding(name))
        .sort((a, b) => b[1] - a[1])
        .forEach(([disease, prob]) => {
          addText(`${disease.replace("_", " ")}: ${prob}%`, 11, [71, 85, 105], false)
        })
      y += 4
      addSection("POSSIBLE CAUSES", lungInfo.causes)
      addText("DOCTOR CONSULTATION", 13, [30, 78, 216], true)
      addText(lungInfo.consultNote, 11, [71, 85, 105], false)
      y += 4
      addSection("WHAT YOU SHOULD DO", lungInfo.patientAdvice)
      addSection("FOR DOCTORS - CLINICAL CHECKLIST", lungInfo.doctorChecklist)
      addSection("RECOMMENDED FURTHER TESTS", lungInfo.furtherTests)
    }

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

  const heartInfo = heartResult ? HEART_MEDICAL_INFO[heartResult.predicted_class] : null
  const heartRisk = heartResult ? getRiskLevel(heartResult.confidence, heartResult.predicted_class) : null
  const lungTopName = effectiveLungTop ? effectiveLungTop[0] : null
  const lungTopConf = effectiveLungTop ? effectiveLungTop[1] : null
  const lungInfo = lungTopName ? (LUNG_MEDICAL_INFO[lungTopName] || LUNG_MEDICAL_INFO["Pneumonia"]) : null
  const lungRisk = lungTopConf ? getLungRiskLevel(lungTopConf) : null

  return (
    <div>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
        borderRadius: "20px", padding: "30px 40px",
        color: "white", marginBottom: "36px",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "160px", height: "160px", background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
        <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.75, marginBottom: "8px" }}>Assessment Report</div>
        <h1 style={{ fontSize: "26px", fontWeight: "700" }}>📊 Risk Assessment Results</h1>
        <p style={{ opacity: 0.85, marginTop: "6px", fontSize: "14px" }}>AI-generated cardiopulmonary risk analysis</p>
      </div>

      <div ref={reportRef}>

        {/* ───────────── HEART RESULT ───────────── */}
        {heartResult ? (
          <div style={{ background: "#ffffff", borderRadius: "20px", border: `1px solid ${heartRisk.border}`, padding: "32px", marginBottom: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "36px" }}>❤️</div>
                <div>
                  <div style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Heart ECG Analysis</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>Cardiac Risk Report</div>
                </div>
              </div>
              <span style={{ background: heartRisk.bg, color: heartRisk.color, padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: `1px solid ${heartRisk.border}` }}>{heartRisk.label}</span>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: "14px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Predicted Condition</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#ef4444", marginTop: "8px" }}>{heartResult.predicted_class}</div>
              </div>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: "14px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>AI Confidence</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#1d4ed8", marginTop: "8px" }}>{heartResult.confidence}%</div>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Probability Breakdown</div>
              {Object.entries(heartResult.all_predictions).map(([cls, prob]) => (
                <div key={cls} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                    <span style={{ color: "#0f172a", fontWeight: "500" }}>{cls}</span>
                    <span style={{ fontWeight: "700", color: "#ef4444" }}>{prob}%</span>
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: "8px", height: "8px" }}>
                    <div style={{ width: `${prob}%`, background: "linear-gradient(90deg, #be123c, #ef4444)", height: "8px", borderRadius: "8px" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Possible Causes</div>
              {heartInfo.causes.map((cause, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                  <span style={{ color: "#ef4444", fontWeight: "700" }}>•</span><span>{cause}</span>
                </div>
              ))}
            </div>
            <div style={{ background: heartInfo.shouldConsult ? "#fee2e2" : "#f0fdf4", border: `1px solid ${heartInfo.shouldConsult ? "#fecaca" : "#bbf7d0"}`, borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: heartInfo.shouldConsult ? "#ef4444" : "#16a34a", marginBottom: "8px" }}>
                {heartInfo.shouldConsult ? "⚠️ Doctor Consultation Required" : "✅ No Immediate Consultation Needed"}
              </div>
              <div style={{ fontSize: "14px", color: "#475569" }}>{heartInfo.consultNote}</div>
            </div>
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#92400e", marginBottom: "12px" }}>What You Should Do</div>
              {heartInfo.patientAdvice.map((advice, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                  <span style={{ color: "#f59e0b", fontWeight: "700" }}>{i + 1}.</span><span>{advice}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1d4ed8", marginBottom: "12px" }}>For Doctors — Clinical Checklist</div>
              {heartInfo.doctorChecklist.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                  <span style={{ color: "#3b82f6", fontWeight: "700" }}>☐</span><span>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed", marginBottom: "12px" }}>Recommended Further Tests</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {heartInfo.furtherTests.map((test, i) => (
                  <span key={i} style={{ background: "#ede9fe", color: "#7c3aed", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "500", border: "1px solid #ddd6fe" }}>{test}</span>
                ))}
              </div>
            </div>
            <div style={{ background: "#f1f5f9", borderRadius: "12px", padding: "14px 18px" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.6" }}>
                <strong>Disclaimer:</strong> This report is generated by an AI model for informational purposes only. Always consult a qualified healthcare professional.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "40px", textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "48px" }}>❤️</div>
            <p style={{ color: "#94a3b8", marginTop: "12px" }}>No heart analysis done yet.</p>
            <button onClick={() => navigate("/heart")} style={{ marginTop: "16px", background: "linear-gradient(135deg, #be123c, #ef4444)", color: "white", padding: "10px 28px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>Analyze ECG</button>
          </div>
        )}

        {/* ───────────── LUNG RESULT ───────────── */}
        {lungResult ? (
          <div style={{ background: "#ffffff", borderRadius: "20px", border: `1px solid ${lungRisk.border}`, padding: "32px", marginBottom: "24px", boxShadow: "0 4px 16px rgba(59,130,246,0.08)" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "36px" }}>🫁</div>
                <div>
                  <div style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Lung X-ray Analysis</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>Pulmonary Risk Report</div>
                </div>
              </div>
              <span style={{ background: lungRisk.bg, color: lungRisk.color, padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: `1px solid ${lungRisk.border}` }}>{lungRisk.label}</span>
            </div>

            {/* ── Radiological Warning Banner ── */}
            {hasRadiologicalWarning && (
              <div style={{
                background: "linear-gradient(135deg, #fef3c7, #fef9ee)",
                border: "1px solid #fcd34d",
                borderRadius: "14px",
                padding: "18px 20px",
                marginBottom: "20px",
                display: "flex",
                gap: "14px",
                alignItems: "flex-start"
              }}>
                <div style={{ fontSize: "24px", flexShrink: 0 }}>⚠️</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#92400e", marginBottom: "6px" }}>
                    Unusual Shadow Detected on X-ray — Not a Confirmed Disease
                  </div>
                  <div style={{ fontSize: "13px", color: "#78350f", lineHeight: "1.7" }}>
                    The AI model detected a <strong>"{lungResult.top_disease}"</strong> on your X-ray. This is a <strong>radiological descriptor</strong> — it means something unusual was seen in the image, but <strong>it is not a diagnosis</strong>. It could be caused by an old infection scar (like TB), a benign growth, fluid, or in rare cases, something requiring further evaluation.
                  </div>
                  <div style={{ fontSize: "13px", color: "#92400e", marginTop: "10px", fontWeight: "600", background: "#fef3c7", padding: "8px 12px", borderRadius: "8px", display: "inline-block" }}>
                    👉 Please consult a pulmonologist for a CT scan and proper diagnosis. Do not self-diagnose or panic.
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: "14px", padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Top Condition</div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#1d4ed8", marginTop: "6px" }}>
                  {lungTopName.replace("_", " ")}
                </div>
                {hasRadiologicalWarning && (
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>next highest real disease</div>
                )}
              </div>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: "14px", padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>AI Confidence</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#1d4ed8", marginTop: "6px" }}>{lungTopConf}%</div>
              </div>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: "14px", padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Pneumonia Prob.</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#1d4ed8", marginTop: "6px" }}>{lungResult.pneumonia_rsna_confidence}%</div>
              </div>
            </div>

            {/* ── ALL 12 REAL DISEASES DASHBOARD ── */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🔬</span> Disease Risk Overview — All Conditions
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>
                Showing 12 clinically diagnosed conditions. "Mass" and "Nodule" are excluded — they are radiological descriptors, not diseases.
              </div>

              {Object.entries(lungResult.all_diseases)
                .filter(([name]) => !isRadiologicalFinding(name))
                .sort((a, b) => b[1] - a[1])
                .map(([disease, prob]) => {
                  const isHigh = prob >= 60
                  const isMed = prob >= 30 && prob < 60
                  const isTop = disease === lungTopName

                  const barColor = isTop
                    ? "linear-gradient(90deg, #1e40af, #3b82f6)"
                    : isHigh
                    ? "linear-gradient(90deg, #dc2626, #ef4444)"
                    : isMed
                    ? "linear-gradient(90deg, #b45309, #f59e0b)"
                    : "linear-gradient(90deg, #475569, #94a3b8)"

                  const rowBg = isTop ? "linear-gradient(135deg, #eff6ff, #dbeafe)" : isHigh ? "#fef2f2" : isMed ? "#fffbeb" : "#f8fafc"
                  const borderColor = isTop ? "#bfdbfe" : isHigh ? "#fecaca" : isMed ? "#fde68a" : "#e2e8f0"
                  const probColor = isTop ? "#1d4ed8" : isHigh ? "#dc2626" : isMed ? "#d97706" : "#64748b"

                  return (
                    <div key={disease} style={{ background: rowBg, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "12px 16px", marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {isTop && <span style={{ background: "#1d4ed8", color: "white", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>TOP</span>}
                          {!isTop && isHigh && <span style={{ background: "#fee2e2", color: "#dc2626", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px", border: "1px solid #fecaca" }}>HIGH</span>}
                          {isMed && !isTop && <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px", border: "1px solid #fde68a" }}>MED</span>}
                          <span style={{ fontSize: "14px", fontWeight: isHigh || isTop ? "700" : "500", color: "#0f172a" }}>
                            {disease.replace("_", " ")}
                          </span>
                        </div>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: probColor, minWidth: "52px", textAlign: "right" }}>{prob}%</span>
                      </div>
                      <div style={{ background: "#e2e8f0", borderRadius: "8px", height: "6px" }}>
                        <div style={{ width: `${Math.min(prob, 100)}%`, background: barColor, height: "6px", borderRadius: "8px" }} />
                      </div>
                    </div>
                  )
                })}

              {/* Legend */}
              <div style={{ display: "flex", gap: "16px", marginTop: "14px", flexWrap: "wrap" }}>
                {[
                  { color: "#1d4ed8", label: "Top Finding" },
                  { color: "#ef4444", label: "High Risk (≥60%)" },
                  { color: "#f59e0b", label: "Moderate (30–59%)" },
                  { color: "#94a3b8", label: "Low (<30%)" }
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: color, display: "inline-block" }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Grad-CAM */}
            {lungResult.gradcam_heatmap && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Grad-CAM — Disease Region Highlighted</div>
                <img src={`data:image/jpeg;base64,${lungResult.gradcam_heatmap}`} alt="Grad-CAM Heatmap" style={{ width: "100%", maxWidth: "400px", borderRadius: "12px", border: "2px solid #bfdbfe" }} />
              </div>
            )}

            {/* Medical panels for top real disease */}
            <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Possible Causes</div>
              {lungInfo.causes.map((cause, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                  <span style={{ color: "#1d4ed8", fontWeight: "700" }}>•</span><span>{cause}</span>
                </div>
              ))}
            </div>

            {/* Extra panel if radiological finding was detected */}
            {hasRadiologicalWarning && (
              <div style={{ background: "#fef9ee", border: "1px solid #fcd34d", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#92400e", marginBottom: "12px" }}>🔎 Next Steps for the Suspicious Shadow</div>
                {RADIOLOGICAL_FINDING_INFO.patientAdvice.map((advice, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                    <span style={{ color: "#f59e0b", fontWeight: "700" }}>{i + 1}.</span><span>{advice}</span>
                  </div>
                ))}
                <div style={{ marginTop: "14px" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#92400e", marginBottom: "8px" }}>Tests Recommended for Further Evaluation:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {RADIOLOGICAL_FINDING_INFO.furtherTests.map((test, i) => (
                      <span key={i} style={{ background: "#fef3c7", color: "#92400e", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", border: "1px solid #fcd34d" }}>{test}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#ef4444", marginBottom: "8px" }}>⚠️ Doctor Consultation Required</div>
              <div style={{ fontSize: "14px", color: "#475569" }}>{lungInfo.consultNote}</div>
            </div>
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#92400e", marginBottom: "12px" }}>What You Should Do</div>
              {lungInfo.patientAdvice.map((advice, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                  <span style={{ color: "#f59e0b", fontWeight: "700" }}>{i + 1}.</span><span>{advice}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1d4ed8", marginBottom: "12px" }}>For Doctors — Clinical Checklist</div>
              {lungInfo.doctorChecklist.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "14px", color: "#475569" }}>
                  <span style={{ color: "#3b82f6", fontWeight: "700" }}>☐</span><span>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed", marginBottom: "12px" }}>Recommended Further Tests</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {lungInfo.furtherTests.map((test, i) => (
                  <span key={i} style={{ background: "#ede9fe", color: "#7c3aed", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "500", border: "1px solid #ddd6fe" }}>{test}</span>
                ))}
              </div>
            </div>
            <div style={{ background: "#f1f5f9", borderRadius: "12px", padding: "14px 18px" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.6" }}>
                <strong>Disclaimer:</strong> This report is generated by an AI model for informational purposes only. Always consult a qualified healthcare professional.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "40px", textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "48px" }}>🫁</div>
            <p style={{ color: "#94a3b8", marginTop: "12px" }}>No lung analysis done yet.</p>
            <button onClick={() => navigate("/lung")} style={{ marginTop: "16px", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", color: "white", padding: "10px 28px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>Analyze X-ray</button>
          </div>
        )}

      </div>

      {/* Download Button */}
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "32px", marginBottom: "20px" }}>
        {(heartResult || lungResult) && (
          <button onClick={handleDownloadPDF} style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", color: "white", padding: "14px 32px", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "15px", fontWeight: "600", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>
            Download Report (PDF)
          </button>
        )}
      </div>

    </div>
  )
}

export default Results
