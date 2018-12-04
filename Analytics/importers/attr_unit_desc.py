'''
Helper Class
It acts as an helper class to store the information listed in the constructor.
It minimizes the use of variables required to hold the data in BaseImporter class
'''
import sys

class AttributeUnitDescription(object):
    def __init__(self):
        self.attribute = None
        self.unit_value = None
        self.description = None
        self.unit_type = None
        self.sub_theme = None
        self.id = sys.maxsize

    def __repr__(self):
        return 'Attribute Name: %s\n,\
                Unit Value: %s\n,\
                Description: %s\n,\
                Unit Type: %d\n,\
                Sub Theme: %d' % (self.attribute, self.unit_value, self.description, \
                                    self.unit_type, self.sub_theme)

    def __str__(self):
        return 'Attribute Name: %s\n,\
                Unit Value: %s\n,\
                Description: %s\n,\
                Unit Type: %d\n,\
                Sub Theme: %d' % (self.attribute, self.unit_value, self.description, \
                                    self.unit_type, self.sub_theme)