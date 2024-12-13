FROM python:3.10-slim-bullseye

# Set the working directory
WORKDIR /app

RUN apt-get update && apt-get install

COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of application
COPY . .

EXPOSE 5000

# Run the application
CMD ["python", "./app.py"]