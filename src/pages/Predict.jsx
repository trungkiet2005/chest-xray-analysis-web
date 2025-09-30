import React, { useState, useEffect } from 'react';
import { predictXray, downloadImage, validateImageFile, testConnection } from '../utils/api';
import './Predict.css';

const Predict = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [resultBlob, setResultBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking'); // checking, connected, failed

  // Test connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      console.log('Predict component: Testing backend connection...');
      try {
        await testConnection();
        console.log('Predict component: Backend connection successful');
        setConnectionStatus('connected');
      } catch (err) {
        console.error('Predict component: Backend connection failed:', err);
        setConnectionStatus('failed');
      }
    };
    
    checkConnection();
  }, []);

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
    };
  }, [originalImageUrl, resultImageUrl]);

  const handleFileSelect = (file) => {
    try {
      // Validate file
      validateImageFile(file);
      
      // Clean up previous URLs
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
      
      // Set new file and create preview URL
      setSelectedFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setResultImageUrl(null);
      setResultBlob(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const blob = await predictXray(selectedFile);
      setResultBlob(blob);
      
      // Clean up previous result URL
      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
      
      // Create new result URL
      setResultImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message || 'Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      try {
        downloadImage(resultBlob);
      } catch (err) {
        setError('Failed to download image');
      }
    }
  };

  const retryConnection = async () => {
    setConnectionStatus('checking');
    try {
      await testConnection();
      setConnectionStatus('connected');
    } catch (err) {
      setConnectionStatus('failed');
      console.error('Backend connection failed:', err);
    }
  };

  const resetAll = () => {
    // Clean up URLs
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
    
    // Reset state
    setSelectedFile(null);
    setOriginalImageUrl(null);
    setResultImageUrl(null);
    setResultBlob(null);
    setError(null);
  };

  return (
    <div className="predict-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Chest X-ray AI Analysis</h1>
          <p className="page-subtitle">
            Upload your chest X-ray image and get AI-powered analysis results
          </p>
        </div>

        {/* Connection Status */}
        <div className="connection-status">
          <div className={`status-indicator ${connectionStatus}`}>
            {connectionStatus === 'checking' && (
              <>
                <div className="spinner small"></div>
                <span>Checking backend connection...</span>
              </>
            )}
            {connectionStatus === 'connected' && (
              <>
                <span className="status-icon">✅</span>
                <span>Backend connected and ready</span>
              </>
            )}
            {connectionStatus === 'failed' && (
              <>
                <span className="status-icon">❌</span>
                <span>Backend connection failed</span>
                <button className="btn btn-small" onClick={retryConnection}>
                  Retry Connection
                </button>
              </>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <div className="card">
            <h2 className="section-title">Upload X-ray Image</h2>
            
            <div
              className={`file-input ${dragOver ? 'dragover' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <div className="file-input-content">
                <div className="file-icon">📁</div>
                <p className="file-text">
                  {selectedFile ? selectedFile.name : 'Click to select or drag & drop your X-ray image'}
                </p>
                <p className="file-hint">Supports JPG, JPEG, PNG (max 10MB)</p>
              </div>
              
              <input
                id="file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {error && (
              <div className="error-message">
                <div className="error-header">
                  ⚠️ Error occurred:
                </div>
                <div className="error-details">
                  {error}
                </div>
                {connectionStatus === 'failed' && (
                  <div className="error-suggestions">
                    <strong>Possible solutions:</strong>
                    <ul>
                      <li>Check if the backend server is running</li>
                      <li>Verify the ngrok URL is active</li>
                      <li>Try clicking "Retry" to reconnect</li>
                      <li>Check browser console for detailed errors</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="upload-actions">
              <button
                className="btn btn-primary"
                onClick={handlePredict}
                disabled={!selectedFile || isLoading || connectionStatus !== 'connected'}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : connectionStatus !== 'connected' ? (
                  'Backend Not Available'
                ) : (
                  'Analyze X-ray'
                )}
              </button>
              
              {selectedFile && (
                <button
                  className="btn btn-outline"
                  onClick={resetAll}
                  disabled={isLoading}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {(originalImageUrl || resultImageUrl) && (
          <div className="results-section">
            <div className="card">
              <h2 className="section-title">Analysis Results</h2>
              
              <div className="grid grid-2">
                {/* Original Image */}
                {originalImageUrl && (
                  <div className="image-container">
                    <div className="image-label">Original Image</div>
                    <img 
                      src={originalImageUrl} 
                      alt="Original X-ray" 
                      className="result-image"
                    />
                  </div>
                )}

                {/* Result Image */}
                {resultImageUrl ? (
                  <div className="image-container">
                    <div className="image-label">AI Analysis Result</div>
                    <img 
                      src={resultImageUrl} 
                      alt="AI Analysis Result" 
                      className="result-image"
                    />
                  </div>
                ) : originalImageUrl && !isLoading && (
                  <div className="image-placeholder">
                    <div className="placeholder-content">
                      <div className="placeholder-icon">🤖</div>
                      <p>AI analysis result will appear here</p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="image-placeholder">
                    <div className="placeholder-content">
                      <div className="spinner"></div>
                      <p>AI is analyzing your X-ray...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button */}
              {resultBlob && (
                <div className="result-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={handleDownload}
                  >
                    📥 Download Result
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="info-section">
          <div className="card">
            <h3 className="section-title">How it works</h3>
            <div className="info-steps">
              <div className="info-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Upload Image</h4>
                  <p>Select or drag & drop your chest X-ray image (JPG, PNG format)</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>AI Analysis</h4>
                  <p>Our AI model processes and analyzes the X-ray image</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>View Results</h4>
                  <p>Compare original and processed images, download results</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="info-section">
          <div className="card" style={{backgroundColor: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)'}}>
            <h3 className="section-title" style={{color: '#D97706'}}>⚠️ Medical Disclaimer</h3>
            <p style={{color: '#92400E', margin: 0, lineHeight: 1.6}}>
              This AI analysis is for educational and research purposes only. 
              It should not be used as a substitute for professional medical diagnosis, 
              treatment, or advice. Always consult with qualified healthcare professionals 
              for medical concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
