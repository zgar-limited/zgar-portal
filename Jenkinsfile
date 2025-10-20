
pipeline {
    agent any
    stages {
        stage('sync code from github'){
            steps {
                git branch: 'test', credentialsId: '219b2b05-a39e-49d3-a4b7-5c0fbdcafa05', url: 'git@github.com:zgar-limited/zgar-portal.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh "docker build -f Dockerfile -t zgar-portal-prod-${env.BUILD_ID} ."
            }
        }
    }
}
