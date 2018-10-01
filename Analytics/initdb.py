import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Analytics.app import create_app
import sqlalchemy

sql = 'mysql+pymysql'
psql = 'postgresql+psycopg2'
app = create_app()
db_uri = '%s://%s:%s@%s/' % (psql, app.config['DB_USERNAME'], app.config['DB_PASSWORD'], app.config['DB_HOST'])
engine = sqlalchemy.create_engine(db_uri)
conn = engine.connect()
conn.execute("commit")
databases = engine.execute('show databases;')
for d in databases:
    if d[0] == app.config['DATABASE_NAME']:
        conn.execute("drop database "  + app.config['DATABASE_NAME'])
conn.execute("create database "  + app.config['DATABASE_NAME'])
conn.close()