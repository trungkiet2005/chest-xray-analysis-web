// Simple CORS test - paste this in browser console at http://localhost:5174

console.log('=== Testing CORS Issue ===');

// Create a simple test image
const canvas = document.createElement('canvas');
canvas.width = 10;
canvas.height = 10;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 10, 10);

canvas.toBlob(async (blob) => {
  console.log('Created test blob:', blob.size, 'bytes');
  
  const formData = new FormData();
  formData.append('file', blob, 'test.png');
  
  try {
    console.log('Sending request without extra headers...');
    
    const response = await fetch('https://38bdf589b0b1.ngrok-free.app/predict', {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true'
        // NO other headers to avoid CORS preflight
      },
      body: formData
    });
    
    console.log('✅ Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const resultBlob = await response.blob();
      console.log('✅ SUCCESS! Got result blob:', resultBlob.size, 'bytes');
      
      // Display result
      const url = URL.createObjectURL(resultBlob);
      const img = document.createElement('img');
      img.src = url;
      img.style.maxWidth = '100px';
      img.style.border = '2px solid green';
      img.title = 'API Test Result';
      document.body.appendChild(img);
      
      console.log('✅ CORS issue resolved! API working correctly.');
    } else {
      const errorText = await response.text();
      console.error('❌ API returned error:', errorText);
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('This might still be a CORS issue or network problem');
    }
  }
}, 'image/png');
