FROM python:3.12.6

# Set the working directory
WORKDIR /app

COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of application
COPY backend ./

EXPOSE 5000

# Run the application
CMD ["python", "./app.py"]