pipeline {
    agent any
    
    tools {
        nodejs 'node-24'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'yarn install --frozen-lockfile'
            }
        }
        
        stage('Database Migration') {
            steps {
                sh 'yarn run db:migrate'
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    def imageName = "steam-game-collection:${BUILD_NUMBER}"
                    sh "docker build -t ${imageName} ."
                    sh "docker tag ${imageName} steam-game-collection:latest"
                }
            }
        }
        
        stage('Run Container') {
            steps {
                script {
                    sh '''
                        # Stop and remove existing container if running
                        docker stop steam-game-collection-app || true
                        docker rm steam-game-collection-app || true
                        
                        # Run new container with port mapping
                        docker run -d \
                            --name steam-game-collection-app \
                            --restart unless-stopped \
                            -p 3000:3000 \
                            steam-game-collection:latest
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        
        success {
            echo 'Application is now running and accessible at http://localhost:3000'
        }
    }
}
