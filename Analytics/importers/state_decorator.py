import json
from typing import Any, Callable, TypeVar

State = TypeVar('State')


class Event(object):
    """
    Handle Event registration and notification using callbacks
    """

    def __init__(self):
        """
        Instantiate Event
        """
        self.callbacks = []

    def notify(self, status: Any, *args: Any, **kwargs: {str: Any}) -> None:
        """
        Execute Registered Callables
        :param status: The Status of the Event
        :type status: Any
        :param args: Additional Arguments
        :type args: Any
        :param kwargs: Additional Keyword Arguments
        :type kwargs: {str: Any}
        """
        for callback in self.callbacks:
            callback(status, *args, **kwargs)

    def register(self, callback: Callable) -> Callable:
        """
        Register Callable
        :param callback: Function to be called when Event is triggered
        :type callback: Callable
        :return: The Callable
        """
        self.callbacks.append(callback)
        return callback


class ImporterStatus(object):
    """
    ImporterStatus Decorator
    """
    __instance = None

    @staticmethod
    def get_importer_status() -> object:
        """
        Get ImporterStatus instance otherwise create a new ImporterStatus instance if it does not exist
        :return: The ImporterStatus
        """
        if ImporterStatus.__instance is None:
            ImporterStatus(Status(__name__))
        return ImporterStatus.__instance

    def __init__(self, status: Any) -> None:
        """
        Instantiate ImporterStatus Singleton Instance raise Exception if called directly
        :param status: Status of importer
        :type status: Any
        """
        if ImporterStatus.__instance is not None:
            raise Exception("ImporterStatus instance exists! \n Use  ImporterStatus.get_importer_status(status)")
        else:
            ImporterStatus.__instance = self
            self.changed = Event()
            self._status = status

    @property
    def status(self) -> Any:
        """
        Status Property
        :return: status
        """
        return self._status

    @status.setter
    def status(self, value: Any, *args: Any, **kwargs: {str: Any}) -> None:
        """
        Set status and notify Event to execute callbacks
        :param value: New value of status
        :type value: Any
        :param args: Additional Arguments
        :type args: Any
        :param kwargs: Additional Keyword Arguments
        :type kwargs: {str: Any}
        """
        self._status = value
        self.changed.notify(self, value, *args, **kwargs)


class Status:
    """
    Status Template Class
    """

    def __init__(self, name: str, **kwargs: {str: Any}) -> None:
        """
        Instantiate a Status object for ImporterStatus
        :param name: Callers Name
        :type name: str
        :param kwargs: Additional Key Arguments
        :type kwargs: {str: Any}
        """
        self.name = name
        for attr, value in kwargs.items():
            setattr(self, attr, value)

    def __str__(self) -> str:
        """
        Create String of the Status attributes
        :return: String of the Status attributes
        """
        return json.dumps(self.json())

    def json(self) -> {str: Any}:
        """
        Create JSON of Status Attributes
        :return: JSON Format of the Status Attributes
        """
        json_data = {"name": self.name}
        for k, v in self.__dict__.items():
            json_data[str(k)] = v
        return json_data

    @classmethod
    def exception(cls, name: str, function: str, exception: str) -> State:
        """
        Create an Exception Status
        :param name: __name__ of scope
        :type name: str
        :param function: name of function the Status was changed in
        :type function: str
        :param exception: Caught Exception message
        :type exception: str
        :return: Exception Status
        """
        return Status(name, function=function, exception=exception)

    @classmethod
    def resquest(cls, name: str, function: str, state: str, status_code: int = None, **kwargs: {str: Any}) -> State:
        """
        Create a Request Status
        :param name: __name__ of scope
        :type name: str
        :param function: name of function the Status was changed in
        :type function: str
        :param state: The state of the request
        :type state: str
        :param status_code: HTTP status code response
        :type status_code: int
        :return: Request Status
        """
        return Status(name, function=function, state=state, status_code=status_code, **kwargs)

    @classmethod
    def json_parser(cls, name: str, function, state: str) -> State:
        """
        Create a JSON Parser Status
        :param name: __name__ of scope
        :type name: str
        :param function: name of function the Status was changed in
        :type function: str
        :param state: state of the JSON parser
        :type state: str
        :return: JSON Parser Status
        """
        return Status(name, function=function, state=state)

    @classmethod
    def init_state(cls, name: str, importer: str) -> State:
        """
        Create __init__ Status
        :param name: __name__ of scope
        :type name: str
        :param importer: Importers name
        :type importer: str
        :return: Init Status
        """
        return Status(name, importer=importer)

    @classmethod
    def create_datasource(cls, name: str, state: str) -> State:
        """
        Create a Create_DataSource Status
        :param name: __name__ of scope
        :type name: str
        :param state: the current state of the create_data source method
        :type state: str
        :return: a Create_DataSource Status
        """
        return Status(name, state=state)

    @classmethod
    def general(cls, name: str, function: str, state: str) -> State:
        """
        Create a General Status
        :param name: __name__ of scope
        :type name: str
        :param function: name of function the Status was changed in
        :type function: str
        :param state: the current state of the create_data source method
        :type state: str
        :return: a General Status
        """
        return Status(name, function=function, state=state)
