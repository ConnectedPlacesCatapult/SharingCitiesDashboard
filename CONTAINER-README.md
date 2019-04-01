## Containerised Application
### Getting Things Up and Running

Currently the system is running by having each component, Database, REST Api and the Node Frontend Application run on one system or virtual env. Below we discuss how to get the system running using 3 Docker containers for each of the components and a Docker compose file to run the multiple containers as one application.

The 3 containers are used as services in the Docker compose file and the services will be run as one application, in this case the Sharing Cities Application.

### Running the Application
#### Pre-requisites

The following components are needed to run the application:

- [Docker Engine](https://docs.docker.com/install/) 
- [Docker Compose](https://docs.docker.com/compose/install/)

The following configuration files need to be edited:

- Frontend; ```SharingCitiesDashboard/Frontend/src/api/urls.js```, update the value "LOCAL_URL" with the **API address and port**:
```javascript
export const LOCAL_URL = 'http://<api_address>:<api_port>'
```
- Frontend; ```SharingCitiesDashboard/Frontend/fcc.config.js```, update the value "apiRoot" with the **API address and port**:
```javascript
apiRoot: "http://<api_address>:<api_port>/"
```
- API; ```SharingCitiesDashboard/Analytics/settings.py```, update the database parameters as below:
```python
DB_USERNAME = '<db_user>'
DB_PASSWORD = '<db_password>'
DATABASE_NAME = '<db_name>'
DB_HOST = 'db'
```
For the ```DB_HOST``` above we can use '**db**' as this is defined in the docker-compose.yaml file

- Database; ```SharingCitiesDashboard/Dockerfile-DB```, update the ENV variables as below, replacing the db_x values:
```dockerfile
ENV POSTGRES_USER db_user
ENV POSTGRES_PASSWORD db_password
ENV POSTGRES_DB db_name
```

- Database; ```SharingCitiesDashboard/initdb-postgis.sh```, update the "dbname" parameter below with the actual database name:
```bash
"${psql[@]}" --dbname=<db_name> <<-'EOSQL'
```
#### Deployment

As explained above, Docker files were used thus a working Docker instance is needed to run the containers and subsequently the application. The following steps/commands are needed are needed to deploy the application:

In the terminal/command-line interface, with the folder set to the root of the application, type in:

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


