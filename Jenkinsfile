pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "ankith1807/backend:latest"
        FRONTEND_IMAGE = "ankith1807/frontend:latest"
        K8S_NAMESPACE = "dev"
        REPO_URL = "https://github.com/Ankith-sara/Aharya.git"
        GIT_BRANCH = "main"
    }

    stages {

        stage('Checkout') {
            steps {
<<<<<<< HEAD
                // Clone the repo into workspace
=======
                // Clone the repo
>>>>>>> 140e10d5034ca75b6ed4947fd43d29c7e143a58b
                git branch: "${GIT_BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Backend Unit Tests') {
            steps {
                dir('backend') {
<<<<<<< HEAD
                    sh '''
                        chmod +x ./node_modules/.bin/jasmine || true
                        chmod +x ./node_modules/.bin/cross-env || true
                        npm run test:unit
                    '''
=======
                    bat 'npm run test:unit'
>>>>>>> 140e10d5034ca75b6ed4947fd43d29c7e143a58b
                }
            }
        }

        stage('Run Contract Tests') {
            steps {
                dir('backend') {
<<<<<<< HEAD
                    sh '''
                        # Start server in background
                        nohup npx cross-env JASMINE_TEST=true PORT_TEST=4001 node server.js > backend.log 2>&1 &
                        sleep 2
                        npx wait-port localhost:4001 -t 30000
                        npx jasmine tests/contract/contract.test.js
                        pkill -f "node server.js"
=======
                    // Windows alternative for nohup + pkill
                    bat '''
                        start /B cmd /c "set JASMINE_TEST=true && set PORT_TEST=4001 && node server.js"
                        timeout /t 5
                        npx wait-port localhost:4001 -t 30000
                        npx jasmine tests/contract/contract.test.js
                        taskkill /IM node.exe /F
>>>>>>> 140e10d5034ca75b6ed4947fd43d29c7e143a58b
                    '''
                }
            }
        }

        stage('Build Backend Docker') {
            steps {
                dir('backend') {
                    bat "docker build -t %BACKEND_IMAGE% ."
                }
            }
        }

        stage('Build Frontend Docker') {
            steps {
                dir('frontend') {
                    bat "docker build -t %FRONTEND_IMAGE% ."
                }
            }
        }

        stage('Scan Docker Images') {
            steps {
<<<<<<< HEAD
                // Ensure Trivy is installed on Jenkins agent
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image $BACKEND_IMAGE"
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image $FRONTEND_IMAGE"
=======
                // Using Docker to run Trivy
                bat "docker run --rm -v //var/run/docker.sock:/var/run/docker.sock aquasec/trivy image %BACKEND_IMAGE%"
                bat "docker run --rm -v //var/run/docker.sock:/var/run/docker.sock aquasec/trivy image %FRONTEND_IMAGE%"
>>>>>>> 140e10d5034ca75b6ed4947fd43d29c7e143a58b
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
<<<<<<< HEAD
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push $BACKEND_IMAGE"
                    sh "docker push $FRONTEND_IMAGE"
=======
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                    bat "docker push %BACKEND_IMAGE%"
                    bat "docker push %FRONTEND_IMAGE%"
>>>>>>> 140e10d5034ca75b6ed4947fd43d29c7e143a58b
                }
            }
        }

<<<<<<< HEAD
        stage('Deploy to Kubernetes') {
            steps {
                dir('k8s/base') {
                    sh '''
                        kubectl apply -n $K8S_NAMESPACE -f admin-deployment.yaml
                        kubectl apply -n $K8S_NAMESPACE -f admin-service.yaml
                        kubectl apply -n $K8S_NAMESPACE -f backend-deployment.yaml
                        kubectl apply -n $K8S_NAMESPACE -f backend-service.yaml
                        kubectl apply -n $K8S_NAMESPACE -f frontend-deployment.yaml
                        kubectl apply -n $K8S_NAMESPACE -f frontend-service.yaml
                        kubectl apply -n $K8S_NAMESPACE -f ingress.yaml
                    '''
=======
        stage('Test Kubectl') {
            steps {
                withEnv(["KUBECONFIG=C:\\Users\\sarav\\.kube\\config"]) {
                    bat 'kubectl get nodes'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                dir('k8s/base') {
                    withEnv(["KUBECONFIG=C:\\Users\\sarav\\.kube\\config"]) {
                    bat """
                        kubectl apply -n dev -f backend-deployment.yaml --validate=false
                        kubectl apply -n dev -f backend-service.yaml --validate=false
                        kubectl apply -n dev -f frontend-deployment.yaml --validate=false
                        kubectl apply -n dev -f frontend-service.yaml --validate=false
                        kubectl apply -n dev -f ingress.yaml --validate=false
                    """
                    }
>>>>>>> 140e10d5034ca75b6ed4947fd43d29c7e143a58b
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace'
            cleanWs()
        }
    }
}
