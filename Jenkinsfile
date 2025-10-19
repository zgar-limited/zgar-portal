// node {
//     stage('git pull') {
//         git branch: 'main', credentialsId: '219b2b05-a39e-49d3-a4b7-5c0fbdcafa05', url: 'git@github.com:zgar-limited/zgar-portal.git'
//     }
//     stage('build') {
//         docker.withServer('tcp://47.79.240.235:2375') {
//             docker.build "zgar-portal-prod:latest"
//             cleanWs()
//         }
//     }
// }

// pipeline {
//     agent {
//         dockerfile {
//             filename 'Dockerfile'
//             dir 'build'
//             label 'my-defined-label'
//             additionalBuildArgs  "--build-arg version=1.0.0"
//             // args '-v /tmp:/tmp'
//         }
//     }

//     stages {
//         stage('Build') {
//             steps {
//                 echo 'Building..'
//             }
//         }
//         stage('Test') {
//             steps {
//                 echo 'Testing..'
//             }
//         }
//         stage('Deploy') {
//             steps {
//                 echo 'Deploying....'
//             }
//         }
//     }
// }

pipeline {
    agent none
    stages {
        stage('git pull') {
            git branch: 'main', credentialsId: '219b2b05-a39e-49d3-a4b7-5c0fbdcafa05', url: 'git@github.com:zgar-limited/zgar-portal.git'
        }
        stage('build docker image') {
            agent {
                dockerfile {
                    filename 'Dockerfile'
                    dir 'build'
                    // label 'my-defined-label'
                    additionalBuildArgs  '--build-arg version=1.0.0'
                    // args '-v /tmp:/tmp'
                }
            }
            steps {
                sh 'docker images'
            }
        }
    }
}
