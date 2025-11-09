# Use an official lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend folder
COPY backend/ ./backend/

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Expose port
EXPOSE 8000

# Start FastAPI app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
