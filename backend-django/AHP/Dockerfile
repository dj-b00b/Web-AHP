FROM python:3.10-bookworm
ENV PYTHONUNBUFFERED 1

WORKDIR /app-django

COPY . /app-django/
RUN pip install --upgrade pip && pip install -r requirements.txt