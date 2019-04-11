from flask_script import Command, Option

from settings.get_config_decorator import GetConfig


@GetConfig('GunicornServer', 'gunicorn_server')
class GunicornServer(Command):
    """
    Startup Green Unicorn server
    """

    description = 'Run the app within Gunicorn'

    def __init__(self, host: str = "localhost",
                 port: int = 5000,
                 workers: int = 4, override: bool = False):
        """
        Set Host, Port and Worker count for Gunicorn server
        :param host: Host URI
        :param port: Network port
        :param workers: Number of workers
        :param override: Override defaults set by GetConfig decorator if true
               otherwise use defaults set by GetConfig decorator
        """
        if override:
            self.gunicorn_host = host
            self.gunicorn_port = port
            self.gunicorn_workers = workers

    def get_options(self) -> tuple:
        """
        Get Options
        :return:  Options
        """
        return (
            Option('-H', '--host',
                   dest='host',
                   default=self.gunicorn_host),

            Option('-p', '--port',
                   dest='port',
                   type=int,
                   default=self.gunicorn_port),

            Option('-w', '--workers',
                   dest='workers',
                   type=int,
                   default=self.gunicorn_workers),
        )

    def __call__(self, app: object, host: str, port: int, workers: int) -> None:
        """
        Start Gunicorn Server
        :param app:
        :param host:
        :param port:
        :param workers:
        """

        from gunicorn import version_info

        if version_info < (0, 9, 0):
            from gunicorn.arbiter import Arbiter
            from gunicorn.config import Config
            arbiter = Arbiter(Config({'bind': "%s:%d" % (host, int(port)),
                                      'workers': workers}), app)
            arbiter.run()
        else:
            from gunicorn.app.base import Application

            class FlaskApplication(Application):
                def init(self, parser, opts, args):
                    return {
                        'bind': '{0}:{1}'.format(host, port),
                        'workers': workers
                    }

                def load(self):
                    return app

            FlaskApplication().run()
