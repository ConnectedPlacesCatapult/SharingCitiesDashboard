import logging
import os
from datetime import datetime
from http import HTTPStatus
from typing import Any

import geojson
import numpy as np
import pandas as pd
from flask import send_from_directory, after_this_request
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import reqparse

from db import db
from models.location import Location
from models.sensor import Sensor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ExportData(Resource):
    """
    Export data to file endpoint
    """

    def __init__(self) -> None:
        """
        Set up reqparser
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('file_name', required=True, type=str, help='filename required', location='json')
        self.reqparser.add_argument('table_name', required=True, type=str, help='table_name required', location='json')
        self.reqparser.add_argument('format', required=True, type=str, help='format required', location='json')
        self.reqparser.add_argument('directory', required=False, type=str,
                                    default=os.path.dirname(os.path.realpath(__file__)), location='json')
        self.reqparser.add_argument('limit', required=False, type=int, default=100, location='json')

    @jwt_required
    def post(self) -> ({str: Any}, HTTPStatus):
        """
        Export data to file endpoint
        :param file_name: Name of the file to export data yo
        :param table_name: Table name to retrieved data
        :param format: Format of the exported file
        :param limit: Maximum number of entries to retrieve for export
        :return: On success, a file containing the requested data otherwise an error message and the appropriate HTTP
                 response
        """

        args = self.reqparser.parse_args()

        if len(args["file_name"]) < 1:
            return {"error": "Invalid file name", "file_name": args['file_name']}, HTTPStatus.BAD_REQUEST

        # Fetch Data Table
        sql_statement = "SELECT * FROM {} LIMIT {};".format(args['table_name'], args['limit'])
        df_rsql = pd.read_sql(sql_statement, con=db.engine)

        # Fetch sensor details for data readings
        sensors = [self.get_sensor(sensor_id) for sensor_id in df_rsql['s_id']]
        sensor_data_frame = pd.DataFrame(sensors)

        # Correlate sensor details with data reading
        sensor_data_frame.rename(index=str, columns={'id': 's_id'}, inplace=True)
        df_rsql.reset_index()
        sensor_data_frame.reset_index()
        data_frame = df_rsql.merge(sensor_data_frame, on='s_id').drop_duplicates()

        # Create export file and return response
        if self.create_file(data_frame, args["file_name"], args["directory"], args["format"]):
            return self.return_file(args["file_name"], args["format"])

        # If this line is reach exporting of file failed
        return {"error": "Failed to Convert Data to File"}, HTTPStatus.BAD_REQUEST

    def create_file(self, data_frame: pd.DataFrame, file_name: str, directory: os.path, extension: str) -> bool:
        """
        Create File for export
        :param data_frame: Pandas DataFrame to export to file
        :param file_name: Name of the file to export to
        :param directory: Absolute path to create file
        :param extension: File's extension
        :return: True on success, False on failure
        """
        if extension.lower() == 'json':
            return self.write_to_json(data_frame, file_name, directory, extension)
        elif extension.lower() == 'geojson':
            return self.write_geojson(data_frame, file_name, directory, extension)
        return self.write_to_csv(data_frame, file_name, directory, extension)

    def get_sensor(self, sensor_id: str) -> {str: Any}:
        """
        Get Sensor entry from database
        :param sensor_id: Sensors identification number
        :return: A dictionary of the Sensor entries with the column name as keys and the value as values
        """
        sensor_entry = {}

        sensor = Sensor.get_by_id(sensor_id)
        if sensor:
            sensor_entry['id'] = sensor.id
            sensor_entry['name'] = sensor.name
            sensor_entry['a_id'] = sensor.name
            location = self.get_location(sensor.l_id)
            sensor_entry['latitude'] = location.lat if location else np.nan
            sensor_entry['longitude'] = location.lon if location else np.nan
            return sensor_entry
        return {'id': sensor_id, 'name': "", 'a_id': None, 'latitude': np.nan, 'longitude': np.nan}

    @staticmethod
    def get_location(location_id: int) -> db.Model:
        """
        Get Sensor location data from database
        :param location_id: Location identification number
        :return: Location db entry
        """
        location = Location.get_by_id(location_id)
        if location:
            return location

        return None

    @staticmethod
    def write_to_csv(data_frame: pd.DataFrame, file_name: str, directory: os.path, extension: str) -> bool:
        """
        Write data to csv file for export
        :param directory: Absolute path to create file
        :param data_frame: Pandas DataFrame of data
        :param file_name: Name of the file to save csv to
        :param extension: File extension
        :return: If exporting data to file is successful True is returned, otherwise False
        """
        file = os.path.join(directory, file_name + "." + extension)
        try:
            data_frame.to_csv(file, sep=',', encoding='utf-8', index=False)
            return True
        except Exception as e:
            logger.error("Error writing to csv", e)
            return False

    @staticmethod
    def write_to_json(data_frame: pd.DataFrame, file_name: str, directory: os.path, extension: str) -> bool:
        """
        Write Pandas DataFrame to File in JSON format
        :param data_frame: Panadas Dataframe of Data to be exported
        :param file_name: File name to export data to
        :param directory: Absolute path to create file
        :param extension:   File extension
        :return: True if the data is exported successfully otherwise, False
        """
        try:
            file = os.path.join(directory, file_name + "." + extension)
            output = data_frame.to_json(orient='records')
            with open(file, 'w') as outfile:
                outfile.write(output)
            return True
        except Exception as e:
            logger.error("Error writing to json file", e)
            return False

    @staticmethod
    def properties_dict(df: pd.DataFrame, column_names: str) -> dict:
        """
        Create Properties Dictionary for GEOJSON entry
        :param df: Panadas Dataframe of Data to export
        :param column_names: DataFrame Column Names
        :return: Dictionary of GEOJSON properties
        """

        properties = {col_name: df[col_name] for col_name in column_names
                      if col_name != "longitude" and col_name != "latitude"}

        for key, value in properties.items():
            if isinstance(value, pd.Timestamp) or isinstance(value, datetime):
                try:
                    properties[key] = str(properties[key])
                except ValueError:
                    properties[key] = ""

        return properties

    @staticmethod
    def write_geojson(data_frame: pd.DataFrame, file_name: str, directory: os.path, extension: str) -> bool:
        """
        Write Pandas DataFrame to File in GEOJSON format
        :param data_frame: Panads DataFrame to export
        :param file_name: File name
        :param directory: Absolute path to create file
        :param extension: File extension
        :return: True if the data is exported successfully otherwise, False
        """

        columns_names = data_frame.columns

        try:

            file = os.path.join(directory, file_name + "." + extension)
            features = []
            insert_features = lambda df: features.append(
                geojson.Feature(geometry=geojson.Point((df["longitude"], df["latitude"])),
                                properties=ExportData.properties_dict(df, columns_names)
                                ))

            data_frame.apply(insert_features, axis=1)
            with open(file, 'w', encoding='utf8') as fp:
                geojson.dump(geojson.FeatureCollection(features), fp, sort_keys=True, ensure_ascii=False)

            return True
        except Exception as e:
            logger.error("Error writing GEOJSON data to file", e)
            return False

    @staticmethod
    def return_file(file_name: str, extension: str) -> Any:
        """
        Return File in Response
        :param file_name: Name of file to return
        :param extension: The File extension
        :return: Response with correct headers to download file
        """
        file = file_name + "." + extension
        directory = os.path.dirname(os.path.realpath(__file__))

        response = send_from_directory(directory=directory, filename=file)
        response.headers['Content-Type'] = 'application/octet-stream'
        response.headers['Content-Disposition'] = 'attachment; filename="{}.{}"'.format(file_name, extension)

        @after_this_request
        def send_and_remove_file(response) -> Any:
            """
             Return file response and Cleanup temporary files
            :param response: HTTP response to prompt browser to download file attached
            :return: HTTP response with file attachment
            """
            try:
                os.remove(directory + '/' + file_name + "." + extension)
            except Exception as error:
                logger.error("Error removing temp file", error)

            return response

        return response
