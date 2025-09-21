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
                // Clone the repo
                git branch: "${GIT_BRANCH}", url: "${REPO_URL}"
            }
        }


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
