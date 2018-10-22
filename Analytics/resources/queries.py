

class Queries(object):
    def __init__(self):
        self.ALL_TABLES = "SELECT * FROM pg_catalog.pg_tables WHERE tablename = '%s';"
        self.TABLE_COLUMN = "SELECT column_name FROM information_schema.columns WHERE table_schema = '%s' AND table_name = '%s';"

    @classmethod
    def query(self, cols, tablename, limit=1000):
        q = 'SELECT '
        for c in cols:
            q += (c + ',')
        q = q[:-1]
        q += ' FROM %s LIMIT %d;'

        return q % (tablename, limit)

