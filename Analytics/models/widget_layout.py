from db import db
from sqlalchemy.exc import IntegrityError


class Layouts(db.Model):
    """
        Database model for the layouts table used to persist widget layout data

        :param widgetID:    The widget identification the layout belongs to
        :param x:           x coordinate of the widget layout
        :param y:           y coordinate of the widget layout
        :param h:           height of the widget layout
        :param w:           width of the widget layout
        :param static:      layout static property

        :type widgetID: String
        :type x:        Integer
        :type y:        Integer
        :type h:        Integer
        :type w:        Integer
        :type static:   String

    """
    __tablename__ = 'layouts'

    id = db.Column('id', db.Integer, primary_key=True)
    widget_id = db.Column('widget_id', db.Integer, nullable=True)
    x_coord = db.Column('x', db.Integer, nullable=False)
    y_coord = db.Column('y', db.Integer, nullable=False)
    height = db.Column('h', db.Integer, nullable=False)
    width = db.Column('w', db.Integer, nullable=False)
    static = db.Column('static', db.Boolean, nullable=False)

    def __init__(self, widget_id, x, y, height, width, static):
        self.widget_id = widget_id
        self.x_coord = x
        self.y_coord = y
        self.height = height
        self.width = width
        self.static = static

        # Check if tables exsists
        self.create_table()

        super().__init__()

    def __str__(self):
        return self.json()

    def json(self):
        return {
            'id': str(self.widget_id),
            'x': self.x_coord,
            'y': self.y_coord,
            'h': self.height,
            'w': self.width,
            'static': self.static
        }

    def create_table(self):

        """ creates layout db table if it does not exist """

        if not self.table_exists():  # If table don't exist, Create.
            # Create a table with the appropriate Columns
            db.Table('layouts', db.MetaData(bind=db.engine),
                        db.Column('id', db.Integer, primary_key=True),
                        db.Column('widget_id', db.Integer, nullable=True),
                        db.Column('x', db.Integer, nullable=False),
                        db.Column('y', db.Integer, nullable=False),
                        db.Column('h', db.Integer, nullable=False),
                        db.Column('w', db.Integer, nullable=False),
                        db.Column('static', db.Boolean, nullable=False),
                        schema=None).create()

    def save(self):
        """ Adds object instance to the db session to be commited"""
        try:
            db.session.add(self)
            db.session.flush()
        except IntegrityError as ie:
            db.session.rollback()

    def commit(self):
        """ save changes to the database"""
        db.session.commit()

    def delete(self):
        """ Delete object instance from the db session to be commited"""
        try:
            db.session.delete(self)
        except IntegrityError as ie:
            db.session.rollback()

    @classmethod
    def get_layout_by_widget_id(cls, widgetID):
        """
            fetch layout instance using the widgets id from database
            :param widgetID: the identification number of the widget related to the layout to fetch
            :type Integer:

            :returns: on success a layout instance is return otherwise None
            :rtype <class 'Layouts'>:

        """
        return cls.query.filter_by(id=widgetID).first()






