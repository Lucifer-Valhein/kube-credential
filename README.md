\# Kube-Credential Demo



A full-stack demo showing \*\*Issuance\*\* \& \*\*Verification\*\* micro-services with a shared \*\*SQLite\*\* DB volume, plus a \*\*React Frontend\*\*.



---



\## 🟩 Project Structure

```

kube-credential/

├─ apps/

│  ├─ issuance-api/       → Issues credentials

│  ├─ verification-api/   → Verifies credentials

├─ frontend/              → React + Vite frontend

└─ kube-cred-db (Docker volume, created automatically)

```



---



\## ⚙️ Prerequisites

\- Node.js ≥ 20.19.x

\- npm ≥ 10

\- Docker Desktop (Linux engine)

\- curl or Postman



---



\## 🚀 Development Mode



\### 1. Install dependencies

```bash

cd apps\issuance-api && npm install

cd ..\verification-api && npm install

cd ..\..\frontend && npm install

```



\### 2. Run APIs locally

```bash

cd apps\issuance-api && npm run dev

cd ..\verification-api && npm run dev

```



\### 3. Run Frontend

```bash

cd frontend && npm run dev

```



---



\## 🐳 Running with Docker



\### 1. Build Images

```bash

docker build -t issuance-api:1.0 ./apps/issuance-api

docker build -t verification-api:1.0 ./apps/verification-api

docker build -t kube-frontend:1.0 ./frontend

```



\### 2. Start Containers

```bash

docker rm -f issuance-container verification-container frontend-container

docker volume create kube-cred-db



docker run -d -p 8080:8080 --name issuance-container ^

 -e POD_NAME=worker-1 ^

 -e SQLITE_PATH=/data/issuance.sqlite ^

 -v kube-cred-db:/data issuance-api:1.0



docker run -d -p 8081:8081 --name verification-container ^

 -e POD_NAME=worker-2 ^

 -e SQLITE_PATH=/data/issuance.sqlite ^

 -v kube-cred-db:/data verification-api:1.0



docker run -d -p 3000:80 --name frontend-container kube-frontend:1.0

```



\### 3. Check Logs

```bash

docker logs issuance-container

docker logs verification-container

```



---



\## 🔎 Testing APIs

```bash

curl -X POST http://localhost:8080/issue ^

 -H "Content-Type: application/json" ^

 -d "{\"credentialId\":\"cred-demo-1\",\"subject\":\"alice\",\"data\":{\"role\":\"admin\"}}"



curl -X POST http://localhost:8081/verify ^

 -H "Content-Type: application/json" ^

 -d "{\"credentialId\":\"cred-demo-1\",\"subject\":\"alice\"}"

```



---



\## 🧪 Running Tests

```bash

cd apps\issuance-api && npm test && npm run coverage

cd ..\verification-api && npm test && npm run coverage

```



---



\## 🧹 Cleanup

```bash

docker rm -f issuance-container verification-container frontend-container

docker volume rm kube-cred-db

docker image rm issuance-api:1.0 verification-api:1.0 kube-frontend:1.0

```



