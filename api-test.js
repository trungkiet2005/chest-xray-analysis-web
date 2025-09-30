// Quick test script to verify API
// Run this in browser console on http://localhost:5174

async function quickTest() {
  console.log('=== Quick API Test ===');
  
  // Create a test image
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  
  // Draw a simple pattern
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillStyle = '#000000';
  ctx.fillRect(25, 25, 50, 50);
  
  // Convert to blob
  canvas.toBlob(async (blob) => {
    console.log('Created test image blob:', blob.size, 'bytes');
    
    try {
      // Test the actual API call
      const formData = new FormData();
      formData.append('file', blob, 'test-xray.png');
      
      console.log('Sending request to API...');
      const response = await fetch('https://38bdf589b0b1.ngrok-free.app/predict', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const resultBlob = await response.blob();
        console.log('✅ SUCCESS! Received blob:', resultBlob.size, 'bytes, type:', resultBlob.type);
        
        // Create object URL to preview result
        const url = URL.createObjectURL(resultBlob);
        console.log('Result image URL:', url);
        
        // Optional: Display the result
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '200px';
        img.style.border = '2px solid green';
        document.body.appendChild(img);
        
        return resultBlob;
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
      }
    } catch (error) {
      console.error('❌ Request failed:', error);
    }
  }, 'image/png');
}

// Auto-run the test
quickTest();
