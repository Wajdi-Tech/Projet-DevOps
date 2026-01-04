variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "region" {
  description = "Target region for cloud resources"
  type        = string
  default     = "us-east-1"
}
