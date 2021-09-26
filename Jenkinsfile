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
        stage('SonarQube Analysis') {
            environment {
            scannerHome = tool 'SonarLocal'
        }
            steps{
               withSonarQubeEnv('SonarLocal') {
                   sh "${scannerHome}/bin/sonar-scanner"
}
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
                
                sh 'docker run -p 4000:3000/tcp --restart=always --name widget_api -d widget_api'
            }
        }

                stage('Discord Hook Notify') {
            steps {
                
                discordSend description: "Build & Deploy Widget_API",thumbnail:"https://avatars.githubusercontent.com/u/89780796?s=400&u=b179f6040d24c70e5e15560c17dd22c3ace8d688&v=4", link: env.BUILD_URL,footer: "Build Number "+env.BUILD_NUMBER, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/891471982401560586/Bs8_1ecN3As1iOAX-TZwHAR-Xe5kmpCk1CqNTMw4RXHdOnard_Rr8212TaFcnL_w--6N"

            }
        }

    }
}
