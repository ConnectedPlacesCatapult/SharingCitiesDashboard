"""
API for retrieving data from backend
Note: If no parameters are passed then by default all the themes are returned
@params
    Parameters can be passed with url using get requests
    theme: accepts an integer id and return subthemes for that theme
    subtheme: accepts an integer id and returns all the attributes 
                associated with the subtheme
    attribute: accepts name of attributes, more then one attribute names 
                can be passed as comma separated values
    attributedata: works in similar way to attribute but instead of returing
                    attribute details it return data associated with the 
                    attribute
    sensor: accepts an id of the sensor and return its details, also accept a 
            value 'all' which would return all the sensor in the system
    sensorname: accepts the name of the sensor, works same as attribute can 
                return information about multiple sensor names when passed as
                comma separated string
    sensorattribute: accepts the id(s) of the sensor and returns the attributes 
                    associated with the sensor
    limit: accepts an integer and would return only those number of records
            default is 30
    offset: accepts an integer and default is 30, used when one would want to
            skip few records, useful in pagination
    fromdate: accepts a date in YYYY-MM-DD format, start date of the records
    todate: accepts a date in YYYY-MM-DD formart, end date of the records
    operation: when mathematical calculation needs to be perfomed
    grouped: boolean specifying whether the sensor records are to be grouped at hourly intervals
        per_sensor: boolean specifying whether the sensor records are to be grouped at hourly intervals and 
                    per individual sensor. Defaults to False
    moving: boolean specifying whether data related to moving sensors is to be
            returned

    Note: fromdate and todate both needs to be present in order for date filtering to work

    Few example queries:
        {URL}?sensor='<id-of-sensor>' // Retriving a single sensor
        {URL}?sensor=all               // Retriving all the sensors
        {URL}?sensorname='<name-of-sensor>' // Retriving by name
        {URL}?sensor='<name1>,<name2>' // To retrieve multiple records
        {URL}?attributedata='<name-of-attribute>&limit=60&offset=60' // Retrieve records but increase limit and skip 60
        {URL}?attributedata='<name1><name2>&limit=60&offset=60&fromdate=2018-11-22&todate=2018-11-24'
        {URL}?attributedata='<name1><name2>&limit=1000&grouped=True&per_sensor=True&freq='1H' // Retrieves records and groups the data at hourly intervals
        {URL}?attributedata='<name1><name2>&limit=1000&grouped=True&per_sensor=False&freq='1H' // Retrieves records and groups the data from all sensors of same attribute at hourly intervals
        {URL}?attributedata='<name1><name2>&limit=1000&grouped=True&harmonising_method=long // Harmonisies all attributes in the query to match the attribute with the most records. It also reformats the data to be structured as long (row stacked) or wide (column stacked)

"""
from datetime import datetime
import subprocess

from flask_restful import Resource, reqparse, inputs
from celery.utils.log import get_task_logger
from celery.exceptions import Ignore
from celery import states
import sqlalchemy
import statistics
import celery
import logging

from db import db
from models.theme import Theme
from models.attributes import Attributes
from models.theme import SubTheme
from models.attribute_data import ModelClass
from models.sensor_attribute import SensorAttribute
from models.sensor import Sensor
from models.location import Location
from models.unit import Unit
from models.prediction_results import PredictionResults
from models.user_predictions import UserPredictions
from models.users import Users
from models.pin_location_data import Tracker, LocationData
from resources.helper_functions import is_number
from resources.request_grouped import request_grouped_data
from resources.request_grouped import request_harmonised_data


LIMIT = 30
OFFSET = 30

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)

celery_logger = get_task_logger(__name__)


class RequestForData(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('theme', type=str, store_missing=False)
    parser.add_argument('subtheme', type=str, store_missing=False)
    parser.add_argument('attribute', type=str, store_missing=False)
    parser.add_argument('attributedata', type=str, store_missing=False)
    parser.add_argument('sensor', type=str, store_missing=False)
    parser.add_argument('sensorname', type=str, store_missing=False)
    parser.add_argument('sensorattribute', type=str, store_missing=False)
    parser.add_argument('limit', type=int, store_missing=False)
    parser.add_argument('offset', type=int, store_missing=False)
    parser.add_argument('fromdate', type=str, store_missing=False)
    parser.add_argument('todate', type=str, store_missing=False)
    parser.add_argument('operation', 
                        type=str,
                        choices=('mean', 'median', 'sum'),
                        store_missing=False)
    parser.add_argument('grouped', type=inputs.boolean, store_missing=False)
    parser.add_argument('freq', type=str,
                        choices=('1W', '1D', '1H', '1Min', '1M'),
                        store_missing=False)
    parser.add_argument('method', type=str,
                        choices=('mean', 'median', 'min', 'max'),
                        store_missing=False)
    parser.add_argument('harmonising_method', 
                        type=str,
                        choices=('long', 'wide', 'geo'),
                        store_missing=False)
    parser.add_argument('per_sensor', type=inputs.boolean, store_missing=False)
    parser.add_argument('sensorid', type=str, store_missing = False)
    parser.add_argument('n_predictions', type=int, store_missing = False)
    parser.add_argument('predictions', type=inputs.boolean,
                        store_missing = False)
    parser.add_argument('user_id', type=int, store_missing=False)
    parser.add_argument('moving', type=inputs.boolean, required=False,
                        store_missing = False)

    def get(self):
        args = self.parser.parse_args()
        theme, subtheme, attribute_data, sensor, sensor_name, sensor_attribute, attributes, sensorid, n_predictions, predictions, grouped, harmonising_method, per_sensor, freq, method = None, None, None, None, None, None, [], None, 100, None, None, None, None, '1H', 'mean'
        user_id = None

        if 'moving' in args:
            if args['moving']:
                if 'theme' in args:
                    theme_id = args['theme']
                    if theme_id == 'all':
                        themes = Theme.get_all()
                        moving_themes = [theme.json() for theme in themes
                                         if "Moving" in theme.name]
                        return moving_themes, 200
                    else:
                        subthemes = SubTheme.get_by_theme_id(theme_id)
                        if subthemes:
                            moving_subthemes = [subtheme.json() for subtheme in
                                                subthemes if "Moving"in
                                                subtheme.name]
                            return moving_subthemes, 200
                        else:
                            return {"message": "could not find subthemes "
                                               "corresponding to theme id "
                                               "{}".format(theme_id)}, 400

                if 'subtheme' in args:
                    subtheme_id = args['subtheme']
                    if subtheme_id == 'all':
                        subthemes = SubTheme.get_all()
                        moving_subthemes = [subtheme.json() for subtheme in
                                            subthemes if "Moving"in
                                            subtheme.name]
                        return moving_subthemes, 200
                    else:
                        trackers = Tracker.get_by_subtheme_id(subtheme_id)
                        if trackers:
                            moving_sensors = [tracker.json for tracker in
                                              trackers if
                                              tracker.sub_theme_id ==
                                              int(subtheme_id)]
                            return moving_sensors, 200
                        else:
                            return {"message": "could not find sensors "
                                               "corresponding to subtheme id "
                                               "{}".format(subtheme_id)}, 400

                if 'sensor' in args:
                    sensor_id = args["sensor"]
                    if sensor_id == "all":
                        sensors = Tracker.get_all()
                        if sensors:
                            moving_sensors = [sensor.json for sensor
                                              in sensors]
                            return moving_sensors, 200
                        else:
                            return {"message": "No moving sensors"}, 400
                    else:
                        moving_sensor = Tracker.get_by_tracker_id(sensor_id)
                        if moving_sensor:
                            return moving_sensor.json, 200
                        else:
                            return {"message": "could not find sensor with "
                                               "id {}".format(sensor_id)}, 400

                if 'sensorattribute' in args:
                    sensor_id = args["sensorattribute"]
                    if sensor_id == 'all':
                        all_trackers =  Tracker.get_all()
                        if all_trackers:
                            result = [
                                {"id": tracker.id,
                                 "attributes":
                                     LocationData.get_tracker_attributes(
                                         tracker.id)
                                 } for tracker in all_trackers
                            ]
                            return result, 200
                    else:
                        tracker_attrs = LocationData.get_tracker_attributes(
                            sensor_id)
                        if tracker_attrs:
                            return {"id": sensor_id,
                                    "attributes": tracker_attrs
                                    }, 200

                if 'attribute' in args:
                    attr_name = args['attribute']
                    all_trackers = Tracker.get_all()
                    if all_trackers:
                        result = {"attribute": attr_name, "trackers": []}
                        for track in all_trackers:
                            if LocationData.does_tracker_record(track.id,
                                                                attr_name):
                                result["trackers"].append({"id":track.id})
                        return result, 200
                    else:
                        return {"message": "No moving sensors"}, 400

                if 'attributedata' in args:
                    limit = 5
                    if 'limit' in args:
                        limit = args["limit"]

                    if 'sensorid' in args:
                        trackers = [Tracker.get_by_tracker_id(args["sensorid"])]
                        if trackers == [None]:
                            return {"message": "could not find sensor with "
                                               "id {}".format(args["sensorid"])}, 400
                    else:
                        trackers = Tracker.get_all()

                    attr_name = args['attributedata']
                    if trackers:
                        result = {"attribute": attr_name, "attributedata": []}
                        for track in trackers:
                            if LocationData.does_tracker_record(track.id,
                                                                attr_name):

                                tracker_data = {"id": track.id, "data": []}
                                tracker_data_result = \
                                        LocationData.get_by_tracker_id_with_limit(
                                            track.id, limit)
                                for entry in tracker_data_result:
                                    tracker_data["data"].append(entry.json)

                                result["attributedata"].append(tracker_data)

                        return result, 200
                    else:
                        return {"message": "No moving sensor"}, 400

            return {"error": "error occurred while processing request"}, 400

        if 'theme' in args:
            theme = args['theme']

        if 'subtheme' in args:
            subtheme = args['subtheme']

        if 'attributedata' in args:
            attribute_data = args['attributedata']

        if 'attribute' in args and args['attribute'] is not None:
            _attributes = args['attribute']
            if _attributes != '':
                attributes = _attributes.split(',')

        if 'sensor' in args and args['sensor'] is not None:
            sensor = args['sensor']
            if sensor != '':
                if sensor == 'all':
                    sensors = Sensor.get_all()
                    return [a.json() for a in sensors], 200
                else:
                    return (Sensor.get_by_id(sensor)).json(), 200

        if 'sensorname' in args and args['sensorname'] is not None:
            sensor_name = args['sensorname']
            if sensor_name != '':
                _sensors = sensor_name.split(',')
                _by_name = Sensor.get_by_name_in(_sensors)
                return [a.json() for a in _by_name], 200

        if 'sensorattribute' in args and args['sensorattribute'] is not None:
            sensor_attribute = args['sensorattribute']
            if sensor_attribute != '':
                _sen_attrs_ids = sensor_attribute.split(',')
                _sen_attrs = SensorAttribute.get_by_id_in(_sen_attrs_ids)
                attrs_ids = [_id.a_id for _id in _sen_attrs]
                _attributes = Attributes.get_by_id_in(attrs_ids)
                return [a.json() for a in _attributes], 200

        if 'grouped' in args:
            grouped = args['grouped']

        if 'harmonising_method' in args:
            harmonising_method = args['harmonising_method']

        if 'per_sensor' in args:
            per_sensor = args['per_sensor']

        if 'freq' in args:
            freq = args['freq']

        if 'method' in args:
            method = args['method']

        if 'predictions' in args:
            predictions = args['predictions']
            if predictions >= 100:
                predictions = 100

        if 'n_predictions' in args:
            n_predictions = args['n_predictions']

        if 'sensorid' in args:
            sensorid = args['sensorid']

        if 'user_id' in args:
            user_id = args['user_id']

        if theme is None and subtheme is None \
            and len(attributes) == 0 and attribute_data is None \
            and sensor is None and sensor_name is None and sensor_attribute is None:
            themes = Theme.get_all()
            return [a.json() for a in themes], 200

        if attribute_data is not None:
            global LIMIT, OFFSET
            data = None
            operation = None
            if 'limit' in args and args['limit'] is not None:
                LIMIT = args['limit']

            if 'offset' in args and args['offset'] is not None:
                OFFSET = args['offset']

            if 'operation' in args and args['operation'] is not None:
                operation = args['operation']

            if ('fromdate' in args and args['fromdate'] is not None 
                and 'todate' in args and args['todate'] is not None):
                if grouped:
                    if harmonising_method:
                        data = self.get_attribute_data(attribute_data, LIMIT, OFFSET,
                                                       args['fromdate'], args['todate'],
                                                       operation)
                        data = request_harmonised_data(data,
                                                       harmonising_method=harmonising_method)
                    else:
                        data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, 
                                                args['fromdate'], args['todate'], operation)
                        data = request_grouped_data(data, per_sensor=per_sensor, freq=freq, method=method)
                else:
                    data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, 
                                                args['fromdate'], args['todate'], operation)
                if predictions:
                    prediction_task = self.get_predictions.apply_async(args=(
                            data[0]["Attribute_Table"], sensorid,
                            n_predictions, user_id))

                    data.append({"message": "Forecasting engine making "
                                            "predictions",
                                "task_id": str(prediction_task.id)})
            else:
                if grouped:
                    if harmonising_method:
                        data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, operation=operation)
                        data = request_harmonised_data(data, harmonising_method=harmonising_method)
                    else:
                        data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, operation=operation)
                        data = request_grouped_data(data, per_sensor=per_sensor, freq=freq, method=method)
                else:
                    data = self.get_attribute_data(attribute_data, LIMIT, OFFSET, operation=operation)

                if predictions:
                    #### Ceck for data
                    if data[0]["Total_Records"] != 0:
                    #### Check for non numeric data
                        if is_number(data[0]["Attribute_Values"][0]["Value"]):
                            prediction_task =  \
                            self.get_predictions.apply_async(args=(
                                data[0]["Attribute_Table"], sensorid,
                                n_predictions, user_id))

                            data.append(
                                {"message": "Forecasting engine making "
                                            "predictions",
                                "task_id": str(prediction_task.id)})
                        else:
                            data.append({"message":"Cannot predict "
                                                   "non-numeric data"})
                    else:
                        pass
            return data, 200

        if attributes:
            _attrs = []
            attr = Attributes.get_by_name_in(attributes)
            for a in attr:
                _attrs.append(a.json())
            return _attrs, 200

        if subtheme is not None and subtheme != '':
            attributes = Attributes.get_by_sub_theme_id(subtheme)
            return [a.json() for a in attributes], 200

        if theme is not None and theme != '':
            subthemes = SubTheme.get_by_theme_id(theme)
            return [a.json() for a in subthemes], 200

        return {
            "error": "error occured while processing request"
        }, 400


    '''
    @Params
        attribute_name: is string passed as parameter with the URL
        limit: Default is 30, number of records to be returned
        offset: From where the records needs to start
        Filters:
            fromdate: Format for passing date is YYYY-MM-DD
            todate: Format for the passing the is YYYY-MM-DD
        operation: Mathematical operations that can be performed on data
                    accepted values are: 'mean', 'median', 'sum'
                    (More to be added)
    '''
    def get_attribute_data(self, attribute_name, limit, offset,
                            fromdate=None, todate=None, operation=None):
        # clearing previous metadata
        db.metadata.clear()
        attrs = attribute_name.split(',')

        attributes = Attributes.get_by_name_in(attrs)
        data = []
        for attribute in attributes:
            model = ModelClass(attribute.table_name.lower())
            count = db.session.query(model).count()
            values = []
            if fromdate is not None and todate is not None:
                if operation is None:

                    values = db.session.query(model) \
                            .filter(model.api_timestamp >= fromdate) \
                            .filter(model.api_timestamp <= todate) \
                            .limit(limit).all() 
                            

                    #.offset(abs(count - offset)) 
                else:
                    values = db.session.query(model) \
                            .filter(model.api_timestamp >= fromdate) \
                            .filter(model.api_timestamp <= todate) \
                            .all()
            else:
                if operation is None:
                    db.metadata.clear()
                    ### refactored the query to fetch the latest values by default
                    values = db.session.query(model).order_by(sqlalchemy.desc(
                        model.api_timestamp)).limit(limit).all() # \
                    # values = db.session.query(model).limit(limit) \
                    #                 .offset(abs(count - offset)).all()

                else:
                    values = db.session.query(model).all()

            _common = {
                    'Attribute_Table': attribute.table_name,
                    'Attribute_id': attribute.id,
                    'Attribute_Name': attribute.name,
                    'Attribute_Description': attribute.description,
                    'Attribute_Unit_Description': Unit.get_by_id(attribute.unit_id).description,
                    'Attribute_Unit_Value': Unit.get_by_id(attribute.unit_id).symbol,
                    'Total_Records': count
                    }
            temp = []
            if operation is None:
                for i in range(len(values)-1, -1, -1):
                    s = Sensor.get_by_id(values[i].s_id)
                    temp.append({
                        'Attribute_Name': attribute.name,
                        'Attribute_id': attribute.id,
                        'Sensor_id': values[i].s_id,
                        'Timestamp': str(values[i].api_timestamp),
                        'Value': values[i].value,
                        'Name': s.name,
                        'Latitude': Location.get_by_id(s.l_id).lat,
                        'Longitude': Location.get_by_id(s.l_id).lon
                    })
                _common['Attribute_Values'] = temp
            else:
                _values = [v.value for v in values]
                _int_values = list(map(float, _values))
                _operation_result = 0
                if operation == 'sum':
                    _operation_result = sum(_int_values)
                elif operation == 'mean':
                    _operation_result = sum(_int_values) / len(_int_values)
                elif operation == 'median':
                    _operation_result = statistics.median(_int_values)
                _common['Result_' + operation] = _operation_result
            data.append(_common)

        return data


    '''
        @Params
            attribute_table: is string passed as parameter with the URL
            sensor_id: is string passed as parameter with the URL
            
    '''
    @celery.task(bind=True)
    def get_predictions(self, attribute_table: str, sensor_id: str, n_pred:
    int , u_id: int) -> dict:
        """
        Generate time series predictions or retrieve a time series 
        from database if the corresponding predictions have been cached.
        
        :param attribute_table: the name of the table that will be used 
        during the prediction process
        :param sensor_id: the id of the sensor on which predictions will be 
        made. Set to "All sensors" if predictions are to be made using all 
        the sensors from the attribute_table
        :param n_pred: the number of predictions to be made
        :param u_id: the users id found in the Users table
        :return: a dictionary containing the predicted values with their 
        corresponding time stamps 
        """
        db.metadata.clear()

        _data = []
        _timestamps = []
        _limit = 10000

        model = ModelClass(attribute_table.lower())

        if db.session.query(model).count() < 100:
            pred_data ={"status": "not enough data to make reliable  "
                                "predictions", "result" : "UNABLE"}
            celery_logger.error("{} for args attr_table={}, sensor_id={}, "
                                "n_pred={} ".format(pred_data["status"],
                                                    attribute_table,
                                                    sensor_id, n_pred))
            self.update_state(state="REFUSED",
                              meta={'status': pred_data["status"]})
            raise Ignore()
        else:
        # check for sensor_id
            if sensor_id:
                values = db.session.query(model) \
                            .filter(model.s_id == sensor_id) \
                            .limit(_limit) \
                            .all()
                if len(values) < 100:
                    pred_data = {"status": "not enough sensor data to make "
                                           "reliable predictions",
                                 "result":"UNABLE"}
                    celery_logger.error(
                        "{} for args attr_table={}, sensor_id={}, "
                        "n_pred={} ".format(pred_data["status"],
                                            attribute_table,
                                            sensor_id, n_pred))
                    self.update_state(state="REFUSED",
                                      meta={'status': pred_data["status"]})
                    raise Ignore()
            else:    
                values = db.session.query(model) \
                            .limit(_limit) \
                            .all()
                if len(values) < 100:
                    pred_data = {"status": "not enough data to make reliable"
                                            "predictions", "result": "UNABLE"}
                    celery_logger.error(
                        "{} for args attr_table={}, sensor_id={}, "
                        "n_pred={} ".format(pred_data["status"],
                                            attribute_table, sensor_id,
                                            n_pred))
                    self.update_state(state="REFUSED",
                                      meta={'status': pred_data["status"]})
                    raise Ignore()

            if not Users.find_by_id(u_id):
                pred_data = {
                    "status": "user id {} does not exists".format(u_id),
                    "result": "UNABLE"
                    }
                self.update_state(state="REFUSED",
                                  meta={'status': pred_data["status"]})
                celery_logger.error(pred_data["status"])
                raise Ignore()
            else:
                self.update_state(state='PROGRESS',
                                  meta={'status': "prediction task is in progress"})

                for val in values:
                    _data.append(float(val.value))
                    _timestamps.append(val.api_timestamp)

                predict_from_db = PredictionResults.find_by_prediction_args(
                    attribute_table, sensor_id, n_pred)

                if predict_from_db:
                    existing_user_result = UserPredictions.get_entry(u_id,
                                                               predict_from_db.id)

                    if existing_user_result and predict_from_db.is_stale(model):
                        existing_user_result.delete()
                        existing_user_result.commit()

                        if not UserPredictions.find_by_pred_id(predict_from_db.id):
                            predict_from_db.delete()
                            predict_from_db.commit()

                        result = PredictionResults.generate_predictions_results(
                            attribute_table, sensor_id, n_pred, _data, _timestamps)
                        UserPredictions.add_entry(u_id, result["Prediction_id"])

                    else:
                        # use a cached result
                        predict_from_db.updated_timestamp = datetime.now()
                        predict_from_db.save()
                        predict_from_db.commit()
                        UserPredictions.add_entry(u_id, predict_from_db.id)

                        result = {
                            "Sensor_id": predict_from_db.sensor_id,
                            "Forcasting_engine": predict_from_db.forcasting_engine,
                            "Mean_Absolute_Percentage_Error":
                                predict_from_db.mean_absolute_percentage_error,
                            "Prediction_id": predict_from_db.id,
                            "Predictions": predict_from_db.result
                        }
                else:

                    result = PredictionResults.generate_predictions_results(
                        attribute_table, sensor_id, n_pred, _data, _timestamps)

                    UserPredictions.add_entry(u_id, result["Prediction_id"])

                pred_data = {"status": "task complete", "result": result}

        return pred_data

        
class PredictionStatus(Resource):
    """
    API Resource class. Check the status of asynchronous prediction tasks
    """

    parser = reqparse.RequestParser()
    parser.add_argument('task_id', type=str, store_missing=False)

    def get(self) -> (dict, int):
        """
        GET method endpoint. Use task_id argument and return state
        and result of the corresponding asynchronous prediction task. If no
        task_id is provided, the state of all executed tasks are returned
        :param task_id: The task_id returned upon request of the prediction task
        """

        args = self.parser.parse_args()
        if "task_id" not in args:
            tasks = subprocess.Popen(["redis-cli", "keys", "*"],
                                    stdout=subprocess.PIPE)
            task_list = str(tasks.communicate()[0].decode("utf8")).split(
                "\n")

            if len(task_list) > 0:
                # remove celery-task-meta prefix from items in task_list
                task_list = [item[17:] for item in task_list if
                             "celery-task-meta-" in item]
                task_id_states = [{"task_id": t_id, "state":
                    RequestForData.get_predictions.AsyncResult(
                        t_id).state} for t_id in task_list]
                response = {"task_states": task_id_states}
            else:
                response = {"task_states": []}
        else:
            task_id = args['task_id']
            task = RequestForData.get_predictions.AsyncResult(task_id)
            if task.state == 'PENDING':
                response = {'state': task.state,
                            'status': 'if PENDING state persists, background task '
                                    'may not be executing'}
            elif task.state == 'FAILURE':
                logger.error("{} celery task was unable to complete because "
                             "of error: {}".format(task_id,
                                                   str(task.info)))
                response = {'state': task.state, 'status': str(task.info)}
                return response, 500
            elif task.state == 'REFUSED':
                logger.error("{} celery task refused to generate prediction "
                             "because: {}".format(task_id, task.info["status"]))
                response = {'state': task.state, 'status': task.info["status"]}
                return response, 403

            else:
                response = {'state': task.state, 'status': task.info.get(
                    'status', '')
                            }
                if 'result' in task.info:
                    response['result'] = task.info['result']

        return response, 200
