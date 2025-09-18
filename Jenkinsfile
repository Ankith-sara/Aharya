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

        stage('Install Backend Dependencies and start backend server') {
           steps {
           dir('backend') {
            sh '''
            npm install
            # Start server in background
            nohup npm start > backend.log 2>&1 &
            
            # Wait for port 4000 to be ready (max 30s)
            timeout=30
            while ! curl -s http://localhost:4000/ > /dev/null; do
                sleep 1
                timeout=$((timeout-1))
                if [ $timeout -le 0 ]; then
                    echo "Server failed to start on port 4000"
                    exit 1
                fi
            done
            echo "Backend server is up on port 4000"
            '''
            }
        }
       }

        stage('Run Backend Unit Tests') {
            steps {
                dir('backend') {
                    sh 'chmod +x ./node_modules/.bin/jasmine'
                    sh 'chmod +x ./node_modules/.bin/cross-env || true'
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
