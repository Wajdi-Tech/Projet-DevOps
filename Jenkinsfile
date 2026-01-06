pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials'
        DOCKER_HUB_REPO = 'achrefs161'
        // Define default values for change detection flags
        CHANGE_ALL = 'false'
        CHANGE_FRONTEND = 'false'
        CHANGE_ADMIN_DASHBOARD = 'false'
        CHANGE_PRODUCT_SERVICE = 'false'
        CHANGE_ORDER_SERVICE = 'false'
        CHANGE_USER_AUTH = 'false'
    }

    stages {
        stage('Checkout & Detect Changes') {
            steps {
                script {
                    echo '📥 Récupération du code depuis GitHub...'
                    checkout scm
                    
                    // Logic to detect changes
                    // We check difference between current commit and previous successful commit
                    // If no previous successful commit (first run), we set CHANGE_ALL to true
                    def previousCommit = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
                    def currentCommit = env.GIT_COMMIT
                    
                    if (!previousCommit) {
                        echo "⚠️ No previous successful commit found. Running all stages."
                        env.CHANGE_ALL = 'true'
                    } else {
                        echo "🔍 Checking changes between ${previousCommit} and ${currentCommit}"
                        def changedFiles = sh(script: "git diff --name-only ${previousCommit} ${currentCommit}", returnStdout: true).trim()
                        echo "📝 Changed files:\n${changedFiles}"
                        
                        if (changedFiles.contains('Services/frontend')) {
                            env.CHANGE_FRONTEND = 'true'
                        }
                        if (changedFiles.contains('Services/admin-dashboard')) {
                            env.CHANGE_ADMIN_DASHBOARD = 'true'
                        }
                        if (changedFiles.contains('Services/product-catalogue')) {
                            env.CHANGE_PRODUCT_SERVICE = 'true'
                        }
                        if (changedFiles.contains('Services/gestion-commandes')) {
                            env.CHANGE_ORDER_SERVICE = 'true'
                        }
                        if (changedFiles.contains('Services/user-authentication')) {
                            env.CHANGE_USER_AUTH = 'true'
                        }
                        
                        // If infrastructure or K8s or Jenkinsfile changes, we might want to run everything or specific deploy steps
                        if (changedFiles.contains('k8s/') || changedFiles.contains('Jenkinsfile')) {
                             env.CHANGE_ALL = 'true'
                        }
                    }
                }
            }
        }

        stage('Test All Services') {
            parallel {
                stage('Test User Auth') {
                    when { expression { return env.CHANGE_USER_AUTH == 'true' || env.CHANGE_ALL == 'true' } }
                    steps {
                        dir('Services/user-authentication') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
                stage('Test Order Service') {
                    when { expression { return env.CHANGE_ORDER_SERVICE == 'true' || env.CHANGE_ALL == 'true' } }
                    steps {
                        dir('Services/gestion-commandes') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
                stage('Test Product Service') {
                    when { expression { return env.CHANGE_PRODUCT_SERVICE == 'true' || env.CHANGE_ALL == 'true' } }
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
                    when { expression { return env.CHANGE_FRONTEND == 'true' || env.CHANGE_ALL == 'true' } }
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
                    when { expression { return env.CHANGE_ADMIN_DASHBOARD == 'true' || env.CHANGE_ALL == 'true' } }
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
                    when { expression { return env.CHANGE_PRODUCT_SERVICE == 'true' || env.CHANGE_ALL == 'true' } }
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
                    when { expression { return env.CHANGE_ORDER_SERVICE == 'true' || env.CHANGE_ALL == 'true' } }
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
                    when { expression { return env.CHANGE_USER_AUTH == 'true' || env.CHANGE_ALL == 'true' } }
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

        stage('Cleanup Old Images') {
            steps {
                script {
                   // Removes "dangling" images (previous builds that lost the 'latest' tag)
                   sh 'docker image prune -f' 
                }
            }
        }

        stage('Deploy to K3s') {
            steps {
                script {
                    withEnv(["KUBECONFIG=/etc/rancher/k3s/k3s.yaml"]) {
                        // Optimistically trying to apply configs depending on changes, or just apply all as it's fast.
                        // User wants "do when there is change". Applying yaml is idempotent and fast usually.
                        // But deployments need restart to pick up new images.
                        
                        sh 'kubectl apply -f k8s/00-configuration/'
                        sh 'kubectl apply -f k8s/10-infrastructure/'
                        sh 'kubectl apply -f k8s/20-backend/'
                        sh 'kubectl apply -f k8s/30-frontend/'
                        sh 'kubectl apply -f k8s/40-gateway/'
                        sh 'kubectl apply -f k8s/50-monitoring/'
                        sh 'kubectl apply -f k8s/60-logging/'

                        // Conditional Restarts
                        if (env.CHANGE_ALL == 'true') {
                            sh 'kubectl rollout restart deployment frontend admin-dashboard user-authentication product-catalogue gestion-commandes'
                        } else {
                            if (env.CHANGE_FRONTEND == 'true') sh 'kubectl rollout restart deployment frontend'
                            if (env.CHANGE_ADMIN_DASHBOARD == 'true') sh 'kubectl rollout restart deployment admin-dashboard'
                            if (env.CHANGE_USER_AUTH == 'true') sh 'kubectl rollout restart deployment user-authentication'
                            if (env.CHANGE_PRODUCT_SERVICE == 'true') sh 'kubectl rollout restart deployment product-catalogue'
                            if (env.CHANGE_ORDER_SERVICE == 'true') sh 'kubectl rollout restart deployment gestion-commandes'
                        }
                    }
                }
            }
        }
    }
}
