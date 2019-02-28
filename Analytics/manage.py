import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask_script import Manager, Server
from flask_migrate import MigrateCommand
from app import create_app
from drop_datasource import DropDatasource
from add_datasource import AddDatasource

application = create_app()
manager = Manager(app=application)
manager.add_command('db', MigrateCommand)

manager.add_command('runserver', Server(
    use_debugger=True,
    use_reloader=True,
    host='0.0.0.0',
    port=5000
))

manager.add_command('remove', DropDatasource)
manager.add_command('add', AddDatasource)

if __name__ == '__main__':
    manager.run()
