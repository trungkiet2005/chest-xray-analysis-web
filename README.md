# Chest X-ray Web

Ứng dụng web phân tích ảnh X-quang ngực bằng AI (Computer Vision). Người dùng có thể tải ảnh X-ray, hệ thống gửi ảnh đến backend (FastAPI) để xử lý, sau đó hiển thị và cho phép tải về ảnh kết quả đã được mô hình AI đánh dấu/diễn giải.

Lưu ý quan trọng: Ứng dụng phục vụ mục đích học tập, nghiên cứu và demo. Không thay thế tư vấn/chẩn đoán y khoa chuyên nghiệp.

## Tính năng chính

- Upload ảnh X-quang (kéo-thả hoặc chọn file) với kiểm tra định dạng và kích thước
- Kiểm tra kết nối backend tự động và hiển thị trạng thái (connected/failed)
- Gửi ảnh đến API và hiển thị ảnh kết quả (image/png) trả về từ backend
- So sánh ảnh gốc và ảnh kết quả, tải xuống ảnh kết quả
- Giao diện responsive, có Dark/Light mode, routing nhiều trang (Predict, Classification, About)

## Tech stack

- Frontend: React 19, React Router 7, Vite 7
- HTTP: fetch, axios (đã cài trong dependencies)
- Linter: ESLint 9
- Backend (tham chiếu): FastAPI (Python) trả về StreamingResponse image/png

## Cấu trúc thư mục (rút gọn)

```
Chest-Xray-Web/
├─ public/
├─ src/
│  ├─ pages/
│  │  ├─ Predict.jsx           # Trang chính: upload + gọi API + hiển thị kết quả
│  │  ├─ Classification.jsx    # Trang Classification (placeholder)
│  │  └─ About.jsx             # Giới thiệu & hướng dẫn
│  ├─ utils/
│  │  └─ api.js                # API_BASE_URL, testConnection, predictXray, helper
│  ├─ components/              # Header, UI components
│  ├─ contexts/                # ThemeContext
│  ├─ App.jsx                  # Khai báo routes
│  └─ main.jsx                 # Entry Vite
├─ backend-with-cors.py        # Ví dụ FastAPI + CORS (tham khảo)
├─ vite.config.js
├─ package.json
└─ README.md
```

## Yêu cầu hệ thống

- Node.js LTS (khuyến nghị >= 18)
- npm (đi kèm Node.js)
- Backend FastAPI chạy độc lập (cục bộ hoặc qua ngrok)

## Cài đặt và chạy (Windows PowerShell)

1. Cài dependencies

```powershell
npm install
```

2. Cấu hình địa chỉ backend

- Mở file `src/utils/api.js` và cập nhật hằng số `API_BASE_URL` trỏ tới backend của bạn (vd: http://localhost:8000 hoặc URL ngrok).
- Frontend hiện đang gọi endpoint: `/predict_detection`. Hãy đảm bảo backend của bạn có endpoint này và trả về ảnh PNG (StreamingResponse). Nếu backend của bạn dùng endpoint khác (vd `/predict`), bạn có thể:
  - Đổi lại endpoint trong `src/utils/api.js` thành `/predict`, hoặc
  - Bổ sung route `/predict_detection` ở backend để tương thích.

3. Chạy dev server

```powershell
npm run dev
```

4. Truy cập ứng dụng

- Theo mặc định Vite sẽ chạy tại http://localhost:5173

## Scripts hữu ích

- `npm run dev` — chạy dev server (HMR)
- `npm run build` — build production
- `npm run preview` — chạy server preview sau khi build
- `npm run lint` — chạy ESLint

## Tích hợp Backend (FastAPI)

Frontend mong đợi một API POST nhận file ảnh và trả về ảnh kết quả (PNG) để hiển thị. Hợp đồng API đề xuất:

- Method: POST
- Path: `/predict_detection` (hoặc cập nhật cho khớp với backend)
- Content-Type: `multipart/form-data`
- Body: field `file` (JPG/JPEG/PNG, <= 10MB)
- Response: Binary image/png

Ví dụ backend (tham khảo, cần điều chỉnh theo mô hình của bạn):

```python
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],  # Production: chỉ định domain cụ thể
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
)

def predict_image(img: Image.Image) -> Image.Image:
		# TODO: thay bằng logic mô hình AI của bạn
		return img  # ví dụ: trả lại ảnh không đổi

@app.post("/predict_detection")
async def predict_detection(file: UploadFile = File(...)):
		image = Image.open(io.BytesIO(await file.read())).convert("RGB")
		output_img = predict_image(image)
		buf = io.BytesIO()
		output_img.save(buf, format="PNG")
		buf.seek(0)
		return StreamingResponse(buf, media_type="image/png")

@app.get("/")
async def root():
		return {"status": "ok"}
```

Ghi chú khi dùng ngrok Free: Frontend đã tự thêm header `ngrok-skip-browser-warning: true` để tránh cảnh báo trình duyệt của ngrok.

## Cấu hình phía frontend (`src/utils/api.js`)

- `API_BASE_URL`: thay bằng URL backend của bạn
- `testConnection()`: tự tạo ảnh 1x1 để gọi thử endpoint `/predict_detection` nhằm kiểm tra kết nối
- `predictXray(file)`: gửi file đến `/predict_detection` và nhận blob ảnh PNG
- `validateImageFile(file)`: chỉ cho phép JPG/JPEG/PNG và giới hạn 10MB

## Các tuyến (routes) chính

- `/` và `/predict`: Trang phân tích ảnh
- `/classification`: Trang Classification (đang là placeholder)
- `/about`: Giới thiệu, hướng dẫn, cảnh báo y tế

## Khắc phục sự cố (Troubleshooting)

- Không kết nối được backend (trạng thái Failed):

  - Kiểm tra backend có đang chạy không; đảm bảo `API_BASE_URL` chính xác
  - Nếu dùng ngrok: đảm bảo tunnel đang hoạt động và URL chưa hết hạn
  - Kiểm tra CORS ở backend (đã bật CORSMiddleware)
  - Xem console trình duyệt để biết chi tiết lỗi

- 415/422/500 từ backend:

  - Đảm bảo gửi đúng field `file` dạng `multipart/form-data`
  - Xác nhận backend path đúng (mặc định frontend gọi `/predict_detection`)
  - Ghi log ở backend để xem stacktrace

- 413 Payload Too Large:

  - Ảnh vượt quá giới hạn server; tăng giới hạn phía backend hoặc nén ảnh trước khi gửi

- Mixed Content (http/https):
  - Nếu site https nhưng backend http, trình duyệt sẽ chặn; hãy dùng https cho backend (vd ngrok https)

## Build và deploy

```powershell
npm run build
npm run preview
```

Thư mục `dist/` là artifact tĩnh có thể deploy lên bất kỳ static hosting nào (Netlify, Vercel, S3 + CloudFront, Nginx...). Hãy đảm bảo backend có thể truy cập công khai nếu frontend public.

## Gợi ý nâng cấp (tùy chọn)

- Đưa `API_BASE_URL` vào biến môi trường Vite (`import.meta.env.VITE_API_BASE_URL`)
- Thêm xử lý lỗi chi tiết hơn và mã trạng thái người dùng dễ hiểu
- Thêm test e2e cơ bản (Cypress/Playwright) cho luồng upload -> hiển thị -> tải xuống
- Bổ sung màn hình/ảnh minh họa trong thư mục `public/` và tham chiếu trong README

---

Nếu cần mình có thể giúp refactor để dùng biến môi trường cho API URL, cũng như đồng bộ endpoint giữa frontend và backend theo chuẩn bạn chọn.
