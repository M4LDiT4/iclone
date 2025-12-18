FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

# --reload tag reloads the server after saving changes
#t this is only in development mode
CMD uvicorn main:app --host=0.0.0.0 --reload