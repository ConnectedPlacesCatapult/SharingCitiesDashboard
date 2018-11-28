from db import db

sensor_attribute = db.Table('sensor_attribute',
                            db.Column('s_id', db.Integer, db.ForeignKey('sensor.id'), primary_key=True),
                            db.Column('a_id', db.Integer, db.ForeignKey('attributes.id'), primary_key=True)
                            )

# attribute_sub_theme = db.Table('attribute_subtheme',
#                                 db.Column('st_id', db.Integer, db.ForeignKey('subtheme.id'), primary_key=True),
#                                 db.Column('a_id', db.Integer, db.ForeignKey('attributes.id'), primary_key=True)
#                                 )
