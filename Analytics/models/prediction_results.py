''' Data table to store the results of get_prediction requests '''

from datetime import datetime
import json

from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.exc import IntegrityError
from sqlalchemy import asc
import logging

from db import db
from models.user_predictions import UserPredictions

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)

CACHE_SIZE = 5


class PredictionResults(db.Model):
    __tablename__ = 'predictionresults'

    id = db.Column(db.Integer, primary_key=True)
    forcasting_engine = db.Column(db.String(50))
    mean_absolute_percentage_error = db.Column(db.Float)
    attribute_table = db.Column(db.String(150), nullable=False)
    sensor_id = db.Column(db.String(150), nullable=False)
    num_predictions = db.Column(db.Integer, nullable=False)
    result = db.Column(JSON, nullable=False)
    created_timestamp = db.Column(db.DateTime, nullable=False)
    updated_timestamp = db.Column(db.DateTime, nullable=False)

    def __init__(self, eng: str, mape: float, attribute_table: str,
                 sensor_id: str,  num_predictions: int, result: JSON,
                 created_timestamp: datetime = datetime.now(),
                 updated_timestamp: datetime = datetime.now()):
        """
        Initialise the RequestPrediction object instance
        :param eng: the name of the forecasting engine used for predictions
        :param mape: the mean absolute percent error over all prediction values
        :param attribute_table: the attribute table whose entries were used
        in the prediction calculations
        :param sensor_id: the ID of the sensor used during prediction
        calculations
        :param num_predictions: the number of predictions that were calculated
        :param result: the prediction list returned from get_predictions
        :param current_timestamp: time stamp of when the result was created
        """
        self.forcasting_engine = eng
        self.mean_absolute_percentage_error = mape
        self.attribute_table = attribute_table
        self.sensor_id = sensor_id
        self.num_predictions = num_predictions
        self.result = result
        self.created_timestamp = created_timestamp
        self.updated_timestamp = updated_timestamp

    def __str__(self) -> str:
        """
        override the dunder string method to cast the Prediction Results
        attributes to a string
        :return: a JSON string of the Prediction Results objects attributes
        """
        return json.dumps(self.json())

    def json(self) -> dict:
        """
        Create a JSON dict of the Prediction Results object attributes
        :return: the Prediction Results object attributes as a JSON (dict)
        """
        return {
            'forcasting_engine' : self.forcasting_engine,
            'mean_absolute_percentage_error' :
                self.mean_absolute_percentage_error,
            'attribute_table': self.attribute_table,
            'sensor_id': self.sensor_id,
            'num_predictions': self.num_predictions,
            'result': self.result
        }

    def save(self):
        """
        Add the current Prediction Results fields to the SQLAlchemy session
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(str(self.id) + ' prediction request already exists')

    def delete(self):
        """
        Add the current Prediction Results fields to the SQLAlchemy session
        to be deleted
        """
        try:
            db.session.delete(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(str(self.id) + ' prediction request does not exists')

    @staticmethod
    def commit():
        """ Commit updated items to the database """
        db.session.commit()

    @classmethod
    def find_by_prediction_args(cls, attr_table_name: str, sensor_id: str,
                                num_pred: int) -> db.Model:
        """ Return a stored result that matches the prediction arguments """

        if sensor_id is None:
            sensor_id = "All sensors"
        return cls.query.filter(
            PredictionResults.attribute_table == attr_table_name,
            PredictionResults.sensor_id == sensor_id,
            PredictionResults.num_predictions == num_pred).first()

    @classmethod
    def enforce_lru_replacement_policy(cls) -> db.Model:
        """ Remove the least recently used prediction if the table is full """

        number_of_predictions = cls.query.count()
        if number_of_predictions > CACHE_SIZE:
            least_recently_used = cls.query.order_by(asc(
                cls.updated_timestamp)).first()

            users_with_lru_entry = UserPredictions.find_by_pred_id(
                least_recently_used.id)
            for user in users_with_lru_entry:
                db.session.delete(user)
                db.session.commit()

            db.session.delete(least_recently_used)
            db.session.commit()
