# FCC Deployment README
This document provides generic instructions on deploying the FCC software on a single machine.

**All commands are Ubuntu specific, but should be easily adaptable to whichever platform you are using (MacOS/Windows/Linux).**

## Get the code
### Clone the repository from Github
```
$ cd && git clone https://github.com/FutureCitiesCatapult/SharingCitiesDashboard
```

## Deploy the components
### Postgres Database
TThe Postgres DB needs to be installed and initialised.
There are two ways to do this, using an Ubuntu specific script or running the commands manually:
#### Option 1. Run the setub_db script
```
$ ~/SharingCitiesDashboard/Analytics/setup_db.sh
```
#### You’ll be prompted for the SuperUser credentials
```
Fullname:
Email:
Password:
```
#### Option 2. Run the commands manually:
##### Check if postgres is installed
```
$ which psql
```
##### If nothing is returned, install postgres
```
$ sudo apt update
$ sudo apt install postgresql postgresql-contrib
$ sudo apt-get install postgis
```
##### Create SharingCities DB user
```
$ sudo -u postgres psql -c "CREATE USER sharingcities WITH PASSWORD 'sharingcities'"
```
##### Create analytics DB
```
$ sudo -u postgres psql -c "CREATE DATABASE analytics"
```
##### Grant privileges to SharingCities user
```
$ sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE analytics to sharingcities"
```
##### Create postgis extension
```
$ sudo -u postgres psql -d analytics -c "CREATE EXTENSION postgis"
```
##### Move to Analytics directory
```
$ cd ~/SharingCitiesDashboard/Analytics
```
##### Install python requirements
```
$ pip3 install -r requirements.txt
```
##### Setup DB structure
```
$ python3 db_setup.py
```
##### Create SuperUser account
```
$ python3 manage.py add_superuser
```
##### You’ll be prompted for the SuperUser credentials
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

<br><br><br>
## Components Screen Sessions
There are screen sessions setup and running for each component:
### Connect to Node UI screen
```
$ screen -r UI
```
### Connect to Flask API screen
```
$ screen -r API
```


## Screen 101
### Start a new screen session
```
$ screen -S <name>
```
### Detach from a screen session
`[Ctrl]+[A]+[D]`
### Resume a screen session
```
$ screen -r
```
### List screen sessions
```
$ screen -ls
```
