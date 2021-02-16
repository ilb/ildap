pipeline {
    agent any
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '3'))
    }
    stages {
        stage ('Build') {
            steps {
                sh 'npm install'
                sh 'npm publish'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
