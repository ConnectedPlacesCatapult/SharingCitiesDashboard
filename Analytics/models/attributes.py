from db import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError

class Attributes(db.Model):
    __tablename__ = 'attributes'
    # __bind_key__ = 'backend'

    id = db.Column(db.Text, unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False, primary_key=True)
    table_name = db.Column(db.String(255), nullable=False)
    sub_theme_id = db.Column(db.Integer, db.ForeignKey('subtheme.id'), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False, primary_key=True)
    unit_value = db.Column(db.Text, nullable=False, primary_key=True)
    description = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime)

    def __init__(self, id, name, table_name, sub_theme, unit, description='No Description', unit_value='1', timestamp=None):
        if unit_value is None:
            unit_value = 1

        if unit is None:
            unit = 1

        if sub_theme is None:
            sub_theme = 1

        if description is None:
            description = 'No Description'

        self.id = id
        self.name = name
        self.table_name = table_name
        self.sub_theme_id = sub_theme
        self.unit_id = unit
        self.unit_value = unit_value
        self.description = description

        if timestamp is None:
            timestamp = datetime.utcnow()

        self.timestamp = timestamp

    def __repr__(self):
        return 'Name: %s, Table Name: %s' % (self.name, self.table_name)

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'table_name': self.table_name,
            'Sub Theme id': self.sub_theme_id,
            'Unit': self.unit_id,
            'Unit Value': self.unit_value,
            'Description': self.description,
            'timestamp': self.timestamp
        }

    def save(self):
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self.name, 'attribute with Unit ID:', str(self.unit_id), 'and Unit Value:', self.unit_value, 'already exists')
            return self.get_by_name_unit_unitvalue()
        return self

    def commit(self):
        db.session.commit()

    def get_by_name_unit_unitvalue(self):
        return Attributes.query.filter_by(name=self.name).filter_by(unit_id=self.unit_id).filter_by(unit_value=str(self.unit_value)).first()

    @classmethod
    def get_by_name(cls, name):
        return Attributes.query.filter_by(name=name).first()

    @classmethod
    def get_all(cls):
        return Attributes.query.all()