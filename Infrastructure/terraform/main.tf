# --- Namespace Management ---
resource "kubernetes_namespace" "devops" {
  metadata {
    name = "devops-project"
  }
}

# --- Deployment Orchestration ---

# 1. Configuration (Secrets, ConfigMaps, Storage)
resource "null_resource" "apply_k8s_config" {
  provisioner "local-exec" {
    command = "kubectl apply -f ../../k8s/00-configuration/ -n devops-project"
    interpreter = ["PowerShell", "-Command"]
  }

  triggers = {
    always_run = "${timestamp()}"
  }

  depends_on = [kubernetes_namespace.devops]
}

# 2. Infrastructure (Databases: Postgres, MongoDB)
resource "null_resource" "apply_k8s_infra" {
  provisioner "local-exec" {
    command = "kubectl apply -f ../../k8s/10-infrastructure/ -n devops-project"
    interpreter = ["PowerShell", "-Command"]
  }

  triggers = {
    always_run = "${timestamp()}"
  }

  depends_on = [null_resource.apply_k8s_config]
}

# 3. Backend Microservices
resource "null_resource" "apply_k8s_backend" {
  provisioner "local-exec" {
    command = "kubectl apply -f ../../k8s/20-backend/ -n devops-project"
    interpreter = ["PowerShell", "-Command"]
  }

  triggers = {
    always_run = "${timestamp()}"
  }

  depends_on = [null_resource.apply_k8s_infra]
}

# 4. Frontend Applications
resource "null_resource" "apply_k8s_frontend" {
  provisioner "local-exec" {
    command = "kubectl apply -f ../../k8s/30-frontend/ -n devops-project"
    interpreter = ["PowerShell", "-Command"]
  }

  triggers = {
    always_run = "${timestamp()}"
  }

  depends_on = [null_resource.apply_k8s_backend]
}

# 5. Gateway / Ingress (Optional)
resource "null_resource" "apply_k8s_gateway" {
  provisioner "local-exec" {
    command = "kubectl apply -f ../../k8s/40-gateway/ -n devops-project"
    interpreter = ["PowerShell", "-Command"]
  }

  triggers = {
    always_run = "${timestamp()}"
  }

  depends_on = [null_resource.apply_k8s_frontend]
}
