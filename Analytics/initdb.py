import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Analytics.app import create_app
import sqlalchemy

app = create_app()
db_uri = '%s://%s:%s@%s/' % (
    app.config["'db_psql_base_uri"], app.config['db_username'],
    app.config['db_password'], app.config['db_host'])
engine = sqlalchemy.create_engine(db_uri)
conn = engine.connect()
conn.execute("commit")
databases = engine.execute('show databases;')
for d in databases:
    if d[0] == app.config['db_name']:
        conn.execute("drop database " + app.config['db_name'])
conn.execute("create database " + app.config['db_name'])
conn.close()
