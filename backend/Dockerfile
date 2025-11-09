# Use official lightweight Python image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy backend files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose backend port
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
