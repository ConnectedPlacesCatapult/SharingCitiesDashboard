import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Analytics.app import create_app
import sqlalchemy


sql = 'mysql+pymysql'
psql = 'postgresql+psycopg2'

app = create_app()
db_uri = '%s://%s:%s@%s/%s' % (psql, app.config['DB_USERNAME'], app.config['DB_PASSWORD'], app.config['DB_HOST'], app.config['DATABASE_NAME'])
engine = sqlalchemy.create_engine(db_uri)
conn = engine.connect()
conn.execute("commit")
conn.execute("insert into operation values (1, 'regression', now());")
conn.execute("insert into operation values (2, 'classification', now());")
conn.execute("insert into operation values (3, 'clustering', now());")
conn.close()