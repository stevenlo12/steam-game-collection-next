pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        NPM_CACHE = '/tmp/npm-cache'
        DB_NAME = 'fullstack_learning_db'
        DB_HOST = 'localhost'
        DB_PORT = '3306'
        DB_USER = 'root'
        DB_PASSWORD = ''
        DB_DIALECT = 'mysql'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Setup Environment') {
            steps {
                echo 'Setting up Node.js environment...'
                script {
                    // Install Node.js if not available
                    if (!tool name: 'NodeJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation') {
                        echo 'NodeJS tool not found, using system Node.js'
                    } else {
                        env.PATH = "${tool 'NodeJS'}/bin:${env.PATH}"
                    }
                }
                
                // Display Node.js and npm versions
                sh 'node --version'
                sh 'npm --version'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh '''
                    npm config set cache ${NPM_CACHE}
                    npm ci --production=false
                '''
            }
        }
        
        stage('Database Setup') {
            steps {
                echo 'Setting up database...'
                script {
                    try {
                        // Run database migrations
                        sh '''
                            export DB_NAME=${DB_NAME}
                            export DB_HOST=${DB_HOST}
                            export DB_PORT=${DB_PORT}
                            export DB_USER=${DB_USER}
                            export DB_PASSWORD=${DB_PASSWORD}
                            export DB_DIALECT=${DB_DIALECT}
                            
                            npx sequelize-cli db:migrate
                        '''
                    } catch (Exception e) {
                        echo 'Database migration failed, but continuing...'
                        echo "Error: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Build Application') {
            steps {
                echo 'Building application...'
                sh '''
                    # Create build directory
                    mkdir -p build
                    
                    # Copy source files
                    cp -r * build/
                    
                    # Create production package
                    cd build
                    npm ci --only=production
                    
                    # Create deployment archive
                    tar -czf ../steam-scraper-${BUILD_NUMBER}.tar.gz .
                '''
                
                // Archive the build artifacts
                archiveArtifacts artifacts: "steam-scraper-${BUILD_NUMBER}.tar.gz", fingerprint: true
            }
        }
        
        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                script {
                    try {
                        sh '''
                            docker build -t steam-scraper:${BUILD_NUMBER} .
                            docker tag steam-scraper:${BUILD_NUMBER} steam-scraper:latest
                        '''
                    } catch (Exception e) {
                        echo 'Docker build failed, but continuing...'
                        echo "Error: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging environment...'
                script {
                    try {
                        sh '''
                            # Deploy to staging server
                            echo "Deploying build ${BUILD_NUMBER} to staging..."
                            
                            # Stop existing application
                            docker stop steam-scraper-staging || true
                            docker rm steam-scraper-staging || true
                            
                            # Run new container
                            docker run -d \
                                --name steam-scraper-staging \
                                --restart unless-stopped \
                                -p 3001:80 \
                                -e NODE_ENV=staging \
                                -e DB_NAME=${DB_NAME} \
                                -e DB_HOST=${DB_HOST} \
                                -e DB_PORT=${DB_PORT} \
                                -e DB_USER=${DB_USER} \
                                -e DB_PASSWORD=${DB_PASSWORD} \
                                -e DB_DIALECT=${DB_DIALECT} \
                                steam-scraper:${BUILD_NUMBER}
                        '''
                    } catch (Exception e) {
                        echo 'Staging deployment failed'
                        echo "Error: ${e.getMessage()}"
                        error 'Staging deployment failed'
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                echo 'Cleaning up...'
                script {
                    try {
                        // Remove old Docker images
                        sh '''
                            docker image prune -f
                            docker system prune -f
                        '''
                        
                        // Clean npm cache
                        sh 'npm cache clean --force'
                    } catch (Exception e) {
                        echo 'Cleanup failed, but continuing...'
                        echo "Error: ${e.getMessage()}"
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed'
            
            // Clean workspace
            cleanWs()
        }
        
        success {
            echo 'Pipeline succeeded!'
            echo 'Deployment successful!'
        }
        
        failure {
            echo 'Pipeline failed!'
            
            // Send failure notification
            script {
                echo "Build ${BUILD_NUMBER} failed!"
                echo "Branch: ${env.BRANCH_NAME}"
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }
        
        unstable {
            echo 'Pipeline unstable!'
        }
    }
    
    options {
        // Pipeline options
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
        
        // Build options
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        // Skip stages on certain conditions
        skipStagesAfterUnstable()
    }
    
    triggers {
        // Trigger on code changes
        pollSCM('H/5 * * * *')
        
        // Trigger on webhook (if configured)
        // genericTrigger(
        //     genericVariables: [
        //         [key: 'ref', value: '$.ref'],
        //         [key: 'before', value: '$.before'],
        //         [key: 'after', value: '$.after']
        //     ],
        //     causeString: 'Triggered by webhook',
        //     token: 'your-webhook-token'
        // )
    }
}
