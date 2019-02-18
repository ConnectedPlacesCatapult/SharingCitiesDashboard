from db import db
from sqlalchemy.dialects.postgresql import JSON
import json


class WidgetModel(db.Model):
    _WIDGET_DB_TABLE_NAME = 'widgets'

    __tablename__ = _WIDGET_DB_TABLE_NAME


    id = db.Column('id', db.Integer, primary_key=True)
    user_id = db.Column('user_id', db.Integer, nullable=False)
    title = db.Column('title', db.String, nullable=False)
    type = db.Column('type', db.String, nullable=False)
    tile_layer = db.Column('tile_layer', db.String, nullable=True)
    is_heat_map = db.Column('is_heat_map', db.Boolean, nullable=True)

    spec = db.Column('spec', JSON, nullable=False)
    data = db.Column('data', JSON, nullable=False)

    def __init__(self, user_id, title, type, spec, data, tile_layer=None, is_heat_map = None ):
        self.user_id = user_id
        self.title = title
        self.type = type
        self.spec = spec
        self.data = data
        self.tile_layer = tile_layer
        self.is_heat_map = is_heat_map

        # Check if tables exsists
        self.create_table();

    def __str__(self):
        return """"user_id:\t{}\n
        Title:\t{}\n
        titleLayer:\t{}\n
        isHeatMap\t{}\n
        type:\t{}\n
        spec:\t{}\n
        data:\t{}\n""".format(self.user_id, self.title, self.tile_layer,
                              self.is_heat_map, self.type, self.spec, self.data)

    def json(self):
        response_data = {'id': str(self.id), 'title': self.title, 'type': self.type,
                         'data': self.data}

        if self.spec:
            response_data["spec"] = self.spec

        if self.tile_layer:
            response_data["titleLayer"] = self.tile_layer

        if self.is_heat_map:
            response_data["isHeatMap"] = self.is_heat_map

        return response_data

    def create_table(self):
        if not self.table_exists():  # If table don't exist, Create.
            # Create a table with the appropriate Columns
            db.Table(self._WIDGET_DB_TABLE_NAME, db.MetaData(bind=db.engine),
                     db.Column('id', db.Integer, primary_key=True),
                     db.Column('user_id', db.Integer, nullable=False),
                     db.Column('title', db.String, nullable=False),
                     db.Column('type', db.String, nullable=False),
                     db.Column('tile_layer', db.String, nullable=True),
                     db.Column('is_heat_map', db.Boolean, nullable=True),
                     db.Column('spec', JSON, nullable=False),
                     db.Column('data', JSON, nullable=False),
                     schema=None).create()


    def table_exists(self):
        has_table = db.engine.dialect.has_table(db.engine, self._WIDGET_DB_TABLE_NAME)
        print('Table "{}" exists: {}'.format(self._WIDGET_DB_TABLE_NAME, has_table))
        return has_table


if __name__ == '__main__':
    pass
