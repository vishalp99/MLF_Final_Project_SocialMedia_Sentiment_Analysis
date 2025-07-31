from flask import Flask, request, jsonify
import pickle
import re
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from flask_cors import CORS

# Download once if not already done
nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
with open("Models/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("Models/vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)


# Stopwords & Lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Clean and preprocess input
def clean_text(text):
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'#\w+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = text.lower()
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words and word.isalpha()]
    return ' '.join(tokens)


@app.route('/')
def index():
    return "Twitter Sentiment API is Running"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request"}), 400

    raw_text = data['text']
    cleaned_text = clean_text(raw_text)
    vect_text = vectorizer.transform([cleaned_text])
    prediction = model.predict(vect_text)[0]

    result = "Positive" if prediction == 1 else "Negative"
    return jsonify({
        "input": raw_text,
        "prediction": result
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    #app.run(debug=True)