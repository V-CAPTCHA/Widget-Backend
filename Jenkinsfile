pipeline {
    agent any

    stages {
        stage('Git Clone') {
            steps {
                cleanWs()
                git branch: 'main',url: 'https://github.com/V-CAPTCHA/Widget-Backend.git'
                sh 'cp /var/lib/jenkins/workspace/env/Widget-Backend/.env ./.env'
            }
        }
                stage('Docker PreBuild Clear old image') {
            steps {
                
                sh 'docker stop widget_api || true && docker rm widget_api || true'
            }
        }
                stage('Docker Build') {
            steps {
                
                sh 'docker build . -t widget_api'
            }
        }
                stage('Docker Deploy') {
            steps {
                
                sh 'docker run -p 3000:3000/tcp --restart=always --name widget_api -d widget_api'
            }
        }
    }
}
