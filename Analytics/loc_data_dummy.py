import pandas as pd

from models.pin_location_data import Tracker, LocationData


def create_trackers(tid):
    tracker = Tracker(tid)
    tracker.save()
    tracker.commit()


def add_location_data(tracker_id, datetime, latitude, longitude, speed, heading, elevation, charger, battery,
                      signalquality, satcnt):
    loc_data = LocationData(tracker_id, datetime, latitude, longitude, speed, heading, elevation, satcnt, 1,
                            signalquality, battery)
    loc_data.save()
    loc_data.commit()


# tracker,description,datetime,latitude,longitude,speed,heading,elevation,charger,battery,signalquality,satcnt
df = pd.read_csv('bike_test_data.csv')

# df.set_index("tracker", inplace=True)
# df.head()
unique_tracker_ids = df["tracker"].unique()
print(unique_tracker_ids)
for tracker_id in unique_tracker_ids:
    print(tracker_id)
    create_trackers(str(tracker_id))

loc_df = df[['tracker', 'datetime', 'latitude', 'longitude', 'speed', 'heading', 'elevation', 'charger', 'battery',
             'signalquality', 'satcnt']]

# for row in loc_df.iterrows():
#     print(row)
# print(unique_tracker_ids)

# df1 = df[['tracker','description']]
# print(df1.to_string())
