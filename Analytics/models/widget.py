import logging
from typing import NoReturn, Union

from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.exc import IntegrityError

from db import db
from .alert_model import AlertWidgetModel

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class WidgetModel(db.Model):
    """
    Create Widget Database Model
    """
    _WIDGET_DB_TABLE_NAME = 'widgets'
    __tablename__ = _WIDGET_DB_TABLE_NAME
    id = db.Column('id', db.Integer, primary_key=True)
    user_id = db.Column('user_id', db.Integer, nullable=False)
    data = db.Column('data', JSON, nullable=False)
    layout_id = db.Column(db.Integer, db.ForeignKey('layouts.id'))
    layout = db.relationship('Layouts',
                             backref=db.backref('layouts', lazy=True))

    def __init__(self, user_id: int, layout: object, data: str) -> None:
        """
        Create new Widget model instance
        :param user_id: The users identification number the widget belongs to
        :param layout: Layout db model for the widget
        :param data:  Widget JSON data
        """
        self.user_id = user_id
        self.data = data
        self.layout = layout

        # Does the database table exist?
        self.create_table()

    def __str__(self) -> str:
        """
        Return the Widget Id and  User id and  as a string
        :return:  JSONified string of the layouts attributes
        """
        return "UserID: {} \t\tWidgetID: {}".format(self.user_id, self.id)

    def json(self) -> dict:
        """
        Create JSON of Widget Attributes
        :return:  JSON serialized Widget attributes
        """
        # format response
        response_data = {"id": str(self.id), "userID": self.user_id,
                         "data": self.data, "layout": self.layout.json()}
        return response_data

    def save(self) -> NoReturn:
        """
        Add Widget instance to the database session
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(ie)

    def delete(self) -> NoReturn:
        """
        Delete Widget entry and its related layout entry from the database
        """
        try:
            db.session.delete(self.layout)
            db.session.delete(self)
            self.delete_alerts()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(ie)

    def commit(self) -> NoReturn:
        """
        Commits session changes to the database
        """
        db.session.commit()

    def delete_alerts(self) -> None:
        """ Delete all child alerts """
        # Get Alerts related to the widget
        alerts = AlertWidgetModel.get_by_kwargs(widget_id=self.id)

        # did we get alerts?
        if not alerts:
            # No related Alerts found
            return
        #  Got mark alerts deletion the alerts
        for alert in alerts:
            alert.delete()
        # Commit alert deletions
        alert.commit()


    def create_table(self) -> NoReturn:
        """
        Create the widget table if it does not exist
        """
        # If table don't exist, Create.
        if not self.table_exists():
            # Create a table with the appropriate Columns
            db.Table(self._WIDGET_DB_TABLE_NAME, db.MetaData(bind=db.engine),
                     db.Column('id', db.Integer, primary_key=True),
                     db.Column('user_id', db.Integer, nullable=False),
                     db.Column('data', JSON, nullable=False),
                     db.Column('layout_id', db.Integer,
                               db.ForeignKey('layouts.id')),
                     db.relationship('Layouts',
                                     backref=db.backref('layouts', lazy=True)),
                     schema=None).create()

    def table_exists(self) -> bool:
        """
        Check if table exists
        :return: True if the table exists in the database otherwise False
        """
        # Does the table exist?
        has_table = db.engine.dialect.has_table(db.engine,
                                                self._WIDGET_DB_TABLE_NAME)
        return has_table

    @classmethod
    def get_widget_by_id(cls, widget_id: int) -> db.Model:
        """
        Fetches a widget by its id
        :param widget_id: the widgets identification number to fetch
        :return: Widget instance if found otherwise None
        """
        # find widget by its id  and return it
        return cls.query.filter_by(id=widget_id).first()

    @classmethod
    def get_widget_by_id_and_user_id(cls, widget_id: int, user_id: int) -> \
            Union[db.Model, None]:
        """
        Fetches a widget by its id and user_id
        :param widget_id: the widgets identification number to fetch
        :param user_id: User Id
        :return: Widget instance if found otherwise None
        """
        # find widget by its id  and return it
        return cls.query.filter_by(id=widget_id, user_id=user_id).first()
