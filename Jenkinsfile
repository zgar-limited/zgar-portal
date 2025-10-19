
pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                sh "docker build -f Dockerfile -t zgar-portal-prod-${env.BUILD_ID} ."
            }
        }
    }
}
