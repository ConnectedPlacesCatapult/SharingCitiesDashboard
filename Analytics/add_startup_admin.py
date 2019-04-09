import logging
from datetime import datetime
from getpass import getpass

import bcrypt
import sqlalchemy
from flask_script import Command
from sqlalchemy.exc import IntegrityError, ProgrammingError

from settings.get_config_decorator import GetConfig

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


@GetConfig('AddStartupAdmin', 'postgres')
class AddStartupAdmin(Command):
    """
    Helper Class

    This class can be used to add a superuser
    A superuser can be added using the following commmand:
        python manage.py add_superuser

    """

    def __init__(self):
        """
        Create a local sqlalchemy engine that connects to the database
        defined in settings.py
        """

        db_uri = '%s://%s:%s@%s/%s' % (self.db_psql_base_uri, self.db_username,
                                       self.db_password, self.db_host,
                                       self.db_name)
        self.engine = sqlalchemy.create_engine(db_uri)

    def run(self):
        """
        Prompt an admin individual for their fullname, email, password and
        persist these details in the users table
        """

        logger.info(" ADD ADMIN USER")
        logger.info(" Complete the following details ...")
        fullname = input("Fullname: ")
        email = input("Email: ")
        pswd = getpass()
        pswd = bcrypt.hashpw(pswd.encode("utf8"), bcrypt.gensalt()).decode(
            "utf8")

        sql_text = sqlalchemy.text("insert into users(fullname,email,"
                                   "password,admin,activated, timestamp) "
                                   "values('{}','{}','{}',{},{},'{}')".
                                   format(fullname, email, pswd, True, False,
                                          datetime.now()))
        try:
            with self.engine.connect() as con:
                con.execute(sql_text)

            logger.info(" Successfully added {} to users table.".format(email))
        except IntegrityError:
            logger.error(" Unsuccessful. User {} already exists".format(email))
        except ProgrammingError as e:
            logger.error(" Unsuccessful on error:\n{}".format(e))


if __name__ == '__main__':
    adm = AddStartupAdmin()
    adm.run()
