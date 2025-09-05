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
        
        stage('Build Test') {
            steps {
                sh 'npm run prod'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        
        success {
            echo 'Build completed successfully!'
        }
    }
}
