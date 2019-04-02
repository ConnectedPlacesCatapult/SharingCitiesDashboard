import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from gunicornserver import GunicornServer

from flask_script import Manager, Server
from flask_migrate import MigrateCommand
from app import create_app
from drop_datasource import DropDatasource
from add_datasource import AddDatasource
from create_celery import make_celery
from add_startup_admin import AddStartupAdmin


application = create_app()
celery_task = make_celery(application)
manager = Manager(app=application)
manager.add_command('db', MigrateCommand)

manager.add_command('runserver', Server(
    use_debugger=False,
    use_reloader=True,
    host='<host-value>'
))

manager.add_command("gunicorn", GunicornServer())

manager.add_command('remove', DropDatasource)
manager.add_command('add', AddDatasource)
manager.add_command('add_superuser', AddStartupAdmin)

if __name__ == '__main__':
    manager.run()
