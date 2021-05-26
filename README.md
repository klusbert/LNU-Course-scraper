# Installation


### Dependensies
To install dependensies you need first have node installed on your computer.
Then change directory to this root folder and type 

     npm i
     
### Enviroment variables.
Create a enviroment file called ".env" in the root folder.
Add this 
    
    MONGO_DATABASE_NAME="courses"
    CONNECTION_STRING1="mongodb://127.0.0.1:27017/"

To test this application you can create a docker instance of Mongo using the docker file.


### Docker for developing
Docker is great to use when developing applications depended on other types of servers.
You will need to have docker installed and also docker-compose

Start mongo and mongoexpress by typing:

    docker-compose up -d. 

### Run the application
    npm start
