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
        :param args: Additional Arguments
        :param kwargs: Additional Keyword Arguments
        """
        for callback in self.callbacks:
            callback(status, *args, **kwargs)

    def register(self, callback: Callable) -> Callable:
        """
        Register Callable
        :param callback: Function to be called when Event is triggered
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
        :param args: Additional Arguments
        :param kwargs: Additional Keyword Arguments
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
        :param kwargs: Additional Key Arguments
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
        :param function: name of function the Status was changed in
        :param exception: Caught Exception message
        :return: Exception Status
        """
        return Status(name, function=function, exception=exception)

    @classmethod
    def resquest(cls, name: str, function: str, state: str, status_code: int = None, **kwargs: {str: Any}) -> State:
        """
        Create a Request Status
        :param name: __name__ of scope
        :param function: name of function the Status was changed in
        :param state: The state of the request
        :param status_code: HTTP status code response
        :return: Request Status
        """
        return Status(name, function=function, state=state, status_code=status_code, **kwargs)

    @classmethod
    def json_parser(cls, name: str, function, state: str) -> State:
        """
        Create a JSON Parser Status
        :param name: __name__ of scope
        :param function: name of function the Status was changed in
        :param state: state of the JSON parser
        :return: JSON Parser Status
        """
        return Status(name, function=function, state=state)

    @classmethod
    def init_state(cls, name: str, importer: str) -> State:
        """
        Create __init__ Status
        :param name: __name__ of scope
        :param importer: Importers name
        :return: Init Status
        """
        return Status(name, importer=importer)

    @classmethod
    def create_datasource(cls, name: str, state: str) -> State:
        """
        Create a Create_DataSource Status
        :param name: __name__ of scope
        :param state: the current state of the create_data source method
        :return: a Create_DataSource Status
        """
        return Status(name, state=state)

    @classmethod
    def general(cls, name: str, function: str, state: str) -> State:
        """
        Create a General Status
        :param name: __name__ of scope
        :param function: name of function the Status was changed in
        :param state: the current state of the create_data source method
        :return: a General Status
        """
        return Status(name, function=function, state=state)

    @classmethod
    def success(cls, importer_name: str) -> State:
        """
        Create Success Status
        :param importer_name: Name of calling class
        :return: Success Status
        """
        return Status(importer_name, state="success")

    @classmethod
    def failure(cls, importer_name: str, reason: str, stack_trace: str) -> State:
        """
        Create Failure Status
        :param importer_name: Name of importer class
        :param reason: Reason for failure
        :param stack_trace: stack trace when error occurred
        :return: failure Status
        """
        return Status(importer_name, state="failure", reason=reason, stack_trace=stack_trace)
