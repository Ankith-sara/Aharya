pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "ankith1807/backend:latest"
        FRONTEND_IMAGE = "ankith1807/frontend:latest"
        K8S_NAMESPACE = "dev"
    }

    stages {

        stage('Checkout') {
            steps {
               git branch: 'main', url: 'https://github.com/Ankith-sara/Aharya.git'
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
                    sh 'npm run test:unit'
                }
            }
        }

        stage('Run Contract Tests') {
            steps {
                dir('backend') {
                    sh 'npx jasmine tests/contract/contract.test.js'
                    // or use Dredd: sh 'dredd ../openapi.yaml http://localhost:4000'
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
                sh "docker scan $BACKEND_IMAGE || echo 'Scan backend image skipped/fail-safe'"
                sh "docker scan $FRONTEND_IMAGE || echo 'Scan frontend image skipped/fail-safe'"
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'ankith1807', passwordVariable: 'DockerAKS@123')]) {
                    sh 'docker login -u $USER -p $PASS'
                    sh "docker push $BACKEND_IMAGE"
                    sh "docker push $FRONTEND_IMAGE"
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
