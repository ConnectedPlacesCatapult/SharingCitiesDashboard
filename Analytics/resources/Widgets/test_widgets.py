import copy
import json
from typing import NoReturn

from db import db
from models.widget import WidgetModel
from models.widget_layout import Layouts
from resources.Widgets.widget_test_dependencies import TestDependencies

dependencies = None


def setup_module() -> NoReturn:
    """
    Setup the dependencies need for the tests.
    + Sets up FlaskClient
    + Creates an admin user
    + Logs in admin user
    + Makes Authorization header with JWT token
    + Provides helper functions for tests
    """
    global dependencies
    dependencies = TestDependencies()


def teardown_module() -> NoReturn:
    """
    Tears down the dependencies need for the tests.
    + Removes all widgets and layouts from the database created for the tests
    + Logs out admin user
    + Removes admin user
    + Pops flask test client
    """
    global dependencies
    dependencies.clean_up()


def test_widget_model() -> NoReturn:
    """
    Tests that widget data can be persisted and fetched from the database
    """
    # Create a Layout instance required for Widget
    dummy_layout = Layouts(-1, 5, 4, 3, 2, True)
    # Persist a Widget to the database
    new_widget = WidgetModel(dependencies.user.id, dummy_layout, dependencies.get_widget_data())
    db.session.add(new_widget)
    # Flush session to get Widgets Id for the layout
    db.session.flush()
    dummy_layout.widget_id = new_widget.id
    db.session.commit()
    # Fetch widget from database and check they are the same instance
    fetched_widget = WidgetModel.get_widget_by_id(new_widget.id)
    assert fetched_widget is new_widget
    assert fetched_widget.layout is new_widget.layout


def test_create_widget_endpoint() -> NoReturn:
    """
    Tests the '/widgets/create_widget' endpoint
    Creates a widget with the endpoint [post method]. If successful a http status code of 200 (OK) is returned with
    a message 'Widget with id: <widgetID> saved'. An assertion check is done on the status code returned for equality to
    200
    """
    global dependencies
    print(dependencies.user.id)
    response = dependencies.client.post('/widgets/create_widget', json=dependencies.get_widget_data(),
                                        headers=dependencies.auth_header,
                                        follow_redirects=True)
    assert response.status_code == 200
    print(response.get_json())


def test_list_all_widgets_endpoint() -> NoReturn:
    """
    Test the /widgets/load_widgets' endpoint. Dummy widgets are created and persisted to the database and then fetched
    using the endpoint. An assertion for equallity is performed on the status code returned for 200
    """
    global dependencies
    dependencies.make_dummy_widgets(5)
    response = dependencies.client.post('/widgets/load_widgets',
                                        json={'userID': str(dependencies.user.id), 'limit': 10},
                                        headers=dependencies.auth_header, follow_redirects=True)
    assert response.status_code == 200


def test_delete_widget_endpoint() -> NoReturn:
    """
    Tests the '/widgets/load_widgets' endpoint. Dummy widgets are created and persisted to the database. The dummy
    widgets are then deleted and the status code is checked. The number of dummy widgets created and delete are tracked
    and checked at the end of the test.
    """
    global dependencies
    number_of_widgets = 5
    widget_ids = dependencies.make_dummy_widgets(number_of_widgets)
    for id in widget_ids:
        response = dependencies.client.post('/widgets/load_widgets',
                                            json={'userID': str(dependencies.user.id), 'widgetID': str(id)},
                                            headers=dependencies.auth_header, follow_redirects=True)

        if response.status_code == 200:
            number_of_widgets -= 1
            assert True

    assert number_of_widgets == 0


def test_create_widget_endpoint_no_data() -> NoReturn:
    """
    Tests the '/widgets/create_widget' sends the correct status code 400 when no widget data is sent
    """
    global dependencies
    print(dependencies.user.id)
    response = dependencies.client.post('/widgets/create_widget', json={},
                                        headers=dependencies.auth_header,
                                        follow_redirects=True)
    assert response.status_code == 400


def test_save_layouts_endpoints() -> NoReturn:
    """
    Tests the '/widgets/save_layouts' endpoint. The test checks the end point modifies the layout in the database
    """
    global dependencies
    # Create dummy widgets for test
    number_of_widgets = 5
    widget_ids = dependencies.make_dummy_widgets(number_of_widgets)
    # Create templates for new layout data
    layouts_data = {"layouts": []}
    layout_template = {"id": -1, "x": 0, "y": 0, "h": 0, "w": 0, "static": ""}

    # Bind the user to the database session but storing an instance of the user to keep user object from expiring
    dependencies.user.id
    for widget_id in widget_ids:
        new_layout = copy.deepcopy(layout_template)
        new_layout["id"] = widget_id
        new_layout["x"] = widget_id
        new_layout["y"] = widget_id
        new_layout["h"] = widget_id
        new_layout["w"] = widget_id
        new_layout["static"] = "true"
        layouts_data["layouts"].append(new_layout)
    json_layout = json.dumps(layouts_data)
    response = dependencies.client.post('/widgets/save_layouts', json=json.loads(json_layout),
                                        headers=dependencies.auth_header,
                                        follow_redirects=True)

    assert response.status_code == 200
    # Check layout changed for each widget
    for widget_id in widget_ids:
        widget = WidgetModel.get_widget_by_id(widget_id)
        if widget:
            layout = widget.layout
            assert layout.x_coord == widget_id
            assert layout.y_coord == widget_id
            assert layout.height == widget_id
            assert layout.width == widget_id
            assert layout.static
