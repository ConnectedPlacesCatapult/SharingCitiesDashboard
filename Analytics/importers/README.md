# Importers and Scheduler

## Getting things up and running

At present, collecting data and adding it to the application database requires the instantiation of the database, its corresponding tables and some dummy data entries. Below we discuss how to do this on Mac OS. 


## Set up the Database, Role and Credentials:
 
* Ensure that Postgres is installed and running on the machine. If you're not sure, this command can be useful: `pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start
`
* Create a user `sharingcities` for the database:`CREATE USER sharingcities WITH PASSWORD 'sharingcities';`
*  Create the database: `CREATE DATABASE test_analytics;`. _Note that the user and database names can be changed when the application is deployed. You just have to be aware that things may need to be changed accordingly in your `settings.py` file_. 
* For the new database, grant privileges: `GRANT ALL PRIVILEGES ON DATABASE "test_analytics" to sharingcities;`
* Add a postGIS extension to the databse: `psql -d test_analytics -c "CREATE EXTENSION postgis";`
* Rename the ```settings.py.bak``` to ```settings.py```.
* Update your `settings.py` with correct IP (local if running locally), Username, Password, Database name.
    

## Add database tables and data for the importers

### What are Importers?
Importers are a way to get data into the database. Every API needs to have their own importer in order for the Scheduler to import data automatically.

### Add database tables

Navigate to the Analytics folder and go to the python shell / REPL. 
  
```
#Setup database tables
from app import create_app
a = create_app()
```

The code above will setup the database tables. Next, make sure you populate the Unit, Theme, SubTheme tables. This is currently necessary for importers to run as they make use of values from these tables. 

There are two ways to do it. They can be directly populated in the table using insert statements (not recommended) or they can be entered using python model classes. To use the python model classes navigate to your Analytics folder and open the python shell / REPL:

```
# Using Model classes to add data to tables
from app import create_app
a = create_app()
from db import db

# Creating an example Unit
from models.unit import Unit
unit = Unit('kg', 'Kilogram')
unit.save()

# Creating and eaxample Theme and SubTheme
from models.theme import Theme, SubTheme
theme = Theme('Environment')
theme.save()

# Using Theme id as foreign key in SubTheme
s_theme = SubTheme(theme.id, 'Airquality')
s_theme.save()

db.session.commit()
```

As you can see from the example the API is consistent across models and has the same names for saving and retrieving data. Now that you have instantiated, set up and populated the database, we can run importers. 

### How to run importers

Rename the ```config.yml.example``` to ```config.yml``` in importers folder. Make sure you add your relevant API keys if needed.

There are two ways to run an importer

1. Use the add_datasource.py file
    - This file can be run from the command line with 
    
    ```python manage.py add -gd True```.
    
    It will return a list of importers that can be imported from the command line. Next,
    
    ```python manage.py add -ad <Name-of-the-datasource>``` 
    
  will run the importer and add the datasource to the database. It will not override the previous data but append it, if the data already exists then it will ignore it.
    
2. Using the python shell to add the datasource/run importer
    - Navigate to the Analytics folder and enter into python shell by typing ```python```  
    
    ```
    # Example of importing a datasource
    from app import create_app
    a = create_app()
    from importers.air_quality import KCLAirQuality
    k = KCLAirQuality()
    k._create_datasource()
    ```

The code provided above is generic to all importers. The API is designed with keeping consistency in mind when running importers.

## Scheduler

### What is the Scheduler?
The scheduler is responsible for getting the data periodically from the API's using Importers.

The Scheduler makes use of ```config.yml``` file to retrieve data about importer classes and as every importer follows the same structure it initialises classes at runtime and calls their ```_create_datasource()``` method.

For every importer, the Scheduler initiates a process and then goes to sleep for 24 hours, those subprocess in turn are responsible for running the importers and once and importer has run, the process goes to sleep for the specific time mentioned in the ```config.yml``` file under property ```refresh_time```. If the sub-process gets killed by the OS or gets terminated for some reason then once the main process wakes up after 24 hours would reinitiate the subprocess and if the subprocess already exists then it won't reinitiate it.

However, if the main process gets terminated then it needs to started manually again.

Every subprocess creates log file under their respective folder, e.g for Air quality importer there will be a separate folder containing its log files and a new log file gets created at 12 am every day for every importer.