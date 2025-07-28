# A Social Media Sentiment Analysis Project for Machine Learning Frameworks Course

A **Flask-based REST API** for real-time sentiment analysis on social media text using machine learning. Built with a model trained on the [Sentiment140 dataset](https://www.kaggle.com/kazanova/sentiment140) containing 1.6 million tweets.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![scikit-learn](https://img.shields.io/badge/scikit--learn-latest-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Features

- **Real-time sentiment prediction** (Positive/Negative)
- **RESTful API** with JSON responses
- **Text preprocessing** with NLTK (stopword removal, lemmatization)
- **Clean, minimalist web interface** with Apple-inspired design
- **Cross-platform compatibility** (Windows, macOS, Linux)
- **Error handling** and input validation

## Project Structure

```
MLF_Final_Project_SocialMedia_Sentiment_Analysis/
├── 📂 Data/                    # Raw datasets (excluded from Git)
├── 📂 Models/                  # Trained ML models
│   ├── model.pkl              # Trained sentiment classifier
│   └── vectorizer.pkl         # TF-IDF vectorizer
├── 📂 Notebooks/              # Jupyter training notebooks
├── 📂 Frontend/               # Web demo application
│   └── index.html            # Sentiment analysis interface
├── 📄 app.py                  # Flask API server
├── 📄 requirements.txt        # Python dependencies
└── 📄 README.md              # This file
```

## Development Setup

### Prerequisites

- **Python 3.10+** installed
- **pip** or **conda** package manager
- **Git** (for cloning)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MLF_Final_Project_SocialMedia_Sentiment_Analysis
```

### 2. Environment Setup (Recommended)

#### Using Conda:
```bash
conda create -n sentiment-api python=3.10
conda activate sentiment-api
```

#### Using venv:
```bash
python -m venv sentiment-api
# Windows
sentiment-api\Scripts\activate
# macOS/Linux  
source sentiment-api/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### Alternative (Conda):
```bash
conda install --file requirements.txt
```

### 4. Run the Flask API

```bash
python app.py
```

***Server running at:** `http://127.0.0.1:5000/`

##  Frontend Demo Setup

The project includes a beautiful web interface for testing the sentiment analysis API. Since the frontend uses `fetch()` API calls, it needs to be served over HTTP (not opened directly as a file).

### Option 1: Python HTTP Server (Recommended)

```bash
# Navigate to the Frontend directory
cd Frontend

# Python 3
python -m http.server 8080

# Python 2 (if needed)
python -m SimpleHTTPServer 8080
```

### Option 2: Node.js HTTP Server

```bash
# Install globally
npm install -g http-server

# Navigate to Frontend directory
cd Frontend

# Start server
http-server -p 8080
```

### Option 3: Live Server (VS Code Extension)

1. Install the "Live Server" extension in VS Code
2. Right-click on `Frontend/index.html`
3. Select "Open with Live Server"

### Option 4: Using PHP (if available)

```bash
cd Frontend
php -S localhost:8080
```

 **Frontend accessible at:** `http://localhost:8080`

> **Important:** Make sure both the Flask API (port 5000) and frontend server (port 8080) are running simultaneously.

##  API Usage

### Base URL
```
http://127.0.0.1:5000
```

### Endpoints

#### Health Check
```bash
GET /
```
**Response:** `"Twitter Sentiment API is Running"`

#### Predict Sentiment
```bash
POST /predict
Content-Type: application/json

{
  "text": "Your text to analyze here"
}
```

### Example Requests

#### Using cURL:
```bash
curl -X POST http://127.0.0.1:5000/predict \
     -H "Content-Type: application/json" \
     -d '{"text": "I love this amazing product! It works perfectly."}'
```

#### Using Python requests:
```python
import requests

response = requests.post(
    'http://127.0.0.1:5000/predict',
    json={'text': 'This movie was absolutely terrible!'}
)

print(response.json())
```

#### Using JavaScript (fetch):
```javascript
fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        text: 'Great service and friendly staff!'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Sample Responses

#### Successful Prediction:
```json
{
  "input": "I love this amazing product! It works perfectly.",
  "prediction": "Positive"
}
```

#### Error Response:
```json
{
  "error": "Missing 'text' in request"
}
```

## Development

### Running in Debug Mode
```bash
# The app runs in debug mode by default
python app.py
```

### Testing the API
```bash
# Test with positive sentiment
curl -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d '{"text": "Amazing experience!"}'

# Test with negative sentiment  
curl -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d '{"text": "Worst service ever!"}'

# Test error handling
curl -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d '{}'
```

### Model Information

- **Algorithm:** Logistic Regression / Naive Bayes (check notebooks)
- **Features:** TF-IDF vectorization
- **Preprocessing:** Stopword removal, lemmatization, cleaning
- **Dataset:** Sentiment140 (1.6M tweets)
- **Classes:** Binary (Positive/Negative)

## Troubleshooting

### Common Issues

#### "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

#### "CORS Error" in Frontend
- Ensure you're serving the frontend via HTTP server (not opening file directly)
- Check that Flask API is running on port 5000

#### "Connection Refused"
- Verify Flask API is running: `python app.py`
- Check if port 5000 is available
- Try `http://localhost:5000` instead of `127.0.0.1:5000`

#### NLTK Data Missing
The app automatically downloads required NLTK data, but if issues occur:
```python
import nltk
nltk.download('stopwords')
nltk.download('wordnet')
```

## Performance

- **Response Time:** ~100-300ms per prediction
- **Throughput:** ~100+ requests/second (single-threaded)
- **Memory Usage:** ~50-100MB
- **Accuracy:** ~80-85% (depending on text type)

## License

This project is a requirement for the course subject Machine Learning Frameworks Final Project

## Acknowledgments

- [Sentiment140 Dataset](https://www.kaggle.com/kazanova/sentiment140) by Stanford University
- Flask and scikit-learn communities
- NLTK for natural language processing tools

---
