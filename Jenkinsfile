
pipeline {
    stages {
        stage('Build Docker Image') {
            steps {
                sh "docker build -f Dockerfile -t ${env.BUILD_TAG}"
            }
        }
    }
}
