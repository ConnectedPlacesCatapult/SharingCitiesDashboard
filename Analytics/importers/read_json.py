import json
from models.location import Location

class ReadJson(object):
    def __init__(self, tag, location):
        self.tag = tag 
        self.location = location


    '''
    What if the value of the sensor is a list of values 
    How do we approach to save that, as below code only 
    support scalar values and database also currently 
    supports scalar values
    '''
    def get_sensor_by_tag_name(self, data, values):
        if isinstance(data, dict):
            lat = lon = -1
            temp = None
            for key in data:
                if isinstance(data[key], dict):
                    self.get_values_by_tag_name(data[key], values)
                elif isinstance(data[key], list):
                    self.get_values_by_tag_name(data[key], values)
                else:
                    if key == self.tag:
                        temp = data[key]
                    elif key == self.location[0]:
                        lat = float(data[key])
                    elif key == self.location[1]:
                        lon = float(data[key])

                    if temp is not None and lat != -1 and lon != -1:
                        values[temp] = Location(lat, lon)
                        temp = None
                        lat = lon = -1

        elif isinstance(data, list):
            for key in data:
                if isinstance(key, dict):
                    self.get_values_by_tag_name(key, values)
                elif isinstance(key, list):
                    self.get_values_by_tag_name(key, values)

    def get_location_by_tag_names(self, data, values):
        if isinstance(data, dict):
            lat = lon = -1
            for key in data:
                if isinstance(data[key], dict):
                    self.get_values_by_tag_name(data[key], values)
                elif isinstance(data[key], list):
                    self.get_values_by_tag_name(data[key], values)
                else:
                    if key == self.location[0]:
                        lat = float(data[key])
                    elif key == self.location[1]:
                        lon = float(data[key])

                    if lat != -1 and lon != -1:
                        values.append(Location(lat, lon))
                        lat = lon = -1

        elif isinstance(data, list):
            for key in data:
                if isinstance(key, dict):
                    self.get_values_by_tag_name(key, values)
                elif isinstance(key, list):
                    self.get_values_by_tag_name(key, values)

    def get_values_by_tag_name(self, data, values):
        if isinstance(data, dict):
            for key in data:
                if isinstance(data[key], dict):
                    self.get_values_by_tag_name(data[key], values)
                elif isinstance(data[key], list):
                    self.get_values_by_tag_name(data[key], values)
                else:
                    if key == self.tag:
                        values.add(data[key])
                        

        elif isinstance(data, list):
            for key in data:
                if isinstance(key, dict):
                    self.get_values_by_tag_name(key, values)
                elif isinstance(key, list):
                    self.get_values_by_tag_name(key, values)



