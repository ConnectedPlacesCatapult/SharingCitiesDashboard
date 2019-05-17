from db import db


def ModelClass(tablename) -> db.Model:
    """
    Decoratively define the schema for an attribute data table and extend
    if the table exists.
    """
    table = {
        's_id': db.Column(db.Text, primary_key=True),
        'value': db.Column(db.Text, primary_key=True),
        'api_timestamp': db.Column(db.DateTime, primary_key=True),
        'timestamp': db.Column(db.DateTime),
        '__table_args__': {'extend_existing': True}
    }
    return type(tablename, (db.Model,), table)
