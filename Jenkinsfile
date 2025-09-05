pipeline {
    agent any
    
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
        
        stage('Start Application') {
            steps {
                script {
                    sh '''
                        # Kill any existing process on port 80
                        pkill -f "node ./bin/www" || true
                        
                        # Start the application in background
                        nohup npm run prod > app.log 2>&1 &
                        
                        # Wait a moment for the app to start
                        sleep 5
                        
                        # Check if the app is running
                        if pgrep -f "node ./bin/www" > /dev/null; then
                            echo "Application started successfully!"
                            echo "Application is accessible at http://localhost:80"
                        else
                            echo "Failed to start application"
                            exit 1
                        fi
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
            echo 'Pipeline completed successfully!'
            echo 'Your application is now running and accessible at http://localhost:80'
        }
    }
}
