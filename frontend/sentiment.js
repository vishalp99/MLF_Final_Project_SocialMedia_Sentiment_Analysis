class SentimentAnalyzer {
  constructor() {
    this.mlf_form = document.getElementById('sentimentForm');
    this.mlf_textInput = document.getElementById('textInput');
    this.mlf_analyzeBtn = document.getElementById('analyzeBtn');
    this.mlf_buttonText = document.getElementById('buttonText');
    this.mlf_loading = document.getElementById('loading');
    this.mlf_result = document.getElementById('result');
    this.mlf_charCounter = document.getElementById('charCounter');

    this.mlf_apiUrl = 'http://localhost:5000/predict'; // Adjust this to your Flask app URL

    this.mlf_init();
  }

  mlf_init() {
    this.mlf_form.addEventListener('submit', (e) => this.mlf_handleSubmit(e));
    this.mlf_textInput.addEventListener('input', () => this.mlf_updateCharCounter());
    this.mlf_textInput.addEventListener('input', () => this.mlf_clearResult());
  }

  mlf_updateCharCounter() {
    const mlf_length = this.mlf_textInput.value.length;
    const mlf_maxLength = 1000;

    this.mlf_charCounter.textContent = `${mlf_length} / ${mlf_maxLength}`;

    // Update counter styling
    this.mlf_charCounter.classList.remove('warning', 'limit');
    if (mlf_length > mlf_maxLength * 0.9) {
      this.mlf_charCounter.classList.add('warning');
    }
    if (mlf_length >= mlf_maxLength) {
      this.mlf_charCounter.classList.add('limit');
    }
  }

  mlf_clearResult() {
    this.mlf_result.classList.remove('show');
    setTimeout(() => {
      this.mlf_result.innerHTML = '';
      this.mlf_result.className = 'result';
    }, 200);
  }

  async mlf_handleSubmit(e) {
    e.preventDefault();

    const mlf_text = this.mlf_textInput.value.trim();

    if (!mlf_text) {
      this.mlf_showError('Please enter some text to analyze.');
      return;
    }

    if (mlf_text.length < 5) {
      this.mlf_showError('Please enter at least 5 characters for meaningful analysis.');
      return;
    }

    try {
      this.mlf_setLoading(true);
      const mlf_sentiment = await this.mlf_analyzeSentiment(mlf_text);
      this.mlf_showResult(mlf_sentiment, mlf_text);
    } catch (mlf_error) {
      console.error('Analysis error:', mlf_error);
      this.mlf_showError(mlf_error.message || 'Failed to analyze sentiment. Please try again.');
    } finally {
      this.mlf_setLoading(false);
    }
  }

  async mlf_analyzeSentiment(mlf_text) {
    try {
      const mlf_response = await fetch(this.mlf_apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: mlf_text
        })
      });

      if (!mlf_response.ok) {
        if (mlf_response.status === 0 || !mlf_response.status) {
          throw new Error('Unable to connect to the sentiment analysis service. Please ensure the Flask app is running on http://localhost:5000');
        }

        let mlf_errorMessage = `Server error (${mlf_response.status})`;
        try {
          const mlf_errorData = await mlf_response.json();
          mlf_errorMessage = mlf_errorData.error || mlf_errorMessage;
        } catch (mlf_e) {
          // Use default message if JSON parsing fails
        }
        throw new Error(mlf_errorMessage);
      }

      const mlf_data = await mlf_response.json();

      if (!mlf_data.prediction) {
        throw new Error('Invalid response from server');
      }

      return mlf_data;
    } catch (mlf_error) {
      if (mlf_error.name === 'TypeError' && mlf_error.message.includes('fetch')) {
        throw new Error('Unable to connect to the sentiment analysis service. Please ensure the Flask app is running and accessible.');
      }
      throw mlf_error;
    }
  }

  mlf_setLoading(mlf_isLoading) {
    if (mlf_isLoading) {
      this.mlf_analyzeBtn.disabled = true;
      this.mlf_buttonText.style.opacity = '0';
      this.mlf_loading.style.display = 'block';
    } else {
      this.mlf_analyzeBtn.disabled = false;
      this.mlf_buttonText.style.opacity = '1';
      this.mlf_loading.style.display = 'none';
    }
  }

  mlf_showResult(mlf_data, mlf_originalText) {
    const mlf_isPositive = mlf_data.prediction.toLowerCase() === 'positive';
    const mlf_icon = mlf_isPositive ? '😊' : '😔';
    const mlf_className = mlf_isPositive ? 'positive' : 'negative';

    // Truncate long text for display
    const mlf_displayText = mlf_originalText.length > 100 ?
      mlf_originalText.substring(0, 100) + '...' :
      mlf_originalText;

    this.mlf_result.innerHTML = `
            <div class="result-icon">${mlf_icon}</div>
            <div class="result-text">Sentiment: ${mlf_data.prediction}</div>
            <div class="result-input">"${mlf_displayText}"</div>
        `;

    this.mlf_result.className = `result ${mlf_className}`;

    // Trigger animation
    setTimeout(() => {
      this.mlf_result.classList.add('show');
    }, 100);
  }

  mlf_showError(mlf_message) {
    this.mlf_result.innerHTML = `
            <div class="error-icon">⚠️</div>
            <div class="result-text">Error</div>
            <div class="result-input">${mlf_message}</div>
        `;

    this.mlf_result.className = 'result error';

    // Trigger animation
    setTimeout(() => {
      this.mlf_result.classList.add('show');
    }, 100);
  }
}
