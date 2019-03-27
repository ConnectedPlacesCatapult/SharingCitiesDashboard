import pandas as pd
from flask_restful import Resource
from flask_restful import reqparse

from models.pin_location_data import Tracker, LocationData


class GetDummyData(Resource):
    """
    Create a new Theme entry in the database
    """

    def __init__(self) -> None:
        """
        Sets the required arguments to be in the POST request
        """
        self.reqparser = reqparse.RequestParser()
        self.t_ids = []

    def post(self):
        df = pd.read_csv('bike_test_data.csv')
        unique_tracker_ids = df["tracker"].unique()
        for tracker_id in unique_tracker_ids:
            self.t_ids.append(self.create_trackers(str(tracker_id)))

        loc_df = df[
            ['tracker', 'datetime', 'latitude', 'longitude', 'speed', 'heading', 'elevation', 'charger', 'battery',
             'signalquality', 'satcnt']]
        loc_df = loc_df.dropna()
        for index, row in loc_df.iterrows():
            self.add_location_data(row['tracker'], row['datetime'], row['latitude'], row['longitude'], row['speed'],
                                   row['heading'], row['elevation'], row['charger'], row['battery'],
                                   row['signalquality'],
                                   row['satcnt'])

        return "", 204

    def create_trackers(self, tid):
        tracker = Tracker(tid)
        tracker.save()
        tracker.commit()
        return tid

    def add_location_data(self, tracker_id, datetime, latitude, longitude, speed, heading, elevation, charger, battery,
                          signalquality, satcnt):

        loc_data = LocationData(tracker_id, datetime, latitude, longitude, speed, heading, elevation, satcnt, 1,
                                signalquality, battery)
        loc_data.save()
        loc_data.commit()

# tracker,description,datetime,latitude,longitude,speed,heading,elevation,charger,battery,signalquality,satcnt


# df.set_index("tracker", inplace=True)
# df.head()
# unique_tracker_ids = df["tracker"].unique()
# print(unique_tracker_ids)
# for tracker_id in unique_tracker_ids:
#     print(tracker_id)
#     create_trackers(str(tracker_id))


# for row in loc_df.iterrows():
#     print(row)
# print(unique_tracker_ids)

# df1 = df[['tracker','description']]
# print(df1.to_string())
