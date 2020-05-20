docker build -t ec2-app .
docker images 
docker tag  soungdo0919/ec2-app:latest
docker login
docker push soungdo0919/ec2-app:latest
