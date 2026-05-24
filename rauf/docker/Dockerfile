FROM python:3.12

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY ../backend/ /app/


CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]
