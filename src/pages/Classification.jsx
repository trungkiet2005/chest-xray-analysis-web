
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import './Predict.css';

const Classification = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResults([]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API_BASE_URL}/predict_classification`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'ngrok-skip-browser-warning': 'true' },
      });
      setResults(response.data.predictions);
    } catch (err) {
      setError('Prediction failed.');
    }
    setLoading(false);
  };

  const resetAll = () => {
    setFile(null);
    setResults([]);
    setError('');
  };

  return (
    <div className="predict-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Chest X-ray Classification</h1>
          <p className="page-subtitle">
            Upload your chest X-ray image and get AI-powered classification results
          </p>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <div className="card">
            <h2 className="section-title">Upload X-ray Image</h2>
            <form onSubmit={handleSubmit} className="predict-form">
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="file-input-classification" />
              <div className="file-input" onClick={() => document.getElementById('file-input-classification').click()}>
                <div className="file-input-content">
                  <div className="file-icon">📁</div>
                  <p className="file-text">
                    {file ? file.name : 'Click to select or drag & drop your X-ray image'}
                  </p>
                  <p className="file-hint">Supports JPG, JPEG, PNG (max 10MB)</p>
                </div>
              </div>
              <div className="upload-actions">
                <button className="btn btn-primary" type="submit" disabled={loading || !file}>
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Predicting...
                    </>
                  ) : (
                    'Classify X-ray'
                  )}
                </button>
                {file && (
                  <button className="btn btn-outline" type="button" onClick={resetAll} disabled={loading}>
                    Reset
                  </button>
                )}
              </div>
            </form>
            {error && (
              <div className="error-message">
                <div className="error-header">⚠️ Error occurred:</div>
                <div className="error-details">{error}</div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section + Original Image */}
        {results.length > 0 && (
          <div className="results-section">
            <div className="card">
              <h2 className="section-title">Kết quả phân loại & Ảnh gốc</h2>
              <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Ảnh gốc lớn hơn */}
                {file && (
                  <div style={{ minWidth: 320, maxWidth: 480 }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="X-ray uploaded"
                      style={{ width: '100%', borderRadius: 18, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: 10, fontSize: 16, color: '#333', fontWeight: 500 }}>Ảnh X-ray đã upload</div>
                  </div>
                )}
                {/* Kết quả dự đoán dạng bảng */}
                <div style={{ flex: 1, minWidth: 280 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <thead>
                      <tr style={{ background: '#f3f4f6' }}>
                        <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 16 }}>Loại bệnh</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 16 }}>Xác suất (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee', background: idx === 0 ? '#fef3c7' : 'transparent' }}>
                          <td style={{ padding: '10px 8px', fontWeight: idx === 0 ? 600 : 400, color: idx === 0 ? '#b45309' : '#222' }}>
                            {idx === 0 ? '🏆 ' : ''}{item.class}
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 120, height: 16, background: '#e5e7eb', borderRadius: 8, overflow: 'hidden', marginRight: 8 }}>
                                <div style={{ width: `${item.probability.toFixed(2)}%`, height: '100%', background: idx === 0 ? '#fbbf24' : '#60a5fa', borderRadius: 8 }}></div>
                              </div>
                                <span style={{ fontWeight: 500 }}>{item.probability.toFixed(2)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
                  <p>Select your chest X-ray image (JPG, PNG format)</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>AI Classification</h4>
                  <p>Our AI model classifies the X-ray image</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>View Results</h4>
                  <p>See the predicted classes and probabilities</p>
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
              This AI classification is for educational and research purposes only. 
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

export default Classification;
