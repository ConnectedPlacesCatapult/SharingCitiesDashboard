from typing import NoReturn
import logging

from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.exc import IntegrityError

from db import db

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class WidgetModel(db.Model):
    """
    Database model for the widget table used to persist widget data
    :param _WIDGET_DB_TABLE_NAME: table name
    :param  id:         primary key
    :param  user_id:    users unique identification number
    :param  data:       widget data to be persisted in table

    :type _WIDGET_DB_TABLE_NAME: String
    :type id:       Integer
    :type user_id:  Integer
    :type data:     JSON

    """
    _WIDGET_DB_TABLE_NAME = 'widgets'
    __tablename__ = _WIDGET_DB_TABLE_NAME
    id = db.Column('id', db.Integer, primary_key=True)
    user_id = db.Column('user_id', db.Integer, nullable=False)
    data = db.Column('data', JSON, nullable=False)
    layout_id = db.Column(db.Integer, db.ForeignKey('layouts.id'))
    layout = db.relationship('Layouts', backref=db.backref('layouts', lazy=True))

    def __init__(self, user_id, layout, data):
        """
        Initiates the new widget instance
        :param user_id: The users identification number the widget belongs to
        :type user_id: Integer
        :param layout: Layout for the widget
        :type layout: Layouts
        :param data:  widgets JSON data
        :type data:   JSON
        """
        self.user_id = user_id
        self.data = data
        self.layout = layout

        # Does the database table exist?
        self.create_table()

    def __str__(self) -> str:
        """
        returns the layout instance as a string
        :return:  JSONified string of the layouts attributes
        """
        return "UserID: {} \t\tWidgetID: {}".format(self.user_id, self.id)

    def json(self) -> dict:
        """
        formats response to be sent to user
        :return:  a Dictionary of the response data
        :param  id:      widgetID
        :param  userID:  users identification number
        :param  data:    widget JSON data
        :type:   Integer
        :type:   Integer
        :type:   JSON
        """
        # format response
        response_data = {"id": str(self.id), "userID": self.user_id, "data": self.data}
        return response_data

    def save(self) -> NoReturn:
        """
        Adds widget entry to the database session to be committed
        :raises IntegrityError: performs a database session rollback
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(ie)

    def delete(self) -> NoReturn:
        """
        Deletes a widget entry and its related layout entry from the database session to be committed
        :raises IntegrityError: performs a database session rollback
        """
        try:
            db.session.delete(self.layout)
            db.session.delete(self)
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(ie)

    def commit(self) -> NoReturn:
        """
        Commits session changes to the database
        """
        db.session.commit()

    def create_table(self) -> NoReturn:
        """
        Creates the widget table used to persist widget data in the database if it does not exist
        :param _WIDGET_DB_TABLE_NAME: table name
        :param  id:         primary key
        :param  user_id:    users unique identification number
        :param  data:       widget data to be persisted in table

        :type _WIDGET_DB_TABLE_NAME: String
        :type id:       Integer
        :type user_id:  Integer
        :type data:     JSON
        """
        # If table don't exist, Create.
        if not self.table_exists():
            # Create a table with the appropriate Columns
            db.Table(self._WIDGET_DB_TABLE_NAME, db.MetaData(bind=db.engine),
                     db.Column('id', db.Integer, primary_key=True),
                     db.Column('user_id', db.Integer, nullable=False),
                     db.Column('data', JSON, nullable=False),
                     db.Column('layout_id', db.Integer, db.ForeignKey('layouts.id')),
                     db.relationship('Layouts', backref=db.backref('layouts', lazy=True)),
                     schema=None).create()

    def table_exists(self) -> bool:
        """
        Check if table exists
        :return: True if the table exists in the database otherwise False
        """
        # Does the table exist?
        has_table = db.engine.dialect.has_table(db.engine, self._WIDGET_DB_TABLE_NAME)
        return has_table

    @classmethod
    def get_widget_by_id(cls, widgetID) -> object:
        """
        Fetches a widget by its id
        :param widgetID: the widgets identification number to fetch
        :return: Widget instance if found otherwise None
        """
        # find widget by its id  and return it
        return cls.query.filter_by(id=widgetID).first()
