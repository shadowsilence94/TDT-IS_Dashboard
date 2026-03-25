# TDT-IS: Thailand Domestic Tourism Intelligence System
## Phase 2 Progress Report - Business Intelligence & Analytics

This system is designed as a data-driven Decision Support System (DSS) to assist **Government Officials, policy makers, and tourism industry investors** in strategic resource allocation and sustainable growth planning.

### Strategic Alignment
Our project directly addresses the following objectives:
- **Sustainable Tourism**: Implementation of a Carrying Capacity Index (CCI) to monitor and mitigate overtourism.
- **Regional Economic Balance**: Identification of secondary provinces with high sustainable growth potential (CCI < 0.8).
- **Data-Driven Policy**: Simulation of regional revenue ROI based on visitor volume targets.

### Predictive & Analytical Models
The dashboard leverages the following Machine Learning and statistical frameworks:
1. **Facebook Prophet (Time-Series Forecasting)**: Used for high-precision tourist arrival projections, accounting for complex yearly and monthly seasonal cycles.
2. **Linear Regression (Revenue Prediction)**: A Scikit-Learn based regression model that calculates the economic contribution per tourist, enabling "What-If" policy simulations.
3. **Carrying Capacity Index (CCI)**: A diagnostic metric calculated as the ratio of current visitor volume to the 85th percentile historical limit of a province's infrastructure capacity.

### Project Structure
- `ml_pipeline/pipeline.ipynb`: Core Python engine for data transformation, EDA, and model training.
- `web_app/`: React-based Executive Dashboard for visualization and interaction.

### Deployment
The production dashboard is accessible via:
**[https://tdt-is-dashboard-bia.vercel.app](https://tdt-is-dashboard-bia.vercel.app)**

---
**Project Team**: 
Alston Anthony, Subhajit Ghosh, Santhosh Kanaga Sabapathy, Htut Ko Ko
