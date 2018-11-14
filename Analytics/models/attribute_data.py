from db import db

def ModelClass(tablename):
    table = {
        'id': db.Column(db.Integer, primary_key=True, autoincrement=True),
        's_id': db.Column(db.Text),
        'value': db.Column(db.Text),
        'timestamp': db.Column(db.DateTime)
    }

    return type(tablename, (db.Model,), table)