## Setup procedure 

In order to enforce Celery's asynchronous functionality the following steps need to be followed:
1. The Redis data-structure store has to be installed and running as a service.
  - ```bash

    brew install redis
    brew services start 

    ```
2. In the Analytics directory, the following command has to executed in order to create a Celery worker
  - ```bash

    celery -A manage.celery_task worker -l info

    ```

When a GET request that contains the 'prediction' argument which is set to true is made to the /data endpoiint, the get_prediction method in 
/resources/request_for_data.py will be executed asynchronously by the Celery worker.
A task_id will be contained in the response to this request. The following GET request can then be used to retrieve the result of the get_prediction method:
  - /pred_status?task_id=<task_id returned by /data endpoint>
