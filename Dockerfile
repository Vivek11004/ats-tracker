# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy only the backend code
COPY backend/ ./backend/

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Set working directory inside backend
WORKDIR /app/backend

# Expose the port (Railway will map it)
EXPOSE 8000

# ✅ Correct command — use $PORT dynamically
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
