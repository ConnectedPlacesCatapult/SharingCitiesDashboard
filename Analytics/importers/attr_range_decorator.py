from datetime import datetime
from typing import Callable, Any

from models.attributes import Attributes
from models.attribute_range import AttributeRange
from app import create_app
from db import db

application = create_app()


def update_attribute_ranges(func: Callable) -> Callable:
    """
    Function decorator, track minimum and maximum value of all attributes
    :param func: Importer function
    :return: Importer function wrapped with minimum and maximum value
             functionality
    """
    def range_wrapper(*args: Any, **kwargs: dict):
        """
        Execute importer function and then compute minimum and maximum
        values of attributes
        :param args: Arguments of func parameter
        :param kwargs: Keyword Arguments of func parameter
        """
        func(*args, **kwargs)

        attribute_entries = Attributes.get_all()
        for attribute in attribute_entries:
            attribute_range = AttributeRange.get_by_attr_id(attribute.id)
            if attribute_range:
                most_recent_entry = Attributes.most_recent_timestamp(
                    attribute.table_name)
                if most_recent_entry:
                    if attribute_range.latest_update < most_recent_entry:
                        attr_min, attr_max = Attributes.attribute_min_max(
                            attribute.table_name)
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
                new_range_entry.save()
                new_range_entry.commit()

    return range_wrapper


