# Importers and Scheduler

## Importers

### What are Importers
Importers are a way to get data into the database. Every API needs to have their own importer in order for Scheduler to import data automatically.

### Database Setup
Currently we don't have a way to create database tables automatically, it is a manual process.

- Create Database (Tutorial Comming soon)
- Rename the ```settings.py.bak``` to ```settings.py``` and update it with your database connection settings
- Then navigate to the Analytics folder and go to the python shell  
```
#Setup database tables
from app import create_app
a = create_app()
```
The code above is all you need to run in order to setup database tables.
- Make sure you populate the Unit, Theme, SubTheme tables in order for importers to run as they make use of values from these tables. There are two ways to do it, then can be directly populated in the table using insert statement or they can be put into system using python model classes by navigating to Analytics folder and open python shell 
```
# Using Model classes to add data to tables
from app import create_app
a = create_app()
from db import db

# Creating Unit
from models.unit import Unit
unit = Unit('kg', 'Kilogram')
unit.save()

# Creating Theme and SubTheme
from models.theme import Theme, SubTheme
theme = Theme('Environment)
theme.save()

# Using Theme id as foreign key in SubTheme
s_theme = SubTheme(theme.id, 'Airquality')
s_theme.save()

db.session.commit()
```

As you can see from the example the api is consistent across models and have the same names for saving and retrieving data.

### How to run importers

Rename the ```config.yml.example``` to ```config.yml``` in importers folder. Make sure you put the keys relevant to the API.

There are two ways to run an importer
- Use of add_datasource.py file
    - This file can be run from command line 
    ```python manage.py add -gd True```
    would return a list of importers that can be imported from the command line. ```python manage.py add -ad <Name-of-the-datasource>``` would add run the importer and add the datasource to the database. It will not override the previous data but append it, if the data already exists then it will ignore it.
- Using python shell to add the datasource/run importer
    - Navigate to the Analytics folder and enter into python shell by typing ```python```  
    ```
    # Example of importing a datasource
    from app import create_app
    a = create_app()
    from importers.air_quality import KCLAirQuality
    k = KCLAirQuality()
    k._create_datasource()
    ```
    Code provided above is generic to all importers, API is designed with keeping consistency in mind to run importers.

## Scheduler

### What is Scheduler
It is responsible to get the data periodically from the API's using Importers.

Scheduler makes use of ```config.yml``` file to retrieve data about importer classes and as every importer follows the same structure it initialises classes at runtime and calls their ```_create_datasource()``` method.

For every importer, scheduler initiates a process and then goes to sleep for 24 hours, those subprocess in turn are responsible for running the importers and once and importer has run, the process goes to sleep for the specific time mentioned in the ```config.yml``` file under property ```refresh_time```. If the sub-process gets killed by the OS or gets terminated for some reason then once the main process wakes up after 24 hours would reinitiate the subprocess and if the subprocess already exists then it won't reinitiate it.

However, if the main process gets terminated then it needs to started manually again.

Every subprocess creates log file under their respective folder, e.g for Air quality importer there will be a separate folder containing its log files and a new log file gets created at 12 am every day for every importer.