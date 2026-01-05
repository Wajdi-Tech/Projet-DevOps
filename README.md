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

## 📜 License
This project is for DevOps demonstration purposes.

---

## 🚀 6. Infrastructure Deployment (New)
This project uses **Terraform** as an orchestrator to deploy the application stack to a Kubernetes (K3s) cluster.

### 📋 Prerequisites
- Windows Machine with Terraform installed.
- Remote VM (Ubuntu Server) reachable via SSH.
- SSH Access configured (e.g., `ssh user@vm-ip`).

### 🛠️ Deployment Steps

#### Step 1: Install K3s on Remote VM
Connect to your VM and install K3s (lightweight Kubernetes):

```bash
ssh user@remote-vm-ip
curl -sfL https://get.k3s.io | sh -

# Ensure k3s.yaml is readable
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
```

#### Step 2: Config Local Access
Copy the kubeconfig from the VM to your Windows machine to allow Terraform to connect.

1.  **Copy File**: Copy `/etc/rancher/k3s/k3s.yaml` from VM to `C:\Users\YourUser\.kube\config`.
2.  **Update IP**: Edit the config file and change `server: https://127.0.0.1:6443` to `server: https://<VM-IP>:6443`.

#### Step 3: Deploy Applications (Terraform)
Navigate to the infrastructure folder and run the automation:

```powershell
cd Infrastructure/terraform
terraform init
terraform apply -auto-approve
```

**What this does:**
- Creates the `devops-project` namespace.
- Deploys Secrets & ConfigMaps.
- Deploys Databases (Postgres, MongoDB) with PVCs.
- Deploys Backend Microservices (User Auth, Product, Order).
- Deploys Frontend Applications (Next.js, Angular Admin).

#### Step 4: Verification
Check the status of your deployment:

```powershell
kubectl get pods -n devops-project
```


---

## 🧪 7. CI/CD & Testing Strategy (New)
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

