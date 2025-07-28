# MLF_Final_Project_SocialMedia_Sentiment_Analysis

## Overview

This project is a **Flask-based REST API** for performing sentiment analysis on tweets using a machine learning model trained on the [Sentiment140 dataset](https://www.kaggle.com/kazanova/sentiment140).

## Folder Structure
- `Data` - Raw files (excluded from Git)
- `Models` - Trained Models
- `Notebooks` - Training Notebooks
- `app.py` - Flask API app
- `requirements.txt` - Required Python Packages

## Setup Instructions

### 1. Clone the repo

### Create & Activate Environment (Recommended)
Using Conda:
```bash
conda create -n sentiment-api python=3.10
conda activate sentiment-api
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### If using Anaconda
```bash
conda install --file requirements.txt
```

### 3. Run the Flask API
```bash
python app.py
```

### Localhost server will be running on http://127.0.0.1:5000/

### 4. Test the API with curl or Postman
```bash
curl -X POST http://127.0.0.1:5000/predict \
     -H "Content-Type: application/json" \
     -d "{\"text\": \"I love this app, it’s fantastic!\"}"
```

### Sample Output
```bash
{
  "input": "I love this app, it’s fantastic!",
  "prediction": "Positive"
}
```