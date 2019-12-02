import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Analytics.app import create_app
import sqlalchemy

""" Initialize Database Command """

app = create_app()

db_uri = '%s://%s:%s@%s/%s' % (
    app.config['db_psql_base_uri'], app.config['db_username'],
    app.config['db_password'], app.config['db_host'], app.config['db_name'])
engine = sqlalchemy.create_engine(db_uri)
conn = engine.connect()
conn.execute("commit")
conn.execute("insert into operation values (1, 'regression', now());")
conn.execute("insert into operation values (2, 'classification', now());")
conn.execute("insert into operation values (3, 'clustering', now());")
conn.close()
