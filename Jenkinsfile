node {
    stage('git pull') {
        git branch: 'main', credentialsId: '219b2b05-a39e-49d3-a4b7-5c0fbdcafa05', url: 'git@github.com:zgar-limited/zgar-portal.git'
    }
    stage('build') {
        docker.withServer('tcp://47.79.240.235:2375') {
            def customImage = docker.build("zgar-portal-prod:${env.BUILD_TAG}")
            cleanWs()
            
        }
    }
}
