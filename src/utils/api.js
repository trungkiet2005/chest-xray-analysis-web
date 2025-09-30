export const API_BASE_URL = "https://fa44955cb047.ngrok-free.app"; // Change this to your FastAPI backend URL

// Test function to check if API is accessible
export async function testConnection() {
  console.log("Testing connection to:", API_BASE_URL);

  try {
    // Create a minimal test image (1x1 pixel PNG) to test /predict endpoint
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1, 1);

    // Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    const formData = new FormData();
    formData.append("file", blob, "test.png");

    const response = await fetch(`${API_BASE_URL}/predict_detection`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        // Không thêm headers khác để tránh CORS preflight
      },
      body: formData,
    });

    console.log("Connection test response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if we get an image response
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("image/")) {
      console.log(
        "Connection test successful - backend is accessible and returns image"
      );
      return { status: "connected", message: "Backend is accessible" };
    } else {
      console.log("Backend responded but not with expected image format");
      return { status: "connected", message: "Backend is accessible" };
    }
  } catch (error) {
    console.error("Error testing API connection:", error);
    throw error;
  }
}

export async function predictXray(imageFile) {
  console.log(
    "Starting predict request for file:",
    imageFile.name,
    "Size:",
    imageFile.size
  );

  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    console.log("Sending request to:", `${API_BASE_URL}/predict_detection`);

    const response = await fetch(`${API_BASE_URL}/predict_detection`, {
      method: "POST",
      headers: {
        // Required for ngrok free plan to avoid browser warning
        "ngrok-skip-browser-warning": "true",
        // Không thêm Content-Type để browser tự động set và tránh preflight
      },
      body: formData,
    });

    console.log("Predict response status:", response.status);
    console.log(
      "Predict response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Predict API error:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    // Backend returns StreamingResponse with image/png
    const blob = await response.blob();
    console.log("Blob size:", blob.size, "Type:", blob.type);
    return blob;
  } catch (error) {
    console.error("Error calling predict API:", error);

    // Provide more specific error messages
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to server. Please check if the backend is running and the URL is correct."
      );
    }

    throw error;
  }
}

export function downloadImage(blob, filename = "chest-xray-result.png") {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateImageFile(file) {
  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error("Please select a valid image file (JPG, JPEG, or PNG)");
  }

  if (file.size > maxSize) {
    throw new Error("File size must be less than 10MB");
  }

  return true;
}
