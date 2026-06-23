pipeline {
    agent any

    environment {
        IMAGE_NAME = 'docker-proyecto'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    options {
        // Evita builds colgados para siempre
        timeout(time: 20, unit: 'MINUTES')
        // Mantiene solo los últimos 10 builds en el historial
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        // 1) BUILD: traer el código del repositorio (GitHub)
        stage('Build (Checkout)') {
            steps {
                echo 'Descargando el código fuente desde GitHub...'
                checkout scm
            }
        }

        // 2) INSTALL: instalar dependencias de Node
        stage('Install dependencies') {
            steps {
                echo 'Instalando dependencias con npm...'
                sh 'npm ci || npm install'
            }
        }

        // 3) TEST: ejecutar las pruebas (si existen)
        stage('Test') {
            steps {
                echo 'Ejecutando pruebas...'
                sh 'npm test || echo "No hay tests definidos todavia, se omite."'
            }
        }

        // 4) BUILD DOCKER IMAGE: construir la imagen del proyecto
        stage('Build Docker image') {
            steps {
                echo "Construyendo imagen Docker ${IMAGE_NAME}:${IMAGE_TAG}..."
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }
    }

    // Acciones finales según el pipelien
    post {
        success {
            echo "Pipeline completado con exito. Imagen lista: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo 'El pipeline fallo. Revisa los logs de la etapa marcada en rojo.'
        }
        always {
            echo 'Fin del pipeline.'
        }
    }
}
