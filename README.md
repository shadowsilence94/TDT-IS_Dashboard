# TDT-IS: Thailand Domestic Tourism Intelligence System
## Phase 2 Progress Report - Business Intelligence & Analytics

This repository contains the complete implementation for the TDT-IS Dashboard, integrated with a full Machine Learning pipeline and Firebase Authentication.

### 🚀 Key Features
- **Prophet AI Forecasting**: 12-Month predictive arrivals model with seasonal decomposition.
- **Decision Support System (What-If)**: Real-time Revenue predictor using Linear Regression (฿/Tourist coefficient).
- **Sentinel Analysis (CCI)**: Carrying Capacity Index to identify Overtourism "Red Zones" vs Sustainable "Green Zones".
- **Geospatial Intelligence**: Interactive Folium map with geolocated hotspots.
- **Tableau-Inspired Visuals**: Revenue concentration rankings, market demographics, and annual trend bars.

### 📂 Structure
- `ml_pipeline/pipeline.ipynb`: High-performance Python notebook for data processing & model exports.
- `web_app/`: React (Vite + TypeScript) Dashboard interface.
- `archive/`: Source dataset (Parquet format).

### 🛠️ How to View
1. **Initialize Data**: Open and run all cells in `ml_pipeline/pipeline.ipynb` to generate the latest static data blocks in `web_app/public/data`.
2. **Launch Web App**:
   ```bash
   cd web_app
   npm install
   npm run dev
   ```
3. **Login**: For local testing without Firebase keys, the app defaults to a secure "Demo Simulation" mode.

### 👥 Project Team
- Mr. Alston Anthony (Group Leader)
- Mr. Subhajit Ghosh
- Mr. Santhosh Kanaga Sabapathy
- Mr. Htut Ko Ko
