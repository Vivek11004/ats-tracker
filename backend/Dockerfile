# Use a lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy only backend files
COPY backend/ ./backend/

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Expose port (for Railway, optional but nice)
EXPOSE 8000

# Run the FastAPI app
CMD exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
