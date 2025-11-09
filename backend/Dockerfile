# Use an official Python runtime
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy your backend code
COPY backend/ ./backend/

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Expose the default port
EXPOSE 8000

# Start FastAPI using Uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
