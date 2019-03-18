''' Data table, store the statuses of the importer '''

from datetime import datetime
import json

from sqlalchemy.exc import IntegrityError
import logging

from db import db

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class ImporterStatuses(db.Model):
    __tablename__ = 'importer_status'

    id = db.Column(db.Integer, primary_key=True)
    api_id = db.Column(db.Integer, nullable=False)
    import_class_name = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    reason = db.Column(db.Text)
    trace = db.Column(db.Text)
    timestamp = db.Column(db.DateTime)

    def __init__(self, api_id: int, import_class_name: str, state: str,
                 reason: str, trace: str,timestamp: datetime = datetime.now()):
        """
        Initialise the Importer Statuses instance attributes

        :param api_id: id of the API from which data is imported from
        :param import_class_name: name of the class that implements the
                                  importer
        :param state: state of the importer.
        :param reason: the error raised when the importer fails
        :param trace: the stack trace raised when the importer fails
        :param timestamp: the date and time when the status was persisted
        """

        self.api_id = api_id
        self.import_class_name = import_class_name
        self.state = state
        self.reason = reason
        self.trace = trace
        self.timestamp = timestamp

    def __str__(self) -> str:
        """
        override the dunder string method to cast the Importer Status
        attributes to a string
        :return: a JSON string of the Importer Status objects attributes
        """
        return json.dumps(self.json())

    def json(self) -> dict:
        """
        Create a JSON dict of the Importer Status object attributes
        :return: the Importer Status object attributes as a JSON (dict)
        """
        return {
            'api_id': self.api_id,
            'import_class_name' : self.import_class_name,
            'state': self.state,
            'reason': self.reason,
            'trace': self.trace,
            'timestamp' : str(self.timestamp)
        }

    def save(self):
        """
        Add the current Importer Status fields to the SQLAlchemy session
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(str(self.id) + ' importer status entry already '
                                        'exists')

    def delete(self):
        """
        Add the current Importer Status fields to the SQLAlchemy session
        to be deleted
        """
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(str(self.id) + ' importer status entry does not '
                                        'exists')

    @staticmethod
    def get_all() -> db.Model:
        """Fetch all entries in the Importer Status table"""
        return ImporterStatuses.query.all()

    @staticmethod
    def commit():
        """ Commit updated items to the database """
        db.session.commit()

    @classmethod
    def find_by_api_id(cls, api_id: int) -> db.Model:
        """
        Return the Importer Status entry that matches the api_id argument
        :param api_id: id of importer which is contained in the api table
        :return: the Importer Status entry that match the api_id argument
        """
        return cls.query.filter_by(api_id=api_id).first()

    @classmethod
    def find_by_name(cls, name: str) -> db.Model:
        """
        Return the Importer Status entry that matches the api_id argument
        :param name: name of importer which is contained in the api table
        :return: the Importer Status entry that match the api_id argument
        """

        return cls.query.filter_by(import_class_name=name).first()

    @classmethod
    def remove_where(cls, time_limit: datetime):
        """
        Delete all entries entered after time_limit argument
        :param time_limit: datetime after which entries should be deleted
        """

        new_statuses = cls.query.filter(
            cls.timestamp >= time_limit)
        for status in new_statuses:
            status.delete()
            status.commit()
