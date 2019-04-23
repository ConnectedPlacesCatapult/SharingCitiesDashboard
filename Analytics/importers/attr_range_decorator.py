from datetime import datetime

from models.attributes import Attributes
from models.attribute_range import AttributeRange
from app import create_app
from db import db

application = create_app()


def update_attribute_ranges(func):

    def range_wrapper(*args, **kwargs):
        func(*args, **kwargs)

        attribute_entries = Attributes.get_all()
        for attribute in attribute_entries:
            attribute_range = AttributeRange.get_by_attr_id(attribute.id)
            if attribute_range:
                most_recent_update = Attributes.most_recent_timestamp(
                    attribute.table_name)
                if attribute_range.latest_update < most_recent_update:
                    attr_min, attr_max = Attributes.attribute_min_max()
                    attribute_range.minimum = attr_min
                    attribute_range.maximum = attr_max
                    attribute_range.last_update = datetime.now()
                    attribute_range.save()
                    attribute_range.commit()

            else:
                attr_min, attr_max = Attributes.attribute_min_max(
                    attribute.table_name)
                new_range_entry = AttributeRange(attribute.id, attr_min,
                                                 attr_max, datetime.now())
                print(new_range_entry.json())
                new_range_entry.save()
                new_range_entry.commit()

    return range_wrapper


