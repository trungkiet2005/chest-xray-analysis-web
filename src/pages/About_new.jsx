import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">About ChestXray AI</h1>
          <p className="hero-subtitle">
            Advanced AI Computer Vision technology for chest X-ray analysis
          </p>
        </div>

        {/* Overview Section */}
        <div className="section">
          <div className="card">
            <h2 className="section-title">🔬 What is ChestXray AI?</h2>
            <div className="content">
              <p>
                ChestXray AI là một ứng dụng Computer Vision tiên tiến sử dụng trí tuệ nhân tạo 
                để phân tích và xử lý hình ảnh X-quang ngực. Ứng dụng được phát triển với mục tiêu 
                hỗ trợ quá trình chẩn đoán y tế thông qua việc phát hiện và làm nổi bật các bất thường 
                trong hình ảnh X-quang.
              </p>
              <p>
                Sử dụng các mô hình deep learning được huấn luyện trên tập dữ liệu lớn, 
                hệ thống có thể nhận diện các pattern và đặc trưng quan trọng trong hình ảnh X-quang, 
                giúp tăng độ chính xác và tốc độ trong quá trình phân tích.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="section">
          <div className="card">
            <h2 className="section-title">📋 Hướng dẫn sử dụng</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-icon">1️⃣</div>
                <h3>Upload ảnh X-ray</h3>
                <p>
                  Chọn file ảnh X-quang ngực của bạn (định dạng JPG, JPEG hoặc PNG) 
                  từ máy tính hoặc kéo thả trực tiếp vào vùng upload.
                </p>
              </div>
              <div className="step-card">
                <div className="step-icon">2️⃣</div>
                <h3>AI xử lý</h3>
                <p>
                  Nhấn nút "Analyze X-ray" để bắt đầu quá trình phân tích. 
                  AI sẽ xử lý hình ảnh và tạo ra kết quả phân tích chi tiết.
                </p>
              </div>
              <div className="step-card">
                <div className="step-icon">3️⃣</div>
                <h3>Xem kết quả</h3>
                <p>
                  So sánh ảnh gốc với ảnh kết quả được xử lý bởi AI. 
                  Tải xuống kết quả để lưu trữ hoặc chia sẻ.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Info Section */}
        <div className="section">
          <div className="card">
            <h2 className="section-title">⚙️ Thông tin kỹ thuật</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <h3>🔧 Backend</h3>
                <p>FastAPI - Python framework hiệu suất cao</p>
                <p>Endpoint: <code>/predict</code> (POST)</p>
              </div>
              <div className="tech-item">
                <h3>🤖 AI Model</h3>
                <p>Deep Learning models for medical image analysis</p>
                <p>Computer Vision với PyTorch/TensorFlow</p>
              </div>
              <div className="tech-item">
                <h3>🎨 Frontend</h3>
                <p>React.js với CSS thuần</p>
                <p>Responsive design, Dark/Light mode</p>
              </div>
              <div className="tech-item">
                <h3>📊 Input/Output</h3>
                <p>Input: JPG, JPEG, PNG (max 10MB)</p>
                <p>Output: Processed PNG image</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="section">
          <div className="card">
            <h2 className="section-title">✨ Tính năng chính</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🚀</div>
                <h3>Phân tích nhanh</h3>
                <p>Xử lý và phân tích ảnh X-quang trong vài giây</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h3>Độ chính xác cao</h3>
                <p>Sử dụng mô hình AI được huấn luyện trên dataset lớn</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <h3>Responsive Design</h3>
                <p>Hoạt động mượt mà trên mọi thiết bị</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌙</div>
                <h3>Dark/Light Mode</h3>
                <p>Giao diện thân thiện với người dùng</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💾</div>
                <h3>Download kết quả</h3>
                <p>Tải xuống ảnh kết quả đã được xử lý</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h3>Bảo mật</h3>
                <p>Không lưu trữ dữ liệu người dùng</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="section">
          <div className="card">
            <h2 className="section-title">📚 API Documentation</h2>
            <div className="api-docs">
              <div className="api-endpoint">
                <h3>POST /predict</h3>
                <p><strong>Description:</strong> Analyze chest X-ray image</p>
                <p><strong>Content-Type:</strong> multipart/form-data</p>
                <p><strong>Parameters:</strong></p>
                <ul>
                  <li><code>file</code> (required) - Image file (JPG, JPEG, PNG)</li>
                </ul>
                <p><strong>Response:</strong> Processed PNG image (binary)</p>
                <p><strong>Example:</strong></p>
                <div className="code-block">
                  <pre>
{`curl -X POST "http://localhost:8000/predict" \\
     -H "Content-Type: multipart/form-data" \\
     -F "file=@xray_image.jpg"`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="section">
          <div className="card disclaimer-card">
            <h2 className="section-title">⚠️ Tuyên bố miễn trách</h2>
            <div className="disclaimer-content">
              <p>
                <strong>Quan trọng:</strong> Ứng dụng ChestXray AI được phát triển chỉ cho mục đích 
                giáo dục, nghiên cứu và demo công nghệ. Kết quả phân tích từ ứng dụng này 
                <strong> KHÔNG THỂ thay thế</strong> cho việc chẩn đoán và điều trị của bác sĩ chuyên khoa.
              </p>
              <ul>
                <li>Luôn tham khảo ý kiến của các chuyên gia y tế có trình độ</li>
                <li>Không sử dụng kết quả này để tự chẩn đoán hoặc điều trị</li>
                <li>Trong trường hợp cấp cứu, hãy liên hệ ngay với cơ sở y tế</li>
                <li>Chúng tôi không chịu trách nhiệm về bất kỳ hậu quả nào từ việc sử dụng ứng dụng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="section">
          <div className="card">
            <h2 className="section-title">📞 Liên hệ & Hỗ trợ</h2>
            <div className="contact-grid">
              <div className="contact-item">
                <h3>👥 Development Team</h3>
                <p>AI & Computer Vision Engineers</p>
                <p>Healthcare Technology Specialists</p>
              </div>
              <div className="contact-item">
                <h3>📧 Email</h3>
                <p>support@chestxray-ai.com</p>
                <p>research@chestxray-ai.com</p>
              </div>
              <div className="contact-item">
                <h3>🌐 Website</h3>
                <p>www.chestxray-ai.com</p>
                <p>docs.chestxray-ai.com</p>
              </div>
              <div className="contact-item">
                <h3>📱 Social Media</h3>
                <p>@ChestXrayAI</p>
                <p>LinkedIn: ChestXray AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
