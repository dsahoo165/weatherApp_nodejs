pipeline {
agent any

    stages {
        stage('Create Image') {            
            steps {
		
	                sh """
	                pwd
	                ls
	                docker images
	                docker build -t dsahoo165/node_api_feb24:${env.BUILD_NUMBER} .
	                docker images
	                """
			    stash name: 'build-artifacts', includes: '**/*', excludes: 'workspace**' 
			withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {                
	                     sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'                    
	                     // #Commented to avoid un-necessary push
	                     //sh "docker push dsahoo165/node_api_jan24:${env.BUILD_NUMBER}"
	
	                }
		
            }            
        }
        stage('Run Image') {
            steps {  
	            dir("workspace"){		
                    sh """
                    docker ps   
            
                    docker compose down
                    
                    export IMAGE=dsahoo165/node_api_feb24
                    export TAG=${env.BUILD_NUMBER}
                    export PORT_TO_RUN=3000
                    docker compose up -d

                    docker ps
                    """
            }
	    }
        }
	    
    }

}