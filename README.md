# Cardiopulmonary Risk Assessment System

A multi-organ AI-powered diagnostic tool for detecting cardiac and pulmonary conditions using deep learning models. Built as a Final Year B.Tech CSE Project at UPES Dehradun.

## Overview

This system analyzes medical inputs — ECG images and chest X-rays — and provides risk assessments for heart and lung conditions using trained CNN models, presented through an intuitive web interface with downloadable PDF reports.

## Modules

### Heart Module
- Model: CNN (ResNet50V2-based), trained on ECG images
- Accuracy: 89–92%
- Classes: Abnormal Heartbeat, Myocardial Infarction, Normal
- Output: Probability scores, possible causes, doctor checklist, recommended tests, PDF report

### Lung Module
- Model: DenseNet121
- Input: Chest X-ray images
- Output: Pulmonary condition risk assessment

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JS |
| Backend | FastAPI (Python) |
| ML Framework | TensorFlow / Keras |
