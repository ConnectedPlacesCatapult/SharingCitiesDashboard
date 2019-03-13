import json
import os
from http import HTTPStatus
from typing import Any

import numpy as np
import pandas as pd
from flask import send_from_directory
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse
from geojson import Feature, FeatureCollection, Point

from db import db
from models.location import Location
from models.sensor import Sensor
from models.sensor_attribute import SensorAttribute


class ExportData(Resource):
    """

    """

    def __init__(self) -> None:
        """

        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('file_name', required=True, type=str, help='filename required', location='json')
        self.reqparser.add_argument('table_name', required=True, type=str, help='table_name required', location='json')
        self.reqparser.add_argument('format', required=True, type=str, help='format required', location='json')
        self.reqparser.add_argument('limit', required=False, type=int, default=100, location='json')

    @jwt_required
    def post(self):
        """

        :return:
        :rtype:
        """

        args = self.reqparser.parse_args()
        if len(args["file_name"]) < 1:
            return {"error": "Invalid file name", "file_name": args['file_name']}, HTTPStatus.BAD_REQUEST

        data_frame = self.fetch_table_entries_by_name(args['table_name'], args['limit'])

        # if not data_frame:
        #     return {"msg": "No Data found", "table_name": args['table_name']}, HTTPStatus.NOT_FOUND

        if self.create_file(data_frame, args["file_name"], args["format"]):
            return self.return_file(args["file_name"], args["format"])

        return {"error": "Failed to Convert Data to File"}, HTTPStatus.BAD_REQUEST

    def create_file(self, data_frame, file_name, extension):
        if extension.lower() == 'json':
            return self.write_to_json(data_frame, file_name, extension)
        elif extension.lower() == 'geojson':
            return self.write_geojson(data_frame, file_name, extension)

        return self.write_to_csv(data_frame, file_name, extension)

    def query_database(self, prepared_statement: str):
        """
        Query Database with prepared statements
        :param prepared_statement:
        :type prepared_statement:
        :return:
        :rtype:
        """
        try:
            results = db.engine.execute(prepared_statement)
            return results
        except Exception as e:
            print(e)
            return None

    def get_column_names(self, table_name: str) -> [str]:
        """
        Get column names from database table
        :param table_name: Name of database table
        :type table_name: str
        :return: A list of column names
        """
        query_schema = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'{}';".format(table_name)
        columns = self.query_database(query_schema)
        return [column[0] for column in columns]

    def fetch_table_entries_by_name(self, table_name: str, limit: int) -> pd.DataFrame:
        """
        Fetch entries from database table
        :param table_name: Name of database table
        :type table_name: str
        :param limit: Limit the number of entries
        :type limit: int
        :return: A Query result set
        :rtype:
        """
        column_names = self.get_column_names(table_name)
        query_entries = "SELECT * FROM {} LIMIT {};".format(table_name, limit)
        entries = self.query_database(query_entries)

        if not entries or not column_names:
            return None

        data_frame = self.frame_data(column_names, entries)

        sensors = [self.get_sensor(sensor_id) for sensor_id in data_frame['s_id']]

        sensor_data_frame = pd.DataFrame.from_dict(sensors)

        data_frame = pd.merge(sensor_data_frame, data_frame, left_on='id', right_on='s_id', how='inner').drop('id',
                                                                                                              axis=1)
        return data_frame

    def write_to_csv(self, data_frame: pd.DataFrame, file_name: str, extension: str):
        """
        Write data to csv file for export
        :param data_frame:
        :type data_frame:
        :param file_name:
        :type file_name:
        :param extension:
        :type extension:
        :return:
        :rtype:
        """
        directory = os.path.dirname(os.path.realpath(__file__)) + "/"
        try:
            data_frame.to_csv(directory + file_name + "." + extension, sep=',', encoding='utf-8')
            return True
        except Exception:
            return False

    def get_sensor(self, sensor_id: str) -> {str: Any}:
        """
        Get Sensor entry from database
        :param sensor_id:
        :type sensor_id:
        :return:
        :rtype:
        """
        sensor_entry = {}

        sensor = Sensor.get_by_id(sensor_id)
        if sensor:
            sensor_entry['id'] = sensor.id
            sensor_entry['name'] = sensor.name
            attr_sensor = SensorAttribute._get_by_sid_aid(str(sensor_id), str(sensor.a_id))
            if attr_sensor:
                sensor_entry['a_id'] = attr_sensor.a_id
            else:
                sensor_entry['a_id'] = None

            location = self.get_location(sensor.l_id)
            sensor_entry['latitude'] = location.lat if location else np.nan
            sensor_entry['longitude'] = location.lon if location else np.nan
            return sensor_entry
        return {'id': sensor_id, 'name': "", 'latitude': np.nan, 'longitude': np.nan, 'a_id': None}

    def get_location(self, location_id: id):
        """
        Get Sensor location data from database
        :param location_id:
        :type location_id:
        :return:
        :rtype:
        """
        location = Location.get_by_id(location_id)
        if location:
            return location

        return None

    def frame_data(self, column_names, entries):
        """
        Create Pandas DataFrame
        :param column_names:
        :type column_names:
        :param entries:
        :type entries:
        :return:
        :rtype:
        """
        if not column_names or not entries:
            return None

        data_frame = pd.DataFrame.from_records(entries, columns=column_names)
        return data_frame

    def write_to_json(self, data_frame: pd.DataFrame, file_name: str, extension: str):
        """
        Write Pandas DataFrame to File in JSON format
        :param data_frame:
        :type data_frame:
        :param file_name:
        :type file_name:
        :param extension:
        :type extension:
        :return:
        :rtype:
        """
        try:
            directory = os.path.dirname(os.path.realpath(__file__)) + "/"
            output = data_frame.to_json(orient='records')
            with open(directory + file_name + "." + extension, 'w') as outfile:
                outfile.write(output)
            return True
        except Exception as e:
            print(e)
            return False

    def write_geojson(self, data_frame: pd.DataFrame, file_name: str, extension: str):
        """
        Write Pandas DataFrame to File in GEOJSON format
        :param data_frame:
        :type data_frame:
        :param file_name:
        :type file_name:
        :param extension:
        :type extension:
        """
        try:
            directory = os.path.dirname(os.path.realpath(__file__)) + "/"
            file = directory + file_name + "." + extension
            # columns used for constructing geojson object
            features = data_frame.apply(
                lambda row: Feature(geometry=Point((float(row['longitude']), float(row['latitude'])))),
                axis=1).tolist()

            # all the other columns used as properties
            properties = data_frame.drop(['latitude', 'longitude', 'timestamp', 'api_timestamp'], axis=1).to_dict(
                'records')

            # whole geojson object
            feature_collection = FeatureCollection(features=features, properties=properties)

            with open(file, 'w', encoding='utf-8') as f:
                json.dump(feature_collection, f, ensure_ascii=False)

            return True
        except Exception:
            return False

    def return_file(self, file_name: str, extension: str) -> object:
        """
        Return File in Response
        :param file_name: Name of file to return
        :type file_name: str
        :param extension: The File extension
        :type extension: str
        :return: Response with correct headers to download file
        :rtype: flask.wrappers.Response
        """
        file = file_name + "." + extension
        response = send_from_directory(directory=os.path.dirname(os.path.realpath(__file__)), filename=file)
        response.headers['Content-Type'] = 'application/octet-stream'
        response.headers['Content-Disposition'] = 'attachment; filename="{}.{}"'.format(file_name, extension)
        print(type(response))
        return response
