# E-Commerce Microservices Project on K3s

This repository contains a full-stack e-commerce application designed with a microservices architecture, now fully orchestrated with Kubernetes (K3s).

## 🏗️ Architecture
The application is composed of the following services:

- **Frontend**: Next.js (React) application.
- **Admin Dashboard**: Angular application.
- **User Authentication Service**: Node.js/Express with MongoDB.
- **Product Catalogue Service**: Go (Golang) with PostgreSQL.
- **Order Management Service**: Node.js/Express with MongoDB.
- **Databases**: MongoDB (StatefulSet), PostgreSQL (StatefulSet).

## 🚀 Prerequisites
- Docker Desktop (or Docker Engine)
- Kubernetes Cluster (K3s recommended, or Docker Desktop K8s)
- kubectl CLI tool
- Git

## 📦 Deployment Guide

### 1. Build & Push Docker Images
Ensure you have logged into Docker Hub (`docker login`). The default repository user is `achrefs161`. If different, update the Kubernetes manifests.

```bash
# Frontend
docker build -t achrefs161/frontend-service:latest ./Services/frontend
docker push achrefs161/frontend-service:latest

# Admin Dashboard
docker build -t achrefs161/admin-dashboard:latest ./Services/admin-dashboard
docker push achrefs161/admin-dashboard:latest

# Product Service
docker build -t achrefs161/product-service:latest ./Services/product-catalogue
docker push achrefs161/product-service:latest

# Order Service
docker build -t achrefs161/order-service:latest ./Services/gestion-commandes
docker push achrefs161/order-service:latest

# User Auth Service
docker build -t achrefs161/user-auth-service:latest ./Services/user-authentication
docker push achrefs161/user-auth-service:latest
```

### 2. Configure Kubernetes
The `k8s/` directory contains all necessary manifests locally.

**Secrets & Configuration:**
```bash
kubectl apply -f k8s/00-configuration/
```
This sets up Secrets, PersistentVolumeClaims, and the Runtime ConfigMap.

**Infrastructure (Databases):**
```bash
kubectl apply -f k8s/10-infrastructure/
```
Waits for MongoDB and PostgreSQL to initialize.

**Backend Services:**
```bash
kubectl apply -f k8s/20-backend/
```
Deploys Auth, Product, and Order services.

**Frontend & Admin:**
```bash
kubectl apply -f k8s/30-frontend/
```

**Ingress Gateway:**
Ensure you have an Ingress Controller installed (Traefik comes with K3s default).
```bash
kubectl apply -f k8s/40-gateway/
```

**Observability Stack:**
```bash
kubectl apply -f k8s/50-monitoring/ # Prometheus + Grafana
kubectl apply -f k8s/60-logging/    # EFK Stack
```

### 3. DNS / Hosts Setup
Add the following line to your local hosts file (`C:\Windows\System32\drivers\etc\hosts` or `/etc/hosts`):

```text
127.0.0.1 shop.local
```

### 4. Initialization
The application includes a `seed-admin-job` to create the initial Admin user.

```bash
kubectl apply -f k8s/20-backend/seed-admin-job.yaml
```

## 🌐 Accessing the Application
- **Storefront**: [http://shop.local](http://shop.local)
- **Admin Dashboard**: [http://shop.local/admin](http://shop.local/admin)
- **Login**: `admin@tech.com` / `admin`
- **Grafana (Monitoring)**: [http://localhost:32000](http://localhost:32000) (admin/admin)
- **Kibana (Logging)**: [http://localhost:31000](http://localhost:31000)

## 🛠️ Configuration Details

### Runtime Configuration
The Frontend and Admin apps utilize `k8s/00-configuration/configmaps.yaml` to load API URLs at runtime.

- `productServiceUrl`: `http://shop.local/products`
- `authServiceUrl`: `http://shop.local/api/auth`
- `orderServiceUrl`: `http://shop.local/api`

### Troubleshooting
If you encounter 404 errors or routing issues:

1.  Verify Ingress is running: `kubectl get ingress`
2.  Restart frontend pods to reload config: `kubectl rollout restart deployment frontend admin-dashboard`
3.  Ensure `shop.local` points to your cluster IP (usually `127.0.0.1` for local setup).

### Logging Tips (ELK)
- To filter logs in Kibana, create an index pattern `k8s-logs-*`.
- Filter noise using: `kubernetes.namespace_name : "default"`.

## 📜 License
This project is for DevOps demonstration purposes.

---

---

## 🚀 6. Infrastructure Provisioning (Ansible)
This project uses **Ansible** to provision a fresh Ubuntu server with all necessary tools (Docker, Jenkins, K3s) to become a CI/CD-ready node.

### 📋 Prerequisites
- **Control Machine**: Windows/Linux with Ansible installed.
- **Target Machine**: Ubuntu Server (fresh install recommended).
    - SSH Access configured (`ssh user@vm-ip`).
    - At least **4GB RAM** recommended for the full ELK stack.

### 🛠️ Provisioning Steps

#### Step 1: Configure Inventory
Edit `Infrastructure/ansible/hosts.ini` with your target server IP:
```ini
[server]
<YOUR_VM_IP> ansible_user=<USER> ansible_ssh_pass=<PASSWORD>
```

#### Step 2: Run Provisioning Playbook
Run the playbook, providing your **Docker Hub credentials** (for Jenkins to push images) and **Repo URL**:

```bash
cd Infrastructure/ansible

ansible-playbook -i hosts.ini provision_server.yml \
  -e "dockerhub_user=<YOUR_DOCKERHUB_USERNAME>" \
  -e "dockerhub_pass=<YOUR_DOCKERHUB_PASSWORD>" \
  -e "repo_url=https://github.com/Wajdi-Tech/Projet-DevOps.git"
```

**What this does (Zero-Touch Setup):**
1.  **System**: Updates OS and installs dependencies (Git, Curl, etc.).
2.  **Docker**: Installs Docker Engine (required for building images).
3.  **K3s**: Installs Kubernetes cluster.
4.  **Jenkins**:
    *   Installs Jenkins & Java 17.
    *   **Auto-Config**: Creates admin user (`admin`/`admin`), installs plugins (`git`, `docker-workflow`, `kubernetes-cli`), adds Docker Hub credentials, and creates the Initial Pipeline Job.
    *   **Permissions**: Grants Jenkins permission to use Docker and `kubectl`.

### Step 3: Access Jenkins
- **URL**: `http://<VM_IP>:8080`
- **Login**: `admin` / `admin`
- **Job**: Click on **DevOps-Project-Pipeline** and start a build to deploy your application!

## 🧪 7. CI/CD & Testing Strategy

The project includes a robust Jenkins pipeline optimized for backend stability and speed.

### Jenkins Pipeline Stages
1. **Checkout**: Pulls code from `Test` branch.
2. **Test All Services (Parallel)**:
   - **User Auth**: Runs `npm test` (Jest + Mock Mongoose).
   - **Order Service**: Runs `npm test` (Jest + Mock ObjectId).
   - **Product Service**: Runs `go test` inside a `golang:1.23` Docker container.
3. **Build & Push**: Builds Docker images and pushes to Docker Hub.
4. **Deploy**: Updates K3s deployments.

### Testing Approach
We moved to **Lightweight Integration Tests** to ensure fast CI feedback:
- **Mocking**: Replaced `mongodb-memory-server` with Jest Mocks to remove heavy binary downloads.
- **Scope**: Focused on Backend API reliability (Health checks, 404s, Content-Type validation).
- **Performance**: Tests run in seconds rather than minutes.

### Accessing Monitoring Tools
Once deployed via the pipeline, you can access the tools locally:

- **Grafana**: [http://localhost:32000](http://localhost:32000)
  - **User**: `admin`
  - **Password**: `admin`
- **Prometheus**: [http://localhost:30003](http://localhost:30003)
  - **Verify Targets**: Go to [Status > Targets](http://localhost:30003/targets) to see your pods connected.

