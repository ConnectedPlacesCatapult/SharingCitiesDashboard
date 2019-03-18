import logging
from typing import Union

from sqlalchemy.exc import IntegrityError

from db import db
from .attributes import Attributes

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class AttrAlias(db.Model):
    """Create AttrAlias database model for Attribute Aliases"""
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(255), nullable=True)
    table_name: str = db.Column(db.String(255), nullable=True)
    sub_theme_id: int = db.Column(db.Integer, nullable=True)
    unit_id: int = db.Column(db.Integer, nullable=False)
    attribute_id: str = db.Column(db.Text, nullable=False)
    user_id: int = db.Column(db.Integer, nullable=False)
    description: str = db.Column(db.String(255), nullable=True)

    def __init__(self, attributes_id: int, user_id: int, unit_id: int = None,
                 name: str = None, table_name: str = None, description: str = None) -> None:
        """
        Fetch attribute. Assign attribute values if not supplied in parameters
        :param  attributes_id:   Attributes identification number.
        :param  user_id:    User identification number the alias is owned by.
        :param  unit_id:    Unit identification number for unit customization
        :param  name:   Alias for attribute name
        :param  table_name: Alias for table_name
        :param  description:    Custom description for Attribute
        """
        self.attribute_id = attributes_id
        # Get Attribute by id
        self.attribute = Attributes.get_by_id(self.attribute_id)
        if not self.attribute:
            # Raise a ValueError, Attribute not found.
            raise ValueError
        # Load defaults for parameters not passed
        if name:
            self.name = name
        else:
            self.name = self.attribute.name

        if table_name:
            self.table_name = table_name
        else:
            self.table_name = self.attribute.table_name

        if unit_id:
            self.unit_id = unit_id
        else:
            self.unit_id = self.attribute.unit_id

        if description:
            self.description = description
        else:
            self.description = self.attribute.description

        self.sub_theme_id = self.attribute.sub_theme_id
        self.user_id = user_id

    @property
    def serializable(self) -> {str: Union[str, int]}:
        """
        Create Serializable data of Model, Remove Duplicate Data to reduce ThemeTree size
        :return: JSON Serializable data for theme tree
        """
        attribute = Attributes.get_by_id(self.attribute_id)
        return {
            'attribute_id': self.attribute_id,
            'user_id': self.user_id,
            'name': self.name,
            'table_name': self.table_name,
            'Unit': self.unit_id,
            'Unit Value': attribute.unit_value if attribute is not None else "None",
            'Description': self.description
        }

    def json(self) -> {str: Union[int, str]}:
        """
        Get JSON of AttrAlias model. JSON returned matches Attribute JSON format to make the alias
        loosely coupled on the front end

        :returns:   JSON representation of AttrAlias model
        """
        attribute = Attributes.get_by_id(self.attribute_id)
        return {
            'id': self.attribute_id,
            'name': self.name,
            'table_name': self.table_name,
            'Sub Theme id': self.sub_theme_id,
            'Unit': self.unit_id,
            'Unit Value': attribute.unit_value if attribute is not None else "None",
            'Description': self.description
        }

    def save(self) -> None:
        """
        Save object instance
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            logger.critical(ie)
            db.session.rollback()

    def commit(self) -> None:
        """
        Commit changes to the database
        """
        db.session.commit()

    def delete(self) -> None:
        """
        Delete Object instance
        """
        try:
            db.session.delete(self)
        except IntegrityError as ie:
            logger.error(ie)
            db.session.rollback()

    @classmethod
    def get_by(cls, **kwargs: dict()) -> [db.Model]:
        """
        Get Attribute Alias by filter kwargs
        :param kwargs: Keyword arguments used as query filter
        :type kwargs: Dict
        :return: An AttrAlias on success or None
        """
        return cls.query.filter_by(**kwargs).first()

    @classmethod
    def get_by_user_id(cls, user_id: int) -> [db.Model]:
        """
        Get Attribute Alias by User id
        :param user_id: User identification number used as query filter
        :type user_id: int
        :return: An AttrAlias on success or None
        """
        return cls.query.filter_by(user_id=user_id).all()

    @classmethod
    def get_by_attr_id(cls, attributes_id: str) -> [db.Model]:
        """
        Get Attribute Alias by Attribute id
        :param attributes_id: Attribute identification number used as query filter
        :type attributes_id: int
        :return: An AttrAlias on success or None
        """
        return cls.query.filter_by(attributes_id=attributes_id).all()
