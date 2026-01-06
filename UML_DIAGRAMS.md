# UML Architecture Diagrams - E-Commerce DevOps Project

## 1. Component Diagram (Vue d'ensemble du système)

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end
    
    subgraph "Frontend Applications"
        Frontend["Frontend Service<br/>(Next.js 15)<br/>Port: 3000"]
        Admin["Admin Dashboard<br/>(Angular 19)<br/>Port: 80"]
    end
    
    subgraph "API Gateway Layer"
        Ingress["Traefik Ingress<br/>shop.local"]
    end
    
    subgraph "Backend Microservices"
        AuthService["User Authentication<br/>(Node.js + Express)<br/>Port: 5000"]
        ProductService["Product Catalogue<br/>(Go + Fiber)<br/>Port: 4000"]
        OrderService["Order Management<br/>(Node.js + Express)<br/>Port: 5100"]
    end
    
    subgraph "Data Persistence"
        MongoDB["MongoDB<br/>(StatefulSet)<br/>authentication-service<br/>gestion-commandes"]
        PostgreSQL["PostgreSQL<br/>(StatefulSet)<br/>product_db"]
    end
    
    subgraph "Monitoring Stack"
        Prometheus["Prometheus<br/>Port: 30003"]
        Grafana["Grafana<br/>Port: 32000"]
    end
    
    subgraph "Logging Stack"
        Fluentd["Fluentd<br/>(DaemonSet)"]
        Elasticsearch["Elasticsearch<br/>Port: 30092"]
        Kibana["Kibana<br/>Port: 30056"]
    end
    
    Browser --> Frontend
    Browser --> Admin
    Frontend --> Ingress
    Admin --> Ingress
    
    Ingress -->|/api/auth| AuthService
    Ingress -->|/products| ProductService
    Ingress -->|/api/orders| OrderService
    
    AuthService --> MongoDB
    OrderService --> MongoDB
    ProductService --> PostgreSQL
    
    AuthService -.->|metrics| Prometheus
    ProductService -.->|metrics| Prometheus
    OrderService -.->|metrics| Prometheus
    Prometheus --> Grafana
    
    AuthService -.->|logs| Fluentd
    ProductService -.->|logs| Fluentd
    OrderService -.->|logs| Fluentd
    Fluentd --> Elasticsearch
    Elasticsearch --> Kibana
    
    style Frontend fill:#4CAF50,color:#fff
    style Admin fill:#4CAF50,color:#fff
    style AuthService fill:#2196F3,color:#fff
    style ProductService fill:#2196F3,color:#fff
    style OrderService fill:#2196F3,color:#fff
    style MongoDB fill:#47A248,color:#fff
    style PostgreSQL fill:#336791,color:#fff
    style Prometheus fill:#E6522C,color:#fff
    style Grafana fill:#F46800,color:#fff
    style Elasticsearch fill:#005571,color:#fff
    style Kibana fill:#005571,color:#fff
```

---

## 2. Deployment Diagram (Diagramme de déploiement Kubernetes)

```mermaid
graph TB
    subgraph "Kubernetes Cluster (K3s)"
        subgraph "Namespace: default"
            subgraph "Configuration"
                Secrets["Secrets<br/>shop-secrets"]
                ConfigMap["ConfigMaps<br/>runtime-config"]
                PVC["PersistentVolumeClaims<br/>mongo-pvc<br/>postgres-pvc"]
            end
            
            subgraph "Infrastructure Layer"
                MongoSS["MongoDB<br/>StatefulSet<br/>replicas: 1"]
                PostgresSS["PostgreSQL<br/>StatefulSet<br/>replicas: 1"]
            end
            
            subgraph "Backend Services"
                AuthDeploy["user-authentication<br/>Deployment<br/>replicas: 1<br/>Image: achrefs161/user-auth-service"]
                ProductDeploy["product-catalogue<br/>Deployment<br/>replicas: 1<br/>Image: achrefs161/product-service"]
                OrderDeploy["order-service<br/>Deployment<br/>replicas: 1<br/>Image: achrefs161/order-service"]
            end
            
            subgraph "Frontend Services"
                FrontendDeploy["frontend<br/>Deployment<br/>replicas: 1<br/>Image: achrefs161/frontend-service"]
                AdminDeploy["admin-dashboard<br/>Deployment<br/>replicas: 1<br/>Image: achrefs161/admin-dashboard"]
            end
            
            subgraph "Ingress Layer"
                IngressCtrl["Traefik Ingress Controller<br/>shop.local"]
            end
            
            subgraph "Monitoring"
                PromDeploy["Prometheus<br/>Deployment<br/>NodePort: 30003"]
                GrafanaDeploy["Grafana<br/>Deployment<br/>NodePort: 32000"]
            end
            
            subgraph "Logging"
                ESDeploy["Elasticsearch<br/>Deployment<br/>NodePort: 30092"]
                KibanaDeploy["Kibana<br/>Deployment<br/>NodePort: 30056"]
                FluentdDS["Fluentd<br/>DaemonSet"]
            end
        end
    end
    
    subgraph "External Services"
        DockerHub["DockerHub Registry<br/>achrefs161/*"]
        GitHub["GitHub Repository<br/>Wajdi-Tech/Projet-DevOps"]
    end
    
    subgraph "CI/CD Infrastructure"
        Jenkins["Jenkins Server<br/>Pipeline Runner"]
    end
    
    GitHub -->|webhook| Jenkins
    Jenkins -->|builds & pushes| DockerHub
    Jenkins -->|deploys| AuthDeploy
    Jenkins -->|deploys| ProductDeploy
    Jenkins -->|deploys| OrderDeploy
    Jenkins -->|deploys| FrontendDeploy
    Jenkins -->|deploys| AdminDeploy
    
    AuthDeploy -.->|uses| Secrets
    ProductDeploy -.->|uses| Secrets
    OrderDeploy -.->|uses| Secrets
    
    MongoSS -.->|uses| PVC
    PostgresSS -.->|uses| PVC
    
    style MongoSS fill:#47A248,color:#fff
    style PostgresSS fill:#336791,color:#fff
    style Jenkins fill:#D33833,color:#fff
    style DockerHub fill:#2496ED,color:#fff
```

---

## 3. Sequence Diagram - User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend<br/>(Next.js)
    participant Ingress as Traefik Ingress
    participant Auth as User Auth Service<br/>(Node.js)
    participant MongoDB as MongoDB
    participant Prometheus as Prometheus
    
    User->>Frontend: Access login page
    Frontend->>User: Display login form
    
    User->>Frontend: Submit credentials<br/>(email, password)
    Frontend->>Ingress: POST /api/auth/login
    Ingress->>Auth: Forward request
    
    Auth->>MongoDB: Find user by email
    MongoDB-->>Auth: Return user document
    
    Auth->>Auth: Verify password<br/>(bcrypt.compare)
    
    alt Password Valid
        Auth->>Auth: Generate JWT token
        Auth->>Prometheus: Increment login_success metric
        Auth-->>Ingress: 200 OK + JWT token
        Ingress-->>Frontend: Return JWT
        Frontend->>Frontend: Store token in localStorage
        Frontend-->>User: Redirect to dashboard
    else Password Invalid
        Auth->>Prometheus: Increment login_failed metric
        Auth-->>Ingress: 401 Unauthorized
        Ingress-->>Frontend: Error response
        Frontend-->>User: Display error message
    end
```

---

## 4. Sequence Diagram - Product Creation Flow (Admin)

```mermaid
sequenceDiagram
    actor Admin
    participant Dashboard as Admin Dashboard<br/>(Angular)
    participant Ingress as Traefik Ingress
    participant Auth as User Auth Service
    participant Product as Product Service<br/>(Go)
    participant PostgreSQL as PostgreSQL
    participant Fluentd as Fluentd
    
    Admin->>Dashboard: Navigate to "Add Product"
    Dashboard->>Admin: Display product form
    
    Admin->>Dashboard: Fill form + Upload image
    Dashboard->>Ingress: POST /products<br/>(with JWT token)
    
    Ingress->>Product: Forward request
    Product->>Product: Verify JWT token
    
    alt Token Valid
        Product->>Product: Save image to /uploads
        Product->>PostgreSQL: INSERT INTO products
        PostgreSQL-->>Product: Product ID
        
        Product->>Fluentd: Log: Product created
        Product-->>Ingress: 201 Created + Product data
        Ingress-->>Dashboard: Success response
        Dashboard-->>Admin: Display success message
    else Token Invalid
        Product-->>Ingress: 401 Unauthorized
        Ingress-->>Dashboard: Error response
        Dashboard-->>Admin: Redirect to login
    end
```

---

## 5. Sequence Diagram - Order Creation Flow

```mermaid
sequenceDiagram
    actor Customer
    participant Frontend as Frontend<br/>(Next.js)
    participant Ingress as Traefik
    participant Order as Order Service<br/>(Node.js)
    participant Product as Product Service<br/>(Go)
    participant Auth as Auth Service
    participant MongoDB as MongoDB
    
    Customer->>Frontend: Add items to cart
    Customer->>Frontend: Click "Checkout"
    
    Frontend->>Ingress: POST /api/orders<br/>(JWT + cart items)
    Ingress->>Order: Forward request
    
    Order->>Order: Verify JWT
    
    par Validate Products
        Order->>Ingress: GET /products/{id}
        Ingress->>Product: Forward
        Product-->>Order: Product details
    and Fetch User Info
        Order->>MongoDB: Query authentication-service DB
        MongoDB-->>Order: User details
    end
    
    Order->>Order: Calculate total
    Order->>MongoDB: INSERT order document
    MongoDB-->>Order: Order ID
    
    Order-->>Ingress: 201 Created + Order confirmation
    Ingress-->>Frontend: Success
    Frontend-->>Customer: Display order confirmation
```

---

## 6. CI/CD Pipeline Sequence Diagram

```mermaid
sequenceDiagram
    actor Developer
    participant GitHub as GitHub
    participant Jenkins as Jenkins Pipeline
    participant Docker as DockerHub
    participant K8s as Kubernetes Cluster
    participant Services as Running Services
    
    Developer->>GitHub: git push (main branch)
    GitHub->>Jenkins: Webhook trigger
    
    Jenkins->>Jenkins: Checkout code
    Jenkins->>Jenkins: Detect changed services
    
    par Run Tests
        Jenkins->>Jenkins: npm test (User Auth)
        Jenkins->>Jenkins: npm test (Order Service)
        Jenkins->>Jenkins: go test (Product Service)
    end
    
    alt Tests Pass
        par Build Docker Images (Conditional)
            Jenkins->>Docker: docker build + push<br/>(only changed services)
        end
        
        Jenkins->>K8s: kubectl apply -f k8s/00-configuration/
        Jenkins->>K8s: kubectl apply -f k8s/10-infrastructure/
        Jenkins->>K8s: kubectl apply -f k8s/20-backend/
        Jenkins->>K8s: kubectl apply -f k8s/30-frontend/
        Jenkins->>K8s: kubectl apply -f k8s/40-gateway/
        Jenkins->>K8s: kubectl apply -f k8s/50-monitoring/
        Jenkins->>K8s: kubectl apply -f k8s/60-logging/
        
        Jenkins->>K8s: kubectl rollout restart deployment
        K8s->>Services: Replace pods with new images
        Services-->>K8s: Pods ready
        K8s-->>Jenkins: Deployment successful
        Jenkins-->>Developer: ✅ Build SUCCESS
    else Tests Fail
        Jenkins-->>Developer: ❌ Build FAILED
    end
```

---

## 7. Class Diagram - User Authentication Service

```mermaid
classDiagram
    class User {
        +String _id
        +String firstName
        +String lastName
        +String email
        +String password (hashed)
        +Date createdAt
        +save()
        +findByEmail()
        +comparePassword()
    }
    
    class AuthController {
        +register(req, res)
        +login(req, res)
        +getUserProfile(req, res)
    }
    
    class AuthMiddleware {
        +verifyToken(req, res, next)
        +extractUserFromToken()
    }
    
    class JWT {
        +sign(payload, secret)
        +verify(token, secret)
    }
    
    class BCrypt {
        +hash(password, salt)
        +compare(password, hash)
    }
    
    class Prometheus {
        +Counter login_total
        +Counter register_total
        +Histogram request_duration
        +collectMetrics()
    }
    
    AuthController --> User : uses
    AuthController --> JWT : uses
    AuthController --> BCrypt : uses
    AuthController --> Prometheus : records metrics
    AuthMiddleware --> JWT : uses
```

---

## 8. Class Diagram - Product Catalogue Service (Go)

```mermaid
classDiagram
    class Product {
        +uint ID
        +string Name
        +string Description
        +float64 Price
        +int Stock
        +string Category
        +string ImageURL
        +time.Time CreatedAt
    }
    
    class ProductController {
        +GetAllProducts(c *fiber.Ctx)
        +GetProductByID(c *fiber.Ctx)
        +CreateProduct(c *fiber.Ctx)
        +UpdateProduct(c *fiber.Ctx)
        +DeleteProduct(c *fiber.Ctx)
        +UploadImage(c *fiber.Ctx)
    }
    
    class Database {
        +*gorm.DB DB
        +Connect(config Config)
        +AutoMigrate(model interface{})
    }
    
    class AuthMiddleware {
        +JWTProtected(c *fiber.Ctx)
        +ValidateToken(token string)
    }
    
    class PrometheusMiddleware {
        +Middleware(c *fiber.Ctx)
        +RegisterMetrics()
    }
    
    ProductController --> Product : manages
    ProductController --> Database : uses
    ProductController --> AuthMiddleware : protected by
    ProductController --> PrometheusMiddleware : monitored by
```

---

## 9. Infrastructure Component Diagram

```mermaid
graph TB
    subgraph "Physical Infrastructure"
        RemoteVM["Remote VM<br/>(Ubuntu Server)<br/>IP: 192.168.137.10"]
    end
    
    subgraph "K3s Cluster Components"
        K3sServer["K3s Server<br/>(Kubernetes API)"]
        Kubelet["Kubelet<br/>(Node Agent)"]
        ContainerD["containerd<br/>(Container Runtime)"]
        TraefikIngress["Traefik<br/>(Default Ingress Controller)"]
    end
    
    subgraph "Automation Tools"
        Ansible["Ansible Controller<br/>(Windows WSL)"]
        Jenkins["Jenkins CI/CD"]
    end
    
    subgraph "Storage"
        LocalPath["/var/lib/rancher/k3s/storage<br/>(Local Path Provisioner)"]
    end
    
    Ansible -->|SSH| RemoteVM
    Ansible -->|Installs K3s| K3sServer
    RemoteVM --> K3sServer
    K3sServer --> Kubelet
    Kubelet --> ContainerD
    K3sServer --> TraefikIngress
    Kubelet --> LocalPath
    Jenkins -->|kubectl commands| K3sServer
    
    style RemoteVM fill:#FF9800,color:#fff
    style Ansible fill:#EE0000,color:#fff
    style Jenkins fill:#D33833,color:#fff
```

---

## 10. Data Flow Diagram - Complete Request Cycle

```mermaid
graph LR
    User((User)) -->|HTTP Request| Browser[Web Browser]
    Browser -->|shop.local| DNS[Local DNS/Hosts File]
    DNS -->|127.0.0.1| K3s[K3s Cluster]
    K3s --> Ingress[Traefik Ingress]
    
    Ingress -->|/| Frontend[Frontend Service]
    Ingress -->|/admin| Admin[Admin Dashboard]
    Ingress -->|/api/auth/*| Auth[Auth Service]
    Ingress -->|/products/*| Product[Product Service]
    Ingress -->|/api/orders/*| Order[Order Service]
    
    Frontend -->|Fetch Data| Ingress
    Admin -->|Fetch Data| Ingress
    
    Auth -->|Read/Write| MongoDB[(MongoDB)]
    Order -->|Read/Write| MongoDB
    Product -->|Read/Write| PostgreSQL[(PostgreSQL)]
    
    Auth -.->|Metrics| Prometheus[Prometheus]
    Product -.->|Metrics| Prometheus
    Order -.->|Metrics| Prometheus
    Prometheus -->|Dashboard| Grafana[Grafana]
    
    Auth -.->|Logs| Fluentd[Fluentd]
    Product -.->|Logs| Fluentd
    Order -.->|Logs| Fluentd
    Frontend -.->|Logs| Fluentd
    Admin -.->|Logs| Fluentd
    Fluentd -->|Index| Elasticsearch[(Elasticsearch)]
    Elasticsearch -->|Visualize| Kibana[Kibana]
    
    style User fill:#9C27B0,color:#fff
    style Frontend fill:#4CAF50,color:#fff
    style Admin fill:#4CAF50,color:#fff
    style Auth fill:#2196F3,color:#fff
    style Product fill:#2196F3,color:#fff
    style Order fill:#2196F3,color:#fff
    style MongoDB fill:#47A248,color:#fff
    style PostgreSQL fill:#336791,color:#fff
```

---

## Légende des Diagrammes

### Types de Connexions
- **Ligne pleine (→)**: Flux de données direct / Appel synchrone
- **Ligne pointillée (-.→)**: Flux asynchrone / Monitoring / Logging
- **Ligne épaisse**: Connexion principale
- **Ligne fine**: Connexion secondaire

### Couleurs des Composants
- 🟢 **Vert**: Applications frontend (Next.js, Angular)
- 🔵 **Bleu**: Services backend (Node.js, Go)
- 🟠 **Orange**: Bases de données (MongoDB, PostgreSQL)
- 🔴 **Rouge**: Outils CI/CD (Jenkins, Prometheus, Grafana)
- 🟣 **Violet**: Services de logging (EFK Stack)

### Ports Principaux
- **3000**: Frontend (Next.js)
- **80**: Admin Dashboard (Angular)
- **5000**: User Authentication Service
- **4000**: Product Catalogue Service
- **5100**: Order Management Service
- **27017**: MongoDB
- **5432**: PostgreSQL
- **30003**: Prometheus (NodePort)
- **32000**: Grafana (NodePort)
- **30092**: Elasticsearch (NodePort)
- **30056**: Kibana (NodePort)
