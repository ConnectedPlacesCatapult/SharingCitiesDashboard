# Deployment 

The current repo contains instructions for two deployment options: [ubuntu](https://github.com/FutureCitiesCatapult/SharingCitiesDashboard/tree/dev/deployment/ubuntu) and [Kubernetes](https://github.com/FutureCitiesCatapult/SharingCitiesDashboard/tree/dev/deployment/kubernetes). We also offer a containerised version of the application.

## Table of Contents:

* [Ubuntu](#ubuntu)
* [Containerised Application](#containerised-application)
* [Kubernetes](#Kubernetes)

---

# Ubuntu
We assume that you can connect to the ubuntu instance via SSH and you already have the SSH key file: 

```
$ ssh -i <key_file> <user>@<ip-address>
```
## Get the code
### Clone the repository from Github
```
$ cd && git clone https://github.com/FutureCitiesCatapult/SharingCitiesDashboard
```
### Checkout the EC2 branch
```
$ cd ~/SharingCitiesDashboard && git checkout ubuntu-ready-deployment
```

## Deploy the components
### Postgres Database
The Postgres DB needs to be installed and initialised:
#### Run the setub_db script
```
$ ~/SharingCitiesDashboard/Analytics/setup_db.sh
```

#### You’ll be prompted for the SuperUser credentials
```
Fullname:
Email:
Password:
```
### Node UI
The Frontend/UI is written in React JS and is built and served with Node Package Manager:
#### Check if Node is installed
```
$ npm -v
```
#### Install Node if not installed
```
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
$ sudo apt install nodejs
```
#### Make sure you're in the correct directory
```
$ cd ~/SharingCitiesDashboard/Frontend
```
#### Install all dependencies
```
$ npm i --save
```
#### Update the value in `SharingCitiesDashboard/Frontend/src/api/urls.js`
`export const LOCAL_URL = ‘http://<api-address>/’`
<br>
**TO**
<br>
`export const LOCAL_URL = ‘http://<ip-address>/api/’`
#### Change the value in `SharingCitiesDashboard/fcc.config.js`
`apiRoot: "http://<api-address>/",`
<br>
**TO**
<br>
`apiRoot: "http://<ip-address>/api/",`
#### Set node environment mode to Production
```
$ npm run build
```
#### Install serve package
```
$ sudo npm install -g serve
```
#### Serve the UI on port 8080
```
$ sudo serve -s build -l 8080
```
**The UI can then be accessed at: <http://localhost:8080/>**
<br>
**NB:** The `URL` that points to the `API` has to be set in the following files:
- `SharingCitiesDashboard/Frontend/src/api/urls.js`
- `SharingCitiesDashboard/Frontend/fcc.config.js`

### Flask API
The Backend/API is written in Flask and is run/served using Gunicorn:
Make sure you're in the correct directory
```
$ cd ~/SharingCitiesDashboard/Analytics
```
#### Install the requirements
```
$ pip3 install -r requirements.txt
```
#### Rename `settings.py.bak` to `settings.py`
```
$ mv settings.py.bak settings.py
```
#### Update values in `settings.py`
```
DB_USERNAME = 'sharingcities'
DB_PASSWORD = 'sharingcities'
DATABASE_NAME = 'test_analytics'
DB_HOST = 'localhost'
```
#### Change values in `manage.py`
`host='<host-value>'`
<br>
**TO**
<br>
`host='0.0.0.0'`
#### Change values in `gunicornserver.py`
`def __init__(self, host='<host-value>', port=5000, workers=4):`
<br>
**TO**
<br>
`def __init__(self, host='localhost', port=5000, workers=4):`
#### Start serving with Gunicorn
```
$ python3 manage.py gunicorn
```
**The API can then be accessed at: <http://localhost:5000/>**
<br>
**NB:** The `URL` and `PORT` can be set inside the `gunicornserver.py` file

### Nginx
We use Nginx to proxy the components to the web and each other:
#### Make sure you're in the correct directory
```
$ cd
```
#### Install Nginx
```
$ sudo apt install nginx
```
#### Allow Nginx profile in firewall
```
$ sudo ufw allow 'Nginx HTTP'
```
#### Copy correct Nginx config file
```
$ sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bkup
$ sudo cp ~/SharingCitiesDashboard/nginx.conf /etc/nginx/nginx.conf
```
#### Check if Nginx is running
```
$ systemctl status nginx | grep active
```
#### If you see `active (running)`
```
$ sudo systemctl reload nginx
```
#### If you see `inactive (dead)`
```
$ sudo systemctl start nginx
```
**The UI can then be accessed at: `http://<ip-address>`**
<br>
**The API can then be accessed at: `http://<ip-address>/api`**
<br>
**NB:** The `URL` and `PORT` for the `proxy_pass` addresses can be set inside the `/etc/nginx/nginx.conf` file


### Components Screen Sessions
There are screen sessions setup and running for each component:
#### Connect to Node UI screen
```
$ screen -r UI
```
#### Connect to Flask API screen
```
$ screen -r API
```


### Screen 101
#### Start a new screen session
```
$ screen -S <name>
```
#### Detach from a screen session
`[Ctrl]+[A]+[D]`
#### Resume a screen session
```
$ screen -r
```
#### List screen sessions
```
$ screen -ls
```

---

## Containerised Application
### Getting Things Up and Running

Currently the system is running by having each component, Database, REST Api and the Node Frontend Application run on one system or virtual env. Below we discuss how to get the system running using 3 Docker containers for each of the components and a Docker compose file to run the multiple containers as one application.

The 3 containers are used as services in the Docker compose file and the services will be run as one application, in this case the Sharing Cities Application.

### Running the Application
#### Pre-requisites

The following components are needed to run the application:

- [Docker Engine](https://docs.docker.com/install/) 
- [Docker Compose](https://docs.docker.com/compose/install/)
- Config File (/Analytics/settings/config.env.yml)

The ```config.env.yml``` configuration file, located in ```/Analytics/settings/```, will need to be edited with the settings for the 3 services. If the file is not in the directory, copy a sample of the file into the directory. Edit the parameters as below:

- **API**; Edit the configuration parameters below for the API flask server and gunicorn server with the values as below:
```yaml
flask_server:
  host: api
  port: 5000
  processes: 1
gunicorn_server:
  gunicorn_host: api
  gunicorn_port: 5000
  gunicorn_workers: 4
```
- **API** & **Database**; Edit the configuration parameters for the Database creation and connection below with their respective values. For the ```db_host``` the correct host should be ```db``` as below. The rest should be entered as per design:
```yaml
postgres:
  SECRET_KEY: <secret-key>
  db_host: db
  db_name: <db-name>
  db_password: <db-password>
  db_username: <db-username>
```
- **UI**; Edit the configuration parameters below with their respective values for the dev port, the host and the environment. For the ```NODE_API_PORT``` the value should be as below:
```yaml
NODE_ENV: <environment> e.g. development
NODE_HOST: <host> e.g. http://localhost
NODE_API_PORT: :8000
NODE_DEV_PORT: :<dev-port> e.g. 8080
```
#### Deployment

As explained above, Docker files were used thus a working Docker instance is needed to run the containers and subsequently the application. The following steps/commands are needed are needed to deploy the application:

In the terminal/command-line interface go to the docker folder; ```$ cd ~/SharingCitiesDashboard/deployment/docker/```. With the folder set to ```/SharingCitiesDashboard/deployment/docker/```, type in:

```bash
docker-compose build
```

The command above builds the project i.e. it will create the respective container images with their base OS's and required dependencies and software.

```bash
docker-compose up
```

The command above runs the application by running the respective application services containers. 

Once the command executes successfully, an output message is displayed as below:

```bash
db_1   | 2019-04-01 09:58:54.628 UTC [1] LOG:  listening on IPv4 address "some_IP", port 5432
db_1   | 2019-04-01 09:58:54.628 UTC [1] LOG:  listening on IPv6 address "::", port 5432
db_1   | 2019-04-01 09:58:54.635 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
db_1   | 2019-04-01 09:58:54.650 UTC [18] LOG:  database system was shut down at 2019-04-01 08:48:14 UTC
db_1   | 2019-04-01 09:58:54.656 UTC [1] LOG:  database system is ready to accept connections
ui_1   | INFO: Accepting connections at <ui_url>:8080
api_1  | INFO:create_celery:Celery configurations: BROKER_URL= redis://localhost:6379/0 RESULT_BANKEND = redis://localhost:6379/0 
api_1  | [2019-04-01 09:58:59 +0000] [1] [INFO] Starting gunicorn 19.9.0
api_1  | [2019-04-01 09:58:59 +0000] [1] [INFO] Listening at: <api_server_url>
api_1  | [2019-04-01 09:58:59 +0000] [1] [INFO] Using worker: sync
api_1  | [2019-04-01 09:58:59 +0000] [10] [INFO] Booting worker with pid: 1
api_1  | [2019-04-01 09:58:59 +0000] [11] [INFO] Booting worker with pid: 2
api_1  | [2019-04-01 09:58:59 +0000] [12] [INFO] Booting worker with pid: 3
api_1  | [2019-04-01 09:58:59 +0000] [13] [INFO] Booting worker with pid: 4
```

Once running successfully, the UI can be accessed from clicking on the URL from above ```ui_1   | INFO: Accepting connections at <ui_url>:8080``` system message.

#### Getting Started
Once the containers are running, the Database needs to be initialised and a super user needs to be created.

**DB Initialisation**; Open another terminal/command-line instance and run the following command:
```bash
docker exec -it docker_api_1 python db_setup.py
```
**Super User Creation**; After running the above command, in the terminal/command-line interface run the following command:
```bash
docker exec -it docker_api_1 python manage.py add_superuser
```
After you run the code above you'll be prompted to enter details as below:
```
Fullname:
Email:
Password:
```
Enter the details and once done login to the application dashboard: http://<api-url>/8080 for example, **http://localhost:8080** and proceed to register the user and log in to use the system.

**Importers Commands**; In general to run the importers the following commands can be used:
```bash
docker exec -it docker_api_1 python manage.py -ad <importer name> 
e.g. docker exec -it docker_api_1 -ad Air_Quality_KCL
```

**Register User**; To register the user newly created, on the login page, click on the Register button at the bottom of the login page. Once that is done a user can successfully login to the Dashboard.

## Kubernetes
This document will guide you through the necessary steps and flow of deploying the SharingCities Service Layer onto kubernetes.
NB: All code snippets/examples are written specifically for a MacOS/Bash shell
but should be easily adaptable for whichever OS you are using to deploy.

NB: This document will guide you through a complete HTTP only deployment.
Setting up TLS is outside the document’s scope.

### Requirements 
You will need the following software:
* Install Google Cloud SDK:
```brew cask install google-cloud-sdk```

* Install Docker for Desktop/Mac
```brew cask install docker```

* Scripts are written for Bash so you will need to use a bash shell

* Also ensure that you are connected to the correct kubernetes cluster!

### Get the code
Clone the repository from Github:

```cd && git clone https://github.com/FutureCitiesCatapult/SharingCitiesDashboard```

Checkout the Ubuntu branch:
```cd ~/SharingCitiesDashboard && git checkout k8s-ready-deployment```

### Deploy the components
#### Setup config file
The config file will provide settings and values for the code to work. This is confidential and contains sensitive data so will need to be manually copied and pasted or synced to the machine.

Copy the file to the correct directory:
```cp ~/Downloads/config.env.yml ~/SharingCitiesDashboard/Analytics/settings/```

NB: Setup/Update the values in
```SharingCitiesDashboard/Analytics/settings/config.env.yml``` according to your needs/specifications.

#### Change to Deployment Directory
You must be in the kubernetes deployment directory
```cd ~/SharingCitiesDashboard/deployment/kubernetes```

#### Postgres Database
The Postgres DB image needs to be built and pushed, after which the kubernetes yaml file can be applied/deployed:

Run the DB build script:
```./build_db.sh```

You’ll be prompted for the DB Container details:
```bash
Enter DB Container Registry Address:
Enter DB Image Version:
```
