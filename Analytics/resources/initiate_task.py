import threading
import time

'''Creates a thread for every analytics task.

It doesn't take advantage of sending the task to different cpu's.
Sending the tasks to different CPU's will be added in future iterations.

Params:
    `task_id`: Integer
    `dataset`: A pandas dataframe
    `package_name`: Absolute path of the package name that contains the class
                    to fit and predict the data
    `prediction_class`: Name of the prediction class
    `callback`: a url to send back the status of the task

'''

class InitiateTask(threading.Thread):
    def __init__(self, task_id, dataset, package_name, prediction_class, callback):
        self.task_id = task_id
        self.dataset = dataset
        self.package_name = package_name
        self.prediction_class = prediction_class
        self.callback = callback

    def run(self):
        package = __import__(self.package_name)
        _pclass = getattr(package, self.prediction_class)
        forecast = _pclass(self.dataset)
