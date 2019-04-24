import logging
from datetime import datetime
from typing import Union, NoReturn

from sqlalchemy.exc import IntegrityError

from db import db

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class AlertWidgetModel(db.Model):
    """
    Create AlertWidget database model. Store Maximum and Minimum threshold
    values for attribute values per user.
    """
    __tablename__ = 'Alerts'
    id = db.Column(db.Integer, primary_key=True)
    widget_id = db.Column(db.Integer, nullable=True)
    user_id = db.Column(db.Integer)
    attribute_id = db.Column(db.Text)
    max_threshold = db.Column(db.Float, nullable=True)
    min_threshold = db.Column(db.Float, nullable=True)
    activated = db.Column(db.Boolean, default=True)
    date_created = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, user_id: int, widget_id: int, attribute_id: str,
                 max_threshold: Union[None, float] = None,
                 min_threshold: Union[None, float] = None,
                 activated: bool = True):
        """
        Create new AlertWidgetModel instance
        :param user_id: User Id
        :param widget_id: Alert Widget Id
        :param attribute_id: Attribute Id
        :param max_threshold: Maximum Value Threshold
        :param min_threshold: Minimum Value Threshold
        :param activated: Enabled Alert when True otherwise Ignore when False
        """
        self.user_id = user_id
        self.widget_id = widget_id
        self.attribute_id = attribute_id
        self.max_threshold = max_threshold
        self.min_threshold = min_threshold
        self.activated = activated

    def __eq__(self, alert: db.Model) -> bool:
        """
        Check two AlertWidgetModels are equal
        :param alert:
        :return: If equal return true otherwise return False
        """
        if not isinstance(alert, AlertWidgetModel):
            return False

        if (self.attribute_id == alert.attribute_id
                and self.min_threshold == alert.min_threshold
                and self.max_threshold == alert.max_threshold
                and self.user_id == alert.user_id
                and self.widget_id == alert.widget_id):
            return True

    @property
    def json(self) -> dict:
        """
        Get JSON of AlertWidgetModel
        :return: JSON representation of AlertWidgetModel attributes
        """
        return dict(user_id=self.user_id, widget_id=self.widget_id,
                    attribute_id=self.attribute_id,
                    max_threshold=self.max_threshold,
                    min_threshold=self.min_threshold,
                    activated=self.activated)

    def save(self) -> NoReturn:
        """
        Save AlertWidgetModel
        """
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(ie)

    def delete(self) -> NoReturn:
        """
        Delete AlertWidgetModel
        """
        try:
            db.session.delete(self)
        except IntegrityError as ie:
            db.session.rollback()
            logger.error(ie)

    def commit(self) -> NoReturn:
        """
        Commit session changes to the database
        """
        db.session.commit()

    @classmethod
    def get_by_id(cls, alert_id: int) -> Union[db.Model, None]:
        """
        Get AlertWidgetModel by id
        :param alert_id: AlertWidgetModel Id
        :return: A AlertWidgetModel with matching id otherwise None
        """
        return cls.query.filter_by(id=alert_id).first()

    @classmethod
    def get_by_widget_id(cls, widget_id: int) -> Union[db.Model, None]:
        """
        Get AlertWidgetModel by Associated Widget Id
        :param widget_id: Associated Widget Id
        :return: A AlertWidgetModel with matching id otherwise None
        """
        return cls.query.filter_by(widget_id=widget_id).first()

    @classmethod
    def get_by_kwargs(cls, **kwargs: dict) -> [db.Model]:
        """
        Get AlertWidgetModels by Keyword Arguments
        :param kwargs: Keyword arguments to Filter database query by
        :return: A List of WidgetAlertModels filtered by keyword arguments
        """
        return cls.query.filter_by(**kwargs).all()

    @classmethod
    def get_all_activated_alerts(cls) -> Union[list, None]:
        """
        Get all activated AlertWidgetModels
        :return: A List of activated AlertWidgetModels otherwise None
        """
        return cls.query.filter_by(activated=True).all()

    @classmethod
    def get_max_alerts(cls, attribute_id: str,
                       value: Union[float, int]) -> [db.Model]:
        """
        Get Maximum Threshold Alerts
        :param value: Maximum Value measured by sensor
        :param attribute_id: Attribute Id
        :return: Triggered alert details containing user_id, Value,
                Threshold value and type
        """
        results = list()

        max_alerts = cls.query.filter(cls.max_threshold <= value).filter(
            cls.attribute_id == attribute_id).all()

        if len(max_alerts) <= 0:
            return []

        for alert in max_alerts:
            alerts = dict()
            alerts["user_id"] = alert.user_id
            alerts["type"] = "Maximum Threshold Exceeded"
            alerts["value"] = value
            alerts["max_threshold"] = alert.max_threshold
            results.append(alerts)

        return results

    @classmethod
    def get_min_alerts(cls, attribute_id: str,
                       value: Union[float, int]) -> [db.Model]:
        """
        Get Minimum Threshold Alerts
        :param value: Minimum Value measured by sensor
        :param attribute_id: Attribute Id
        :return: Triggered alert details containing user_id, Value,
                Threshold value and type
        """
        results = list()

        min_alerts = cls.query.filter(cls.min_threshold >= value).filter(
            cls.attribute_id == attribute_id).all()

        if len(min_alerts) <= 0:
            return []

        for alert in min_alerts:
            alerts = dict()
            alerts["user_id"] = alert.user_id
            alerts["type"] = "Minimum Threshold Exceeded"
            alerts["value"] = value
            alerts["min_threshold"] = alert.min_threshold
            results.append(alerts)

        return results
