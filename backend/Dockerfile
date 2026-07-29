FROM python:3.11-slim

WORKDIR /workspace

COPY . /workspace/backend

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /workspace/backend/requirements.txt

EXPOSE 8000

CMD ["uvicorn","backend.app:app","--host","0.0.0.0","--port","8000","--reload"]