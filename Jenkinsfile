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
                    sh 'chmod +x ./node_modules/.bin/jasmine'
                    sh 'chmod +x ./node_modules/.bin/cross-env || true'
                    sh 'npm run test:unit'
                }
            }
        }


        stage('Run Contract Tests') {
        steps {
        dir('backend') {
            sh '''
            # Start server in background
            nohup npx cross-env JASMINE_TEST=true PORT_TEST=4001 node server.js > backend.log 2>&1 &

            # Give a small buffer to let node start
            sleep 2

            # Wait for port to be ready
            npx wait-port localhost:4001 -t 30000

            # Run contract tests
            npx jasmine tests/contract/contract.test.js

            # Kill background server
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
        sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ankith1807/backend:latest'
        sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ankith1807/frontend:latest'
    }
    }


        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    // Use --password-stdin to avoid interactive login issues
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push $BACKEND_IMAGE"
                    sh "docker push $FRONTEND_IMAGE"
                }
            }

      
        }


          stage('Deploy to Kubernetes') {
            steps {
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


    post {
        always {
            echo 'Cleaning up workspace'
            cleanWs()
        }
    }
}
