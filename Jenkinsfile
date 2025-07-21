pipeline {
    agent any

    environment {
        PROJECT_PATH = "RFPFront"
        SONARQUBE_URL = 'https://sonarqube.produccion.k24.indap.cl'
        SONARQUBE_TOKEN = '438a1d9b0b33d24e52b0ae89886a23edf8600f65'
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Clone repository') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node Environment') {
            agent {
                docker {
                    image 'node:lts-slim'
                    args "--user=${sh(script: 'id -u', returnStdout: true).trim()}:${sh(script: 'id -g', returnStdout: true).trim()}"
                }
            }
            steps {
                sh '''
                    cd ${PROJECT_PATH}
                    export npm_config_cache=$(pwd)/.npm
                    export npm_config_prefix=$(pwd)/.npm
                    # namei -m $(pwd)
                    rm -rf node_modules || true
                    rm -f package-lock.json || true
                    rm -f .npm || true
                    npm install
                '''
            }
        }



        // stage('Run Tests') {
        //     steps {
        //         dir('frontend') {
        //             script {
        //                 sh '''
        //                 apt update
        //                 apt install -y wget
        //                 wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
        //                 apt install -y ./google-chrome-stable_current_amd64.deb
        //                 npm test
        //                 '''  // Ejecuta los tests del proyecto frontend
        //             }
        //         }
        //     }
        // }

        stage('SonarQube Analysis') {
            agent {
                docker { image 'registry.indap.cl/sonar-scanner:1' }
            }
            steps {
                script {
                    withSonarQubeEnv('sonark24') {
                        sh '''
                            cd ${PROJECT_PATH}
                            sonar-scanner \
                            -Dsonar.projectKey=rfp-frontend-app \
                            -Dsonar.sources=./src \
                            -Dsonar.exclusions=node_modules/**,**/node_modules/** \
                            -Dsonar.host.url=https://sonarqube.produccion.k24.indap.cl \
                            -Dsonar.login=438a1d9b0b33d24e52b0ae89886a23edf8600f65
                        '''
                    }
                }
            }
        }

        stage('Build image') {
            steps {
                script {
                    app = docker.build("registro-fondos-publicos/frontend/app", "-f RFPFront/Dockerfile ./RFPFront/")
                }
            }
        }

        stage('Push image') {
            steps {
                script {
                    def git_sha1 = sh(returnStdout: true, script: 'git rev-parse --short HEAD | tr -d \'\\n\'')
                    docker.withRegistry('https://registry.indap.cl', 'registry') {
                        app.push("${git_sha1}")
                        app.push("latest")
                    }
                }
            }
        }

        stage('Trigger ManifestUpdate') {
            steps {
                script {
                    def git_sha1 = sh(returnStdout: true, script: 'git rev-parse --short HEAD | tr -d \'\\n\'')
                    build job: 'devel-gitops-riego-frontend', parameters: [string(name: 'DOCKERTAG', value: "${git_sha1}")]
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
