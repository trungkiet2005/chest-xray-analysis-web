# Thêm CORS middleware vào backend FastAPI của bạn

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
import io

app = FastAPI()

# Thêm CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production, nên chỉ định cụ thể domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # đọc file ảnh
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")

    # predict
    output_img = predict_image(image)

    # convert ảnh để trả về
    buf = io.BytesIO()
    output_img.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")

# Thêm endpoint root để test connection
@app.get("/")
async def root():
    return {"status": "ok", "message": "Chest X-ray API is running"}
