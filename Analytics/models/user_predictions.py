''' Data table, store the Prediciton Results id associated with a user '''

from datetime import datetime
import json

from sqlalchemy.exc import IntegrityError
import logging

from db import db

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class UserPredictions(db.Model):
    __tablename__ = 'userpredictions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    pred_result_id = db.Column(db.Integer, db.ForeignKey(
        'predictionresults.id'))
    timestamp = db.Column(db.DateTime)

    def __init__(self, user_id: int, pred_result_id: int, timestamp: datetime =
                 datetime.now()):
        """
        Initialise the User Predictions object instance
        :param user_id: users id in the users table
        :param pred_result_id: the Prediction Result id that is
        associated with the user
        :param timestamp: time stamp of when the prediction was associated
        with a user
        """
        self.user_id = user_id
        self.pred_result_id = pred_result_id
        self.timestamp = timestamp

    def __str__(self) -> str:
        """
        override dunder string method to cast User Prediction object
        attributes to a string
        :return: a JSON string of the User Predictions object attributes
        """
        return json.dumps(self.json())

    def json(self) -> dict:
        """
        Create a JSON dict of the User Predictions object attributes
        :return: the User Prediction object attributes as a JSON (dict)
        """
        return {
            'user_id': self.user_id,
            'pred_result_id': self.pred_result_id,
        }

    def save(self):
        """
        Add the current User Predictions fields to the SQLAlchemy session
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(str(self.user_id) +
                         ' User already is associated with ' + str(
                self.pred_result_id))

    def delete(self):
        """
        Add the current User Predictions fields to the SQLAlchemy session to be
        deleted
        """
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(str(self.user_id) + ' User Prediction ID does not '
                                             'exists')

    @staticmethod
    def commit():
        """ Commit updated items to the database """
        db.session.commit()

    @classmethod
    def find_by_user_id(cls, user_id: int) -> db.Model:
        """
        Return the Prediction Result ids that matches the user_id argument
        :param user_id: id of user
        :return: the user predictions entry/entries that match the user_id argument
        """
        return cls.query.filter_by(user_id=user_id).all()

    @classmethod
    def find_by_pred_id(cls, pred_id: int) -> db.Model:
        """
        Return the entries which match the user_id argument
        :param pred_id: id of prediction result
        :return: the user predictions entry/entries that match the pred_id argument
        """
        return cls.query.filter_by(pred_result_id=pred_id).all()

    @classmethod
    def get_entry(cls, user_id: int, pred_id) -> db.Model:
        """
        Return the prediction result ids that matches the user_id and
        pred_result_id arguments
        :param user_id: id of user requesting the prediction
        :param pred_id: id of prediction result
        :return: the user predictions entry which matched the pred_id and user_id
        argument
        """
        return cls.query.filter_by(user_id=user_id,
                                   pred_result_id=pred_id).first()

    @classmethod
    def add_entry(cls, user_id, prediction_result_id):
        """
        Add an entry into the user predictions table if it does not exists
        :param user_id: id of user requesting the prediction
        :param prediction_result_id: id of prediction result
        """
        if user_id:
            if not cls.get_entry(user_id, prediction_result_id):
                user_prediction_entry = UserPredictions(user_id,
                                                        prediction_result_id,
                                                        datetime.now())
                user_prediction_entry.save()
                user_prediction_entry.commit()

