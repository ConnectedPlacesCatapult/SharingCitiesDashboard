## Containerised Application
### Getting Things Up and Running

Currently the system is running by having each component, Database, REST Api and the Node Frontend Application run on one system or virtual env. Below we discuss how to get the system running using 3 Docker containers for each of the components and a Docker compose file to run the multiple containers as one application.

The 3 containers are used as services in the Docker compose file and the services will be run as one application, in this case the Sharing Cities Application.

### Running the Application
#### Pre-requisites

The following components are needed to run the application:

- [Docker Engine](https://docs.docker.com/install/) 
- [Docker Compose](https://docs.docker.com/compose/install/)
- **Config File** (/Analytics/settings/config.env.yml)

The ```config.env.yml``` configuration file, located in ```/Analytics/settings/```, will need to be edited with the settings for the 3 services as below:

- **UI**; Edit the configuration parameters below with their respective values for the dev port, the host and the environment. For the ```NODE_API_PORT``` the value should be as below:
```yaml
NODE_ENV: <environment> e.g. development
NODE_HOST: <host> e.g. http://localhost
NODE_API_PORT: :8000
NODE_DEV_PORT: :<dev-port> e.g. 8080
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
#### Deployment

As explained above, Docker files were used thus a working Docker instance is needed to run the containers and subsequently the application. The following steps/commands are needed are needed to deploy the application:

In the terminal/command-line interface, with the folder set to ```/deployment/docker/```, type in:

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


