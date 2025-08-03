
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app


COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Copy the rest of the backend application code into the container at /app
COPY . .


EXPOSE 8000


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]