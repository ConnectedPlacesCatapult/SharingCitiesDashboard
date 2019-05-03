from datetime import datetime
from typing import Callable, Any, Union
import logging
import http.client

import sendgrid
from sendgrid.helpers.mail import Email, Content, Mail
import flask

from models.attributes import Attributes
from models.attribute_range import AttributeRange
from resources.alerts.push_alert import PushAlert
from models.alert_model import AlertWidgetModel
from models.users import Users
from models.sensor import Sensor
from models.location import Location
from app import create_app
from db import db
from settings.get_config_decorator import GetConfig

application = create_app()
logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


def update_attribute_ranges(import_function: Callable) -> Callable:
    """
    Function decorator, track minimum and maximum value of all attributes
    :param import_function: Importer function
    :return: Importer function wrapped with minimum and maximum value
             functionality
    """
    def range_wrapper(*args: Any, **kwargs: dict):
        """
        Execute importer function and then compute minimum and maximum
        values of attributes
        :param args: Arguments of import_function parameter
        :param kwargs: Keyword Arguments of import_function parameter
        """
        import_function(*args, **kwargs)

        attribute_entries = Attributes.get_all()
        for attribute in attribute_entries:
            attribute_range = AttributeRange.get_by_attr_id(attribute.id)
            if attribute_range:
                most_recent_entry = Attributes.most_recent_timestamp(
                    attribute.table_name)
                if most_recent_entry:
                    if attribute_range.latest_update < most_recent_entry:
                        attr_min = Attributes.attribute_min(
                            attribute.table_name)
                        attr_max = Attributes.attribute_max(
                            attribute.table_name)
                        try:
                            attribute_range.minimum_sensor_id = \
                                attr_min.s_id
                            attribute_range.minimum = attr_min.value
                            attribute_range.minimum_recorded_date = \
                                attr_min.timestamp
                            attribute_range.maximum_sensor_id = \
                                attr_max.s_id
                            attribute_range.maximum = attr_max.value
                            attribute_range.maximum_recorded_date = \
                                attr_max.timestamp
                            attribute_range.latest_update = datetime.now()
                            attribute_range.save()
                            attribute_range.commit()

                            PushAlert.check_alerts(attribute_range)
                            check_min_and_max_alert_widgets(attribute_range)
                        except AttributeError:
                            pass

            else:
                attr_min = Attributes.attribute_min(attribute.table_name)
                attr_max = Attributes.attribute_max(attribute.table_name)
                try:
                    new_range_entry = \
                        AttributeRange(attribute.id,
                                       attr_min.s_id,
                                       attr_min.value,
                                       attr_min.timestamp,
                                       attr_max.s_id,
                                       attr_max.value,
                                       attr_max.timestamp,
                                       datetime.now())
                    new_range_entry.save()
                    new_range_entry.commit()
                    check_min_and_max_alert_widgets(new_range_entry)
                    PushAlert.check_alerts(new_range_entry)
                except AttributeError:
                    new_range_entry = AttributeRange(attribute.id, None, None,
                                                     None, None, None, None,
                                                     datetime.now())
                    new_range_entry.save()
                    new_range_entry.commit()

    return range_wrapper


def check_min_and_max_alert_widgets(attribute_range_entry: db.Model):
    """
    Send emails to users for alert widgets that have been triggered
    :param attribute_range_entry: Entry in the attribute range table
    """

    if attribute_range_entry.maximum:
        max_alerts = AlertWidgetModel.get_max_alerts(attribute_range_entry)
        for alert in max_alerts:
            user_details = Users.find_by_id(alert["user_id"])
            if user_details:
                attr = Attributes.get_by_id(attribute_range_entry.attribute_id)
                if attr:
                    if not send_alert_email(
                            user_details.email, user_details.fullname,
                            attr.name, attribute_range_entry.maximum,
                            attribute_range_entry.maximum_recorded_date,
                            attribute_range_entry.maximum_sensor_id,
                            alert["max_threshold"], "exceeded"):
                        logger.error("Server error prevented the  "
                                     "sending of a max alert email "
                                     "to {} regarding attribute with "
                                     "id {}".format(
                            user_details.email,
                            attribute_range_entry.attribute_id))
                else:
                    logger.error(
                        "Could not send max alert email to "
                        "user with id {} as the attribute with "
                        "id {} does not exist ".format(
                            alert["user_id"],
                            attribute_range_entry.attribute_id))
            else:
                logger.error("Could not send max alert email to "
                             "user with id {} as the user does "
                             "not exist ".format(alert["user_id"]))

    if attribute_range_entry.minimum:
        min_alerts = AlertWidgetModel.get_min_alerts(attribute_range_entry)
        for alert in min_alerts:
            user_details = Users.find_by_id(alert["user_id"])
            if user_details:
                attr = Attributes.get_by_id(attribute_range_entry.attribute_id)
                if attr:
                    if not send_alert_email(
                            user_details.email, user_details.fullname,
                            attr.name, attribute_range_entry.minimum,
                            attribute_range_entry.minimum_recorded_date,
                            attribute_range_entry.minimum_sensor_id,
                            alert["min_threshold"], "fell short of"):
                        logger.error("Server error prevented the sending of "
                                     "a  min alert email to {} regarding  "
                                     "attribute with id {}".format(
                            user_details.email,
                            attribute_range_entry.attribute_id))
                else:
                    logger.error(
                        "Could not send min alert email to "
                        "user with id {} as the attribute with "
                        "id {} does not exist ".format(
                            alert["user_id"],
                            attribute_range_entry.attribute_id))
            else:
                logger.error("Could not send min alert email to "
                             "user with id {} as the user does "
                             "not exist ".format(alert["user_id"]))


def send_alert_email(email: str, username: str, attribute: str,
                     value: Union[int,float], recorded_date: datetime,
                     sensor_id: str, threshold: Union[int, float], 
                     alert_description: str) -> bool:

    """
    Send attribute alert email to a user
    :param email: User's email address
    :param username: User's name in the Users table
    :param attribute: Attribute name
    :param value: maximum value for the respective attribute
    :param recorded_date: Date which the maximum value was recorded
    :param sensor_id: ID of sensor which recorded the
    :param threshold: Value set by user to be checked
    :param alert_description: Describes whether an attribute has been
                              exceeded or fell short of the threshold value
    :return: Whether the alert email was sent
    """

    sensor = Sensor.get_by_id(sensor_id)
    sensor_lat, sensor_lon = None, None
    if sensor:
        loc = Location.get_by_id(sensor.l_id)
        if loc:
            sensor_lat = loc.lat
            sensor_lon = loc.lon
    else:
        logger.info("Could not include sensor information in alert "
                     "email as sensor with ID {} does not "
                     "exist".format(sensor_id))

    if alert_description == "exceeded":
        diff = value - threshold
    else:
        diff = threshold - value

    text_version = GetConfig.configure('alert', 'text_template').format(
        username=username, attribute=attribute, threshold=threshold,
        sensor_id=sensor_id, lat=sensor_lat, lon=sensor_lon,value=value,
        recorded_date=recorded_date, verb=alert_description, diff=diff)

    html_version = flask.render_template(
        GetConfig.configure('alert', 'html_template'), username=username,
        attribute=attribute, threshold=threshold, sensor_id=sensor_id,
        lat=sensor_lat, lon=sensor_lon,value=value,
        recorded_date=recorded_date, verb=alert_description, diff=diff)

    sg = sendgrid.SendGridAPIClient(apikey=GetConfig.configure('sendgrid',
                                                               'api_key'))

    from_email = Email(GetConfig.configure('alert', 'sender_email'))
    to_email = Email(email)
    subject = GetConfig.configure('alert', 'email_subject')
    content_text = Content("text/plain", text_version)
    send_alert = Mail(from_email, subject, to_email, content_text)
    content_html = Content("text/html", html_version)
    send_alert.add_content(content_html)

    try:
        email_response = sg.client.mail.send.post(
            request_body=send_alert.get())
        logger.info("Sent alert email to {} with "
                    "response code : {}".format(email,
                                                email_response.status_code))
        return True
    except http.client.IncompleteRead as e:
        logger.error("Sendgrid API Key may not be set correctly or be "
                     "invalid", e)
        return False
