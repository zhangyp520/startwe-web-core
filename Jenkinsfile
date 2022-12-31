//Jenkinsfile by 张继平
pipeline {
    agent any
    stages {
        stage('拉取代码') {
            steps {
                echo '拉取代码'
                checkout([$class: 'GitSCM', branches: [[name: '*/develop']], extensions: [], userRemoteConfigs: [[credentialsId: '8c934045-1cd3-4662-94f5-11c5805a80e9', url: 'http://gitlab.startwe.cn/startwe/startwe-web.git']]])
            }
        }
        stage('部署项目') {
            steps {
                echo '部署项目'
                sh 'cp -r ${WORKSPACE}/* /home/projects/startwe/develop/startwe-web'
            }
        }
    }
}
