from db import db

def ResultClass(classname):
    table = {
        'id': db.Column(db.Integer, primary_key=True),
        'prediction_timestamp': db.Column(db.DateTime, nullable=False),
        'upper_bound': db.Column(db.Float, nullable=False),
        'lower_bound': db.Column(db.Float, nullable=False),
        'prediction': db.Column(db.Float, nullable=False),
        'timestamp': db.Column(db.DateTime)
    }
    
    return type(classname, (db.Model, ), table)