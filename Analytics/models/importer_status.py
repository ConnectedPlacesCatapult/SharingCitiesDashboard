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
    api_id = db.Column(db.Integer, db.ForeignKey('api.id'))
    import_class_name = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    reason = db.Column(db.Text)
    trace = db.Column(db.Text)
    timestamp = db.Column(db.DateTime)

    def __init__(self, api_id: int, import_class_name: str, state: str,
                 reason: str, trace: str,timestamp: datetime = datetime.now()):

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
        """Fetch all Importer Status fields """
        return ImporterStatuses.query.all()

    @staticmethod
    def commit():
        """ Commit updated items to the database """
        db.session.commit()

    @staticmethod
    def find_by_api_id(api_id: int) -> db.Model:
        """
        Return the Importer Status entry that matches the api_id argument
        :param api_id: id of importer which is contained in the api table
        :return: the Importer Status entry that match the api_id argument
        """
        return ImporterStatuses.query.filter_by(api_id=api_id).first()

    @staticmethod
    def find_by_name(name: str) -> db.Model:
        """
        Return the Importer Status entry that matches the api_id argument
        :param name: name of importer which is contained in the api table
        :return: the Importer Status entry that match the api_id argument
        """
        return ImporterStatuses.query.filter_by(import_class_name=name).first()

    @staticmethod
    def remove_all() -> db.Model:
        """Fetch all Importer Status fields """

        status_entries = ImporterStatuses.query.all()
        for entry in status_entries:
            entry.delete()
            entry.commit()
