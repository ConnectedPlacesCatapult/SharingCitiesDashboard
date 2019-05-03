import logging
from datetime import datetime

from sqlalchemy import desc, func
from sqlalchemy.exc import IntegrityError, DataError
from sqlalchemy.sql.expression import cast
from sqlalchemy import Float, desc, asc
from typing import Union

from db import db
from models.attribute_data import ModelClass

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class Attributes(db.Model):
    """
    Data class for storing information about Attributes
    """
    __tablename__ = 'attributes'

    id = db.Column(db.Text, unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False, primary_key=True)
    table_name = db.Column(db.String(255), nullable=False)
    sub_theme_id = db.Column(db.Integer, db.ForeignKey('subtheme.id'), nullable=False)
    sub_theme = db.relationship("SubTheme")
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False, primary_key=True)
    unit_value = db.Column(db.Text, nullable=False, primary_key=True)
    description = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime)

    def __init__(self, id: str, name: str, table_name: str, sub_theme: int, unit: int,
                 description: str = 'No Description', unit_value: str = '1',
                 timestamp: datetime = None):
        """ Set default values for values that are not parsed"""
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

    def __repr__(self) -> str:
        return 'Name: %s, Table Name: %s' % (self.name, self.table_name)

    @property
    def serializable(self) -> dict:
        """
        Create Serializable data of Model, Remove Duplicate Data to reduce ThemeTree size
        :return: JSON Serializable data for theme tree
        """
        return {
            'id': self.id,
            'sub_theme_id': self.sub_theme_id,
            'name': self.name,
            'table_name': self.table_name,
            'Unit': self.unit_id,
            'Unit Value': self.unit_value,
            'Description': self.description
        }

    def json(self) -> dict:
        """
        Create JSON format of Attributes data
        :return:    JSON of Attributes data
        """
        return {
            'id': self.id,
            'name': self.name,
            'table_name': self.table_name,
            'Sub Theme id': self.sub_theme_id,
            'Unit': self.unit_id,
            'Unit Value': self.unit_value,
            'Description': self.description
        }

    def save(self) -> db.Model:
        """ Persist Attribute to database"""
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            print(self.name, 'attribute with Unit ID:', str(self.unit_id), 'and Unit Value:', self.unit_value,
                  'already exists')
            return self.get_by_name_unit_unitvalue()
        return self

    def delete(self) -> None:
        """put object in queue for deletion from database"""
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(self.name, 'attribute does not exists')

    def commit(self) -> None:
        """ Commit changes to database"""
        db.session.commit()

    def get_by_name_unit_unitvalue(self) -> db.Model:
        """
        Fetch Attributes by name, unit_id and unit_value
        :return:    Attribute with the name, unit and unit_value parsed
        """
        return Attributes.query.filter_by(name=self.name).filter_by(unit_id=self.unit_id).filter_by(
            unit_value=str(self.unit_value)).first()

    @classmethod
    def get_by_name(cls, name: str) -> [db.Model]:
        """
        Get Attribute by name
        :return:    Attributes with the name parsed
        """
        return Attributes.query.filter_by(name=name).all()

    @classmethod
    def get_by_name_in(cls, names: [str]) -> [db.Model]:
        """
        Fetch Attributes with name in List of names
        :return:    Attributes with the names parsed
        """
        return db.session.query(Attributes).filter(Attributes.name.in_((names))).all()

    @classmethod
    def get_by_id_in(cls, ids: [str]) -> [db.Model]:
        """
        Fetch Attributes with id in List of ids
        :return:    Attributes an id in the parsed ids
        """
        return db.session.query(Attributes).filter(Attributes.id.in_((ids))).all()

    @classmethod
    def get_all(cls) -> [db.Model]:
        """
        Fetch all Attributes
        :return: All persisted Attributes
        """
        return Attributes.query.all()

    @classmethod
    def get_by_sub_theme_id(cls, sub_theme_id: int) -> [db.Model]:
        """
        Fetch Attributes by SubTheme id
        :return:    All Attributes with the SubTheme id parsed
        """
        return Attributes.query.filter_by(sub_theme_id=sub_theme_id).all()

    @classmethod
    def _get_by_name_unit_unitvalue(cls, name: str, unit_id: int, unit_value: str) -> db.Model:
        """
        Fetch Attributes by Name, Unit and Value
        :return:    Attribute with the name, unit and unit_value parsed
        """
        return Attributes.query.filter_by(name=name).filter_by(unit_id=unit_id).filter_by(
            unit_value=str(unit_value)).first()

    @classmethod
    def get_by_id(cls, attribute_id: str) -> db.Model:
        """
        Fetch Attribute by id
        :return:    Attribute with id parsed
        """
        return Attributes.query.filter_by(id=attribute_id).first()

    @classmethod
    def most_recent_timestamp(cls, attribute_table: str) -> Union[datetime,
                                                                  None]:
        """
        Return the most recent timestamp value from attribute_table
        :param attribute_table: name of attribute data table
        :return: most recent timestamp present in table
        """

        attribute_data_model = ModelClass(attribute_table.lower())
        most_recent_entry = db.session.query(attribute_data_model).order_by(
            desc(attribute_data_model.api_timestamp)).first()
        db.metadata.clear()

        if most_recent_entry:
            return most_recent_entry.api_timestamp
        else:
            return None

    @classmethod
    def attribute_max(cls, attribute_table: str) -> (Union[db.Model, None]):
        """
        Retrieve the maximum value of an attribute
        :param attribute_table: name of attribute data table
        :return: maximum attribute value
        """

        attribute_data_model = ModelClass(attribute_table.lower())
        attr_max = None
        try:
            attr_max = db.session.query(
                attribute_data_model).order_by(
                desc(cast(attribute_data_model.value, Float))).order_by(
                asc(attribute_data_model.timestamp)).first()

        except DataError:
            db.session.rollback()

        db.metadata.clear()
        return attr_max

    @classmethod
    def attribute_min(cls, attribute_table: str) -> (Union[db.Model, None]):
        """
        Retrieve the minimum value of an attribute
        :param attribute_table: name of attribute data table
        :return: minimum attribute value
        """

        attribute_data_model = ModelClass(attribute_table.lower())
        attr_min = None
        try:
            attr_min = db.session.query(
                attribute_data_model).order_by(
                asc(cast(attribute_data_model.value, Float))).order_by(
                asc(attribute_data_model.timestamp)).first()

        except DataError:
            db.session.rollback()

        db.metadata.clear()
        return attr_min
