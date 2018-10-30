from db import db

devicetype_device = db.Table('devicetype_device',
                    db.Column('dt_id', db.Integer, db.ForeignKey('devicetype.id'), primary_key=True),
                    db.Column('d_id', db.Integer, db.ForeignKey('devices.id'), primary_key=True),
                    info={'bind_key': 'backend'}
                    )

devicetype_attribute = db.Table('devicetype_attribute',
                                db.Column('dt_id', db.Integer, db.ForeignKey('devicetype.id'), primary_key=True),
                                db.Column('a_id', db.Integer, db.ForeignKey('attributes.id'), primary_key=True),
                                info={'bind_key': 'backend'}
                                )
