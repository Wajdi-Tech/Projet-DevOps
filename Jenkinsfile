pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials'
        DOCKER_HUB_REPO = 'achrefs161'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Récupération du code depuis GitHub...'
                git branch: 'main', url: 'https://github.com/Wajdi-Tech/Projet-DevOps.git'
            }
        }

        stage('Test All Services') {
            parallel {
                stage('Test User Auth') {
                    steps {
                        dir('Services/user-authentication') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
                stage('Test Order Service') {
                    steps {
                        dir('Services/gestion-commandes') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
                stage('Test Product Service') {
                    steps {
                        script {
                            docker.image('golang:1.23').inside {
                                dir('Services/product-catalogue') {
                                    // Set Go cache to writable folder
                                    withEnv(['GOCACHE=/tmp/.cache/go-build']) {
                                        sh 'mkdir -p $GOCACHE'
                                        sh 'go test -v ./...'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('Build & Push Docker Images') {
            parallel {
                stage('Frontend') {
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
                                sh "docker build -t ${DOCKER_HUB_REPO}/frontend-service:latest ./Services/frontend"
                                sh "docker push ${DOCKER_HUB_REPO}/frontend-service:latest"
                            }
                        }
                    }
                }
                stage('Admin Dashboard') {
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
                                sh "docker build -t ${DOCKER_HUB_REPO}/admin-dashboard:latest ./Services/admin-dashboard"
                                sh "docker push ${DOCKER_HUB_REPO}/admin-dashboard:latest"
                            }
                        }
                    }
                }
                stage('Product Service') {
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
                                sh "docker build -t ${DOCKER_HUB_REPO}/product-service:latest ./Services/product-catalogue"
                                sh "docker push ${DOCKER_HUB_REPO}/product-service:latest"
                            }
                        }
                    }
                }
                stage('Order Service') {
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
                                sh "docker build -t ${DOCKER_HUB_REPO}/order-service:latest ./Services/gestion-commandes"
                                sh "docker push ${DOCKER_HUB_REPO}/order-service:latest"
                            }
                        }
                    }
                }
                stage('User Auth') {
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
                                sh "docker build -t ${DOCKER_HUB_REPO}/user-auth-service:latest ./Services/user-authentication"
                                sh "docker push ${DOCKER_HUB_REPO}/user-auth-service:latest"
                            }
                        }
                    }
                }
            }
        }

stage('Deploy to K3s') {
    steps {
        script {
            withEnv(["KUBECONFIG=/etc/rancher/k3s/k3s.yaml"]) {
                sh 'kubectl apply -f k8s/00-configuration/'
                sh 'kubectl apply -f k8s/10-infrastructure/'
                sh 'kubectl apply -f k8s/20-backend/'
                sh 'kubectl apply -f k8s/30-frontend/'
                sh 'kubectl apply -f k8s/40-gateway/'
                sh 'kubectl apply -f k8s/50-monitoring/'
                sh 'kubectl apply -f k8s/60-logging/'

                sh 'kubectl rollout restart deployment frontend admin-dashboard user-authentication product-catalogue gestion-commandes'
            }
        }
    }
}


    }
}
