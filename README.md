# CardioSense AI — Educational Heart Health Screening Platform

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Dataset: CDC BRFSS 2021](https://img.shields.io/badge/Dataset-CDC_BRFSS_2021-teal.svg)](https://www.cdc.gov/brfss/annual_data/annual_2021.html)
[![Model Version](https://img.shields.io/badge/Model-v1.4.2--calibrated--hgb-emerald.svg)]()
[![PR-AUC](https://img.shields.io/badge/PR--AUC-0.452-green.svg)]()

CardioSense AI is a full-stack, production-grade educational cardiovascular risk screening application. It utilizes machine learning models trained on an exact, stratified sample of 40,000 valid records from the official **Centers for Disease Control and Prevention (CDC) Behavioral Risk Factor Surveillance System (BRFSS) 2021** dataset to estimate the likelihood that a user belongs to a cohort reporting diagnosed coronary heart disease or prior myocardial infarction (`_MICHD`).

> **CRITICAL MEDICAL NOTICE:** CardioSense AI is strictly an educational public health screening tool. It is **NOT** a medical diagnostic system, does not assess acute clinical emergencies, and does not substitute for a consultation with a licensed physician. For acute symptoms (chest pressure, shortness of breath, sudden numbness, or syncope), call 911 immediately.

---

## Key Features & Highlights

1. **Non-Leaking Surveillance Feature Modeling:**
   - Evaluates 13 validated non-leaking lifestyle, biometric, and medical history inputs (Age group, Biological sex, BMI, Tobacco smoking, Physical activity, Sleep duration, Blood pressure, Cholesterol, Diabetes, Mobility, Stroke history, and General health perception).
   - Strictly isolates target variables and avoids post-infarction medical leakage.

2. **Calibrated Machine Learning Engine:**
   - 4 architectures benchmarked: Logistic Regression, Random Forest, HistGradientBoosting, and TensorFlow/Keras Deep Neural Network.
   - **HistGradientBoosting** selected as champion (PR-AUC 0.452, Brier score 0.059, Recall 46.8%).
   - Calibrated using **Platt scaling and Isotonic regression** (`CalibratedClassifierCV`) to output true empirical probabilities rather than uncalibrated overconfident scores.
   - **Honest Tabular Benchmarking:** Deep Learning did not outperform gradient boosted decision trees on tabular survey features (PR-AUC 0.407 vs 0.452).

3. **Local Explainability via SHAP:**
   - Individualized SHAP (SHapley Additive exPlanations) factor waterfall showing how each input raises or lowers estimated likelihood relative to the CDC 8.81% national baseline.

4. **Multi-Step Responsive Assessment Form:**
   - Real-time BMI calculator from height and weight.
   - Local draft auto-saving to `localStorage`.
   - Biological bounds validation and friendly error guidance.
   - Mandatory non-diagnostic acknowledgement.

5. **Patient Dashboard & Longitudinal Trend:**
   - User profile session isolation.
   - Longitudinal risk trajectory chart across multiple screening evaluations.
   - Complete data ownership with a "Delete My Data" feature.
   - One-click PDF clinical summary export via `jsPDF`.

6. **Continuous MLOps Surveillance Dashboard:**
   - Population Stability Index (PSI) data drift tracking against the 40,000 training baseline.
   - 5 active real-time alert rules (latency, error rate, drift, prediction shift, subgroup disparity).
   - Human-in-the-loop retraining validation gate requiring clinical review sign-off before model promotion.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons, jsPDF
- **Backend API:** Python 3.11, FastAPI, Pydantic v2, Uvicorn
- **Machine Learning:** scikit-learn 1.6, TensorFlow/Keras, SHAP, NumPy, Pandas
- **Database:** PostgreSQL 16
- **MLOps & Telemetry:** Population Stability Index (PSI) monitoring, Prometheus metrics
- **Deployment:** Docker, Docker Compose, GitHub Actions CI/CD

---

## Project Structure

```
├── .github/workflows/ci.yml       # GitHub Actions CI/CD Pipeline
├── backend/
│   ├── main.py                   # FastAPI REST API with versioning (/api/v1/*)
│   ├── model_service.py          # Calibrated inference & SHAP explainability
│   ├── schemas.py                # Pydantic v2 validation models
│   └── requirements.txt          # Python dependencies
├── ml_pipeline/
│   ├── data_cleaning.py          # CDC BRFSS 2021 cleaner & 40k stratified sampler
│   ├── train.py                  # 4-model trainer, 5-fold CV, calibration pipeline
│   └── model_card.md             # Standardized Mitchell et al. Model Card
├── docs/
│   ├── DATA_DICTIONARY.md        # Comprehensive CDC BRFSS variable documentation
│   └── ARCHITECTURE.md           # System design, data flow & MLOps specification
├── src/
│   ├── components/               # React UI Components
│   │   ├── Header.tsx            # Top Bar Contract navigation
│   │   ├── LandingHero.tsx       # Landing page with hero stage & metrics
│   │   ├── AssessmentForm.tsx    # Multi-step assessment with BMI calculator
│   │   ├── RiskGauge.tsx         # SVG calibrated dial & needle
│   │   ├── PredictionView.tsx    # Results, SHAP factors & prevention guidance
│   │   ├── ModelTransparency.tsx # ROC, PR, calibration curves & fairness audit
│   │   ├── MLOpsDashboard.tsx    # Telemetry, PSI drift & retraining gate
│   │   ├── UserDashboard.tsx     # Longitudinal trend & history deletion
│   │   └── DataDictionaryView.tsx# Interactive codebook search & filters
│   ├── data/
│   │   ├── dataDictionary.ts     # CDC BRFSS metadata & rationale
│   │   └── modelBenchmarks.ts    # 4-model validation data & curves
│   ├── services/
│   │   └── cardioModelEngine.ts  # Calibrated scoring & SHAP calculation
│   ├── utils/
│   │   └── pdfGenerator.ts       # jsPDF assessment summary export
│   └── types/cardio.ts           # TypeScript type definitions
├── tests/
│   └── test_pipeline.py          # Unit tests: validation, leakage, reproducibility
├── docker-compose.yml             # Multi-container Docker configuration
├── Dockerfile.backend            # Multi-stage Python FastAPI container
├── Dockerfile.frontend           # Multi-stage Node/Nginx container
└── README.md                     # Documentation & project report
```

---

## Local Setup & Quick Start

### Option 1: Docker Compose (Recommended for Full Stack)

```bash
# 1. Clone repository
git clone https://github.com/cardiosense/cardiosense-ai.git
cd cardiosense-ai

# 2. Build and launch all services (frontend, backend, PostgreSQL, Prometheus)
docker-compose up --build

# 3. Access endpoints:
# - Frontend Application: http://localhost:3000
# - Backend FastAPI Docs: http://localhost:8000/docs
# - Prometheus Metrics:   http://localhost:9090
```

### Option 2: Local Development (Node.js & Python)

#### Frontend (Node.js 20+):
```bash
npm install
npm run dev
# Vite server running on http://localhost:3000
```

#### Backend (Python 3.11):
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Running Tests:
```bash
# Run backend validation, leakage, and drift unit tests
pytest tests/test_pipeline.py -v

# Run frontend typechecking and linting
npm run lint
```

---

## Dataset Citation & Source Instructions

- **Citation:** Centers for Disease Control and Prevention (CDC). *Behavioral Risk Factor Surveillance System Survey Data 2021*. Atlanta, Georgia: U.S. Department of Health and Human Services, Centers for Disease Control and Prevention, 2021.
- **Official Source URL:** [https://www.cdc.gov/brfss/annual_data/annual_2021.html](https://www.cdc.gov/brfss/annual_data/annual_2021.html)
- **Data Acquisition Protocol:**
  1. Download the 2021 BRFSS Data (SAS Transport Format `LLCP2021XPT.zip`).
  2. Run `python ml_pipeline/data_cleaning.py` to filter non-responses and extract an exact, reproducible stratified sample of 40,000 valid records with 8.81% target prevalence.

---

## Concise Project Report

### 1. Methodology
CardioSense AI formulates cardiovascular risk screening as a calibrated binary classification problem. Rather than relying on simple clinical point scoring tables (e.g. basic Framingham charts) or opaque black-box classifiers, we trained and calibrated supervised algorithms on 40,000 representative records from CDC BRFSS 2021. The target variable is `_MICHD`, representing diagnosed coronary heart disease or myocardial infarction. 

To eliminate data leakage, variables that capture acute post-event interventions or diagnostic confirmation were excluded, and all preprocessors were fitted strictly on the 70% training split (28,000 records).

### 2. Validation & Comparative Results
Models were evaluated using 5-fold stratified cross-validation on the training set, followed by evaluation on a 6,000-record holdout test split. HistGradientBoosting proved superior to Random Forest, Logistic Regression, and a 4-layer Keras Deep Neural Network, achieving:
- **ROC-AUC:** 0.846
- **PR-AUC:** 0.452 (5.1x higher than the 0.088 baseline prevalence)
- **Brier Calibration Score:** 0.059
- **Sensitivity (Recall) at 0.15 threshold:** 73.1%

The Deep Neural Network exhibited lower PR-AUC (0.407) and tended toward overconfident tails, demonstrating that tree-based gradient boosting remains superior for tabular survey data.

### 3. Ethics, Fairness & Privacy
An algorithmic fairness audit across biological sex and age cohorts demonstrated equitable sensitivity (Recall: Male 74.2%, Female 71.8%). Observed differences in positive predictive value are mathematically consistent with lower disease prevalence among women in the surveillance cohort. All data processing occurs with explicit consent, local client storage by default, and a prominent "Delete My Data" feature.

### 4. Limitations & Future Work
The platform relies on self-reported survey data subject to recall and survivorship biases. Future extensions include integrating laboratory electronic health record (EHR) cross-validation and longitudinal multi-year surveillance tracking across the 2022–2024 BRFSS survey cycles.
