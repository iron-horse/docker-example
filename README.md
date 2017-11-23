## Requirements:

You’ve been asked to spin up an API with a microservices architecture that will serve up the following architecture:
Backend: Node.js with express or koa
Database: MongoDB
Containerization: Docker

Please provide a backend API, containerized to docker, to provide the following functionality:

POST requests to /orgs/<org-name>/comments should allow the user to persist comments (in a MongoDB collection) against a given github organization. 

For example, the following request should save a comment against the Google org:

POST /orgs/google/comments/
Content-Type: application/json

{ 
	"comment": "Creating Toronto a future city!"
}


GET requests to /orgs/<org-name>/comments/ should return an array of all the comments that have been registered against the organization. 

GET requests to /orgs/<org-name>/members/ should return an array of members of an organization (with their login, avatar url, the numbers of followers they have, and the number of people they’re following), sorted in descending order by the number of followers. 

DELETE requests to /orgs/<org-name>/ should delete all database records associated with a particular organization, including comments.

The two endpoints above /comments, and /members, should be deployed using a microservices architecture pattern to separate node.js servers, on separate docker containers which are orchestrated using Kubernetes or a similar tool. 


# Run Solution on your machine,

1. First Clone the repository.
2. Create `.env` file from `.env.example` in `comments` and `members` folders accordingly.
3. Make appropriate changes to `.env` files base on your environment, you will need to provide GITHUB Personal Token so if you don't have it already please create one, please visit [this](https://github.com/blog/1509-personal-api-tokens) link if you don't know how to create one.

Now lets create Docker Containers for all microservices, ( for now did not push images to cloud, after creating container you can push to cloud so you dont have to create on all machine )

1. go to `fronted` folder and run  `docker build -t frontend .`
2. go to `comments` folder and run `docker build -t comments .`
3. go to `members` folder and run `docker build -t members .`

Now lets run all microservices with docker swarm,

1. Go to directory `docker-example`
2. Make your machine as master node in swarm mode (i.e clustor mode), by `docker swarm init`
3. Deploy the stack of services by `docker stack deploy -c docker-composer.yml dkr_example`
4. Check if all services is up or not by `docker service ls`
5. If all services are up you can visit http://localhost

To Stop all services and leave swarm mode,

1. Stop the stack of services we created by, `docker stack rm dkr_example`
2. Leave swarm mode by, `docker swarm leave --force`

