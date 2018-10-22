import pandas as pd
import settings
from resources.queries import Queries

import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session

class AnalyticsData(object):
    def __init__(self, request):
        self._request = request
        self.conn = self.get_db_connection()

    def __del__(self):
        self.conn.close()

    def get_data(self):
        dataset = None
        if self.verify_tables() and self.verify_Y():
            print('found tables')

    def verify_tables(self):
        for table in self._request.columnsX.tables:
            result = self.query(Queries.ALL_TABLES % table.name)
            if len(result.fetchall()):
                cols = self.verify_columns(table)
                if not cols:
                    return False
            else:
                return False
        return True

    def verify_columns(self, table):
        cols = self.query(Queries.TABLE_COLUMN % ('public', table.name))
        count = 0
        for column in table.columns:
            for col in cols:
                if column.name == col[0]:
                    count += 1
                    break

        return len(table.columns) == count

    def verify_Y(self):
        result = self.query(Queries.ALL_TABLES % self._request.tableY)
        if not len(result.fetchall()):
            return False

        col = self.query(Queries.TABLE_COLUMN % ('public', self._request.tableY))
        for c in col:
            if c[0] == self._request.columnY:
                return True
        
        return False

    def get_db_connection(self):
        engine = sqlalchemy.create_engine(settings.DB_URI_BACKEND)
        sess = scoped_session(sessionmaker(bind=engine))
        return sess()

    def query(self, q):
        return self.conn.execute(q)



