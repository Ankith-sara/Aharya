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
                // Clone the repo into workspace
                git branch: "${GIT_BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Backend Unit Tests') {
            steps {
                dir('backend') {
                    sh '''
                        chmod +x ./node_modules/.bin/jasmine || true
                        chmod +x ./node_modules/.bin/cross-env || true
                        npm run test:unit
                    '''
                }
            }
        }

        stage('Run Contract Tests') {
            steps {
                dir('backend') {
                    sh '''
                        # Start server in background
                        nohup npx cross-env JASMINE_TEST=true PORT_TEST=4001 node server.js > backend.log 2>&1 &
                        sleep 2
                        npx wait-port localhost:4001 -t 30000
                        npx jasmine tests/contract/contract.test.js
                        pkill -f "node server.js"
                    '''
                }
            }
        }

        stage('Build Backend Docker') {
            steps {
                dir('backend') {
                    sh "docker build -t $BACKEND_IMAGE ."
                }
            }
        }

        stage('Build Frontend Docker') {
            steps {
                dir('frontend') {
                    sh "docker build -t $FRONTEND_IMAGE ."
                }
            }
        }

        stage('Scan Docker Images') {
            steps {
                // Ensure Trivy is installed on Jenkins agent
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image $BACKEND_IMAGE"
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image $FRONTEND_IMAGE"
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push $BACKEND_IMAGE"
                    sh "docker push $FRONTEND_IMAGE"
                }
            }
        }

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
