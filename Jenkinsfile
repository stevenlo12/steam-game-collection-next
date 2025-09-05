pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    tools {
        nodejs 'node-24'
    }
    
    environment {
        DB_NAME = 'fullstack_learning_db'
        DB_HOST = 'host.docker.internal'
        DB_PORT = '3306'
        DB_USER = 'root'
        DB_PASSWORD = 'root'
        DB_DIALECT = 'mysql'
        NODE_ENV = 'development'
    }
    
    stages {
        stage('Install Docker') {
            steps {
                sh '''
                    # Install Docker if not available
                    if ! command -v docker &> /dev/null; then
                        apt-get update
                        apt-get install -y docker.io
                        service docker start
                    fi
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Database Migration') {
            steps {
                sh 'npm run db:migrate'
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
