class SentimentAnalyzer 
{
  constructor() {
                this.form = document.getElementById('sentimentForm');
                this.textInput = document.getElementById('textInput');
                this.analyzeBtn = document.getElementById('analyzeBtn');
                this.buttonText = document.getElementById('buttonText');
                this.loading = document.getElementById('loading');
                this.result = document.getElementById('result');
                this.charCounter = document.getElementById('charCounter');
                
                this.apiUrl = 'http://localhost:5000/predict'; // Adjust this to your Flask app URL
                
                this.init();
            }
            
            init() {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
                this.textInput.addEventListener('input', () => this.updateCharCounter());
                this.textInput.addEventListener('input', () => this.clearResult());
            }
            
            updateCharCounter() {
                const length = this.textInput.value.length;
                const maxLength = 1000;
                
                this.charCounter.textContent = `${length} / ${maxLength}`;
                
                // Update counter styling
                this.charCounter.classList.remove('warning', 'limit');
                if (length > maxLength * 0.9) {
                    this.charCounter.classList.add('warning');
                }
                if (length >= maxLength) {
                    this.charCounter.classList.add('limit');
                }
            }
            
            clearResult() {
                this.result.classList.remove('show');
                setTimeout(() => {
                    this.result.innerHTML = '';
                    this.result.className = 'result';
                }, 200);
            }
            
            async handleSubmit(e) {
                e.preventDefault();
                
                const text = this.textInput.value.trim();
                
                if (!text) {
                    this.showError('Please enter some text to analyze.');
                    return;
                }
                
                if (text.length < 5) {
                    this.showError('Please enter at least 5 characters for meaningful analysis.');
                    return;
                }
                
                try {
                    this.setLoading(true);
                    const sentiment = await this.analyzeSentiment(text);
                    this.showResult(sentiment, text);
                } catch (error) {
                    console.error('Analysis error:', error);
                    this.showError(error.message || 'Failed to analyze sentiment. Please try again.');
                } finally {
                    this.setLoading(false);
                }
            }
            
            async analyzeSentiment(text) {
                try {
                    const response = await fetch(this.apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: text })
                    });
                    
                    if (!response.ok) {
                        if (response.status === 0 || !response.status) {
                            throw new Error('Unable to connect to the sentiment analysis service. Please ensure the Flask app is running on http://localhost:5000');
                        }
                        
                        let errorMessage = `Server error (${response.status})`;
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.error || errorMessage;
                        } catch (e) {
                            // Use default message if JSON parsing fails
                        }
                        throw new Error(errorMessage);
                    }
                    
                    const data = await response.json();
                    
                    if (!data.prediction) {
                        throw new Error('Invalid response from server');
                    }
                    
                    return data;
                } catch (error) {
                    if (error.name === 'TypeError' && error.message.includes('fetch')) {
                        throw new Error('Unable to connect to the sentiment analysis service. Please ensure the Flask app is running and accessible.');
                    }
                    throw error;
                }
            }
            
            setLoading(isLoading) {
                if (isLoading) {
                    this.analyzeBtn.disabled = true;
                    this.buttonText.style.opacity = '0';
                    this.loading.style.display = 'block';
                } else {
                    this.analyzeBtn.disabled = false;
                    this.buttonText.style.opacity = '1';
                    this.loading.style.display = 'none';
                }
            }
            
            showResult(data, originalText) {
                const isPositive = data.prediction.toLowerCase() === 'positive';
                const icon = isPositive ? '😊' : '😔';
                const className = isPositive ? 'positive' : 'negative';
                
                // Truncate long text for display
                const displayText = originalText.length > 100 
                    ? originalText.substring(0, 100) + '...' 
                    : originalText;
                
                this.result.innerHTML = `
                    <div class="result-icon">${icon}</div>
                    <div class="result-text">Sentiment: ${data.prediction}</div>
                    <div class="result-input">"${displayText}"</div>
                `;
                
                this.result.className = `result ${className}`;
                
                // Trigger animation
                setTimeout(() => {
                    this.result.classList.add('show');
                }, 100);
            }
            
            showError(message) {
                this.result.innerHTML = `
                    <div class="error-icon">⚠️</div>
                    <div class="result-text">Error</div>
                    <div class="result-input">${message}</div>
                `;
                
                this.result.className = 'result error';
                
                // Trigger animation
                setTimeout(() => {
                    this.result.classList.add('show');
                }, 100);
            }
        }
        
