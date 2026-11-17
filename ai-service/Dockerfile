# ==============================================================================
# Dockerfile for Python 3.11 FastAPI AI Microservice
# Thermal Power Plant Store & Spares Management System (SMS)
# Target Platform: Google Cloud Run (Serverless Container)
# ==============================================================================

FROM python:3.11-slim

# Prevent Python from writing .pyc files and enable unbuffered streaming logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Install lightweight system dependencies required by LightGBM and C extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libgomp1 \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for Cloud Run security posture
RUN groupadd -r aiuser && useradd -r -g aiuser -m -d /home/aiuser aiuser

WORKDIR /app

# Copy requirements specification
COPY requirements.txt .

# Install CPU-optimized PyTorch first to reduce Docker image size from 5GB to under 900MB
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Pre-download and cache SentenceTransformer model weights during build to prevent cold-start latency
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')" || true

# Copy application source code
COPY app/ ./app/

# Set file permissions for non-root execution
RUN chown -R aiuser:aiuser /app /home/aiuser

USER aiuser

EXPOSE 8000

# Health check using FastAPI /healthz endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT}/healthz || exit 1

# Execute FastAPI using Uvicorn with dynamically bound Cloud Run port
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
