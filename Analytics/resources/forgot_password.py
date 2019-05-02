import http.client
import logging
import random
import sys
import flask
import sendgrid
from flask_restful import Resource, reqparse
from sendgrid.helpers.mail import Email, Content, Mail
from models.users import Users
sys.path.append("../..")
from settings import GetConfig

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


@GetConfig('ForgotPassword', 'sendgrid')
class ForgotPassword(Resource):
    """
    API resource class. Allow user to reset their password to a system
    generated password that is sent to them via email.
    Parameters can be passed using a POST request that contains a JSON with
    the  following fields:
    :param email: User's email
    :type email: string
    :return: A message indicating whether the the process was successful and
    the corresponding response code

    NOTE: The Sendgrid API key has to be set in the OS environment variables in
    order for the forgot password email to be sent. Use the commands below
    : echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
    : source ./sendgrid.env
    """

    parser = reqparse.RequestParser()
    parser.add_argument("email")

    def post(self) -> (str, int):
        """
        POST request endpoint. Set user password to a system generated
        password and send password to user's email
        """

        args = self.parser.parse_args()
        current_user = Users.find_by_email(args["email"])

        if current_user:
            system_password = self.generate_random_password(
                self.system_password_length)

            if self.send_forgot_password_email(current_user.fullname,
                                               current_user.email,
                                               system_password):
                current_user.password = Users.generate_hash(
                    system_password.encode("utf8")).decode("utf8")
                current_user.commit()
                return {"message": "success"}, 200
            else:
                return {"message": "could not send email"}, 500
        else:
            return {"message": "cannot find user"}, 403

    @staticmethod
    def generate_random_password(length: int) -> str:
        """
        Create a randomly generated password
        :param length: the number of characters that the randomly generated 
        password will contain
        """

        charset = \
            "abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789<" \
            ">/{{}}[]()*&^%$#@"
        return ''.join(random.choice(charset) for _ in range(length))

    def send_forgot_password_email(self, name: str, email: str,
                                   new_password: str) -> bool:

        """
        Send email to a user containing their new system generated password
        """

        text_version = self.text_template.format(username=name,
                                                 password=new_password)
        html_version = flask.render_template(
            self.html_template, username=name,
            password=new_password)

        sg = sendgrid.SendGridAPIClient(
            apikey=self.api_key)

        from_email = Email(self.sender_email)
        to_email = Email(email)
        subject = self.email_subject
        content_text = Content("text/plain", text_version)
        send_new_password_email = Mail(from_email, subject, to_email,
                                       content_text)
        content_html = Content("text/html", html_version)
        send_new_password_email.add_content(content_html)

        try:
            email_response = sg.client.mail.send.post(
                request_body=send_new_password_email.get())
            logger.info("Sent forgot password email to {} with "
                        "response code : {}".format(email,
                                                    email_response.status_code))
            return True
        except http.client.IncompleteRead as e:
            logger.error("Sendgrid API Key may not be set correctly", e)
            return False
