# Airline Customer Satisfaction — Data Science & ML

An applied classification project exploring how passenger feedback and flight attributes relate to customer satisfaction.

**[Open the notebook](Customer_Satisfaction_prediction/Investisco_airline.ipynb) · [Dataset](Customer_Satisfaction_prediction/airline.csv) · [My portfolio](https://github.com/hamza1713/hamza1713)**

## What the notebook implements

- Inspect the dataset, remove rows with missing values, and encode categorical variables.
- Split predictors and target into training and held-out test sets (75% / 25%, random state 0).
- Tune an **XGBoost classifier** with five-fold cross-validation and F1-based model selection.
- Evaluate accuracy, precision, recall, F1, a confusion matrix, and feature importance.

**Stack:** Python · pandas · NumPy · scikit-learn · XGBoost · Matplotlib · Jupyter

## Run locally

```bash
git clone https://github.com/hamza1713/DS-ML-PROJECTS.git
cd DS-ML-PROJECTS
python -m venv .venv
# Activate .venv using the command for your operating system.
python -m pip install pandas numpy scikit-learn xgboost matplotlib jupyter
jupyter notebook
```

Open `Customer_Satisfaction_prediction/Investisco_airline.ipynb`. Its loading cell currently uses the Colab path `/content/airline.csv`; for a local notebook session, change it to `airline.csv` so it reads the CSV beside the notebook. Hyperparameter search may take time to run.

## Interpretation and limitations

The executable training workflow fits XGBoost. The final comparison table also contains fixed Decision Tree and Random Forest reference scores; those models are not trained in this notebook and the table is not a reproduced head-to-head benchmark. Recorded outputs are historical notebook results, not a fresh run or a production performance guarantee.

For a stronger evaluation, add dataset provenance and usage terms, pinned dependencies, stratified splits, reproducible baselines, and a discussion of error costs. Predicted satisfaction does not establish that an intervention will improve retention.

## Related work

[FinSight: RAG and SQL](https://github.com/hamza1713/Enterprise-RAG-Chatbot-with-Role-Base-Access-Control-) · [AI Code Review Agent](https://github.com/hamza1713/AI-Code-Review-Agent)
