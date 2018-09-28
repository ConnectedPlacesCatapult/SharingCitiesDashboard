import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Analytics.app import create_app
import sqlalchemy


app = create_app()
db_uri = 'mysql+pymysql://%s:%s@%s/' % (app.config['DB_USERNAME'], app.config['DB_PASSWORD'], app.config['DB_HOST'])
engine = sqlalchemy.create_engine(db_uri)
conn = engine.connect()
conn.execute("commit")
conn.execute("use analytics;")
conn.execute("insert into operation values (1, 'regression', now());")
conn.execute("insert into operation values (2, 'classification', now());")
conn.execute("insert into operation values (3, 'clustering', now());")
conn.close()