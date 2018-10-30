from db import db

def ModelClass(classname):
    table = {
        'id': db.Column(db.Integer, primary_key=True),
        'd_id': db.Column(db.Integer, db.ForeignKey('devices.id')),
        'value': db.Column(db.Text),
        'timestamp': db.Column(db.DateTime),
        '__bind_key__': 'backend'
    }

    return type(classname, (db.Model,), table)