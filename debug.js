// Debug helper functions - paste this into browser console

const API_BASE_URL = 'https://38bdf589b0b1.ngrok-free.app';

// Test basic connection using actual predict endpoint
async function testConnection() {
  console.log('Testing connection using predict endpoint...');
  
  // Create a minimal test image (1x1 pixel PNG)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 1, 1);
  
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'test.png');
    
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData,
      });
      
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const blob = await response.blob();
        console.log('Success! Got blob with size:', blob.size, 'Type:', blob.type);
        
        // Create URL to view the result
        const url = URL.createObjectURL(blob);
        console.log('Result image URL:', url);
        
        return blob;
      } else {
        const text = await response.text();
        console.error('Error response:', text);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }, 'image/png');
}

// Test CORS preflight
async function testCors() {
  console.log('Testing CORS...');
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'OPTIONS',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      },
    });
    
    console.log('CORS preflight status:', response.status);
    console.log('CORS headers:', Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.error('CORS test failed:', error);
  }
}

// Test with minimal form data
async function testMinimalRequest() {
  console.log('Testing minimal request...');
  
  // Create a minimal test image (1x1 pixel PNG)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 1, 1);
  
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'test.png');
    
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData,
      });
      
      console.log('Minimal request status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('JSON response:', data);
        } else {
          const blob = await response.blob();
          console.log('Blob response size:', blob.size);
        }
      } else {
        const text = await response.text();
        console.error('Error response:', text);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  }, 'image/png');
}

// Run all tests
async function runAllTests() {
  console.log('=== Starting Debug Tests ===');
  
  console.log('\n1. Testing basic connection...');
  await testConnection();
  
  console.log('\n2. Testing CORS...');
  await testCors();
  
  console.log('\n3. Testing minimal request...');
  await testMinimalRequest();
  
  console.log('\n=== Debug Tests Complete ===');
}

// Export functions to global scope
window.testConnection = testConnection;
window.testCors = testCors;
window.testMinimalRequest = testMinimalRequest;
window.runAllTests = runAllTests;

console.log('Debug functions loaded. Run runAllTests() to test everything.');
