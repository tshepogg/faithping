# 🤖 AI Dev Stack Reference (On-Prem, Beginner-Friendly)

---

## 🟢 Core AI Application Stack

| Layer | Tool(s) | Notes |
|-------|---------|-------|
| **Frontend (UI)** | **React (JS)** or **Next.js (JS)** | Simple dashboards, upload forms, or PWA for users |
| **Backend (API)** | **FastAPI (Python)** | REST API server, async, auto Swagger docs |
| **AI/ML Framework** | **PyTorch** (preferred) or TensorFlow | Train or load pretrained models for inference |
| **Inference/Serving** | FastAPI endpoints + optional **ONNX Runtime** | Serve models as `/predict` API; ONNX makes models portable |
| **Database** | **Postgres** (structured data) + **SQLite** (lightweight for experiments) | Store metadata, predictions, or logs |
| **File/Object Storage** | **Local FS** or **MinIO** (S3-compatible) | Keep datasets, models, and uploaded files |
| **Jobs/Workers (optional)** | **Redis + RQ/Celery** | Run background AI tasks or batch inference jobs |
| **Infra/Deployment** | **Docker Compose** (dev) → **k3s** (lightweight K8s) later | Easiest to start locally, grows into cluster |
| **Monitoring** | **Prometheus + Grafana** (optional) | Track metrics (API latency, GPU usage, job queue) |

---

## ⚙️ Development Workflow

1. **Model**  
   - Start with pretrained models (Hugging Face, PyTorch Hub, scikit-learn).  
   - Save/export model as `.pt` (PyTorch) or `.onnx`.  

2. **Backend API**  
   - Build FastAPI with `/predict` endpoint.  
   - Load model, run inference, return JSON response.  

3. **Frontend UI**  
   - React/Next.js app for file upload or text input.  
   - Calls FastAPI endpoint → displays predictions.  

4. **Storage**  
   - Postgres: store user input, results, metadata.  
   - MinIO: store datasets, trained models, uploaded files.  

5. **Deployment**  
   - Use Docker Compose with `frontend`, `backend`, `postgres`, `minio`.  
   - Later: move to k3s for production-like setup.  

---

## 🖥️ Example Starter Project

**Image Classifier Web App**
- Frontend: React (upload image form).  
- Backend: FastAPI (`/predict` runs model).  
- Model: Pretrained ResNet (PyTorch).  
- DB: Postgres (store results).  
- Storage: MinIO (store uploaded images).  
- Infra: Docker Compose.  

👉 User uploads image → API runs model → returns label → UI displays result.

---

## ⚡ Tech One-Liner Descriptions

- **React (JS)** → UI library for building web apps, good for dashboards.  
- **Next.js (JS)** → React framework with SSR/SSG, PWA-ready.  
- **FastAPI (Python)** → Lightweight API framework, async-first, auto-docs.  
- **PyTorch** → Flexible deep learning library with pretrained models.  
- **ONNX Runtime** → Run models in a portable, optimized format.  
- **Postgres** → Relational DB, reliable and extensible.  
- **SQLite** → Lightweight DB, great for experiments.  
- **MinIO** → On-prem S3-compatible object storage.  
- **Redis + RQ/Celery** → Queue background jobs or batch inference.  
- **Docker Compose** → Simple local multi-service deployment.  
- **k3s** → Lightweight Kubernetes for on-prem clusters.  
- **Prometheus + Grafana** → Metrics + dashboards for monitoring.  

---

## 🚀 First Milestone (beginner-friendly steps)

1. Create FastAPI project with `/predict` returning a dummy result.  
2. Add pretrained PyTorch model (e.g., ResNet) → return real predictions.  
3. Build React frontend → upload image → call `/predict`.  
4. Add Postgres → save inputs + predictions.  
5. Wrap everything in Docker Compose.  
