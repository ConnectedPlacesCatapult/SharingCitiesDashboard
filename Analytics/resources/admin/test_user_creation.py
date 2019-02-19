import json
import random
import unittest
import urllib.parse
import urllib.request

from urllib.error import HTTPError
from models.users import Users



class UserCreationTests(unittest.TestCase):

    def setUp(self):

        self.fullname = "abcdefg hijklmnop"
        self.email = "james.bond@email.com"
        self.password = "password"

        self.url = "http://0.0.0.0:8005/admin"
        self.jwt_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTA0MDczMDUsIm5iZiI6MTU1MD" \
                                "QwNzMwNSwianRpIjoiOWUyNjc4YWUtNjU5Ny00Mjg2LWFlMmUtNzMzOTI0NDlmYmMzIiwiZXhwI" \
                                "joxNTUxMDEyMTA1LCJpZGVudGl0eSI6ImphbWVzLmJvbmRAZW1haWwuY29tIiwiZnJlc2giOmZh" \
                                "bHNlLCJ0eXBlIjoiYWNjZXNzIiwidXNlcl9jbGFpbXMiOnsiYWRtaW4iOnRydWV9fQ.G80Kgoqa" \
                                "YroMvb-_bx_GADcynFq90MgO2YB8Jgwa4kY" #self.login_user()

        self.auth = 'Bearer {}'.format(self.jwt_access_token)
        self.http_headers = {'Content-Type': 'application/json',
                             'Authorization': self.auth}





    def login_user(self, email=None, password=None):

        data = json.dumps({"email": self.email,
                           "password": self.password,
                           }).encode("ascii")

        request = urllib.request.Request('http://0.0.0.0:8005/login', data, method='POST')
        response = self.send_request(request)
        if "message" in response and "access_token" in response and "refresh_token" in response:
            return response["access_token"]
        else:
            print(response)
            return None



    def create_user_request(self):
        data = json.dumps({"email": self.email,
                           "fullname": self.fullname,
                           "admin": random.choice([True, False])
                           }).encode("ascii")

        return urllib.request.Request(self.url, data, self.http_headers, method='POST')

    def delete_user_request(self):
        data = json.dumps({"email": self.email}).encode("ascii")
        return urllib.request.Request(self.url, data, self.http_headers, method='DELETE')

    def get_user_request(self):
        data = json.dumps({"email": self.email}).encode("ascii")
        return urllib.request.Request("http://0.0.0.0:8005/admin", data, self.http_headers, method='GET')

    def send_request(self, request):
        json_response = dict()

        try:
            response = urllib.request.urlopen(request).read()
            json_response = json.loads(response.decode())
        except HTTPError as error:
            json_response = json.loads(error.read())
        #print("\n\nJSON Response:  {} \n\n".format(json_response))
        return json_response

    def test_create_user_db_entry(self):
        response = self.send_request(self.create_user_request())
        if "error" in response:
            self.assertEqual(response["error"], "User email exists. email address must be unique")
            return

        elif "user" in response:
            expected_response = "User {} created successfully".format(self.email)
            self.assertEqual(response["user"], expected_response)
            return

        assert False

    def test_get_user_db_entry(self):
        response = self.send_request(self.get_user_request())

        if "error" in response:
            assert response["error"] == "User not found"
            return

        elif "id" in response and "email" in response and "admin" in response and "activated" in response:
            assert response["email"] == self.email and response["fullname"] == self.fullname \
                   and response["admin"] and not response["activated"]
            return

        assert False

    def test_delete_user_db_entry(self):
        response = self.send_request(self.delete_user_request())

        if "user" in response:
            expected_response = '{} removed'.format(self.email)
            self.assertEqual(response["user"], expected_response)
            return
        elif "error" in response:
            self.assertEqual(response["error"], "user not found")
            return

        assert False

    def test_value_error_email_address_checker(self):
        with self.assertRaises(ValueError):
            fake_email = "freddy.email.com"
            Users.email_regex_checker(fake_email)

    def test_email_checker_list(self):
        email_list = ['sam@sam.com', 'me@me.com', 'test@test.com', 'hey@hey.com', 'james@james.com',
                      'what@what.com', 'me2@me.com', 'h@h.com', 'sean.cunningham@crownpeak.com',
                      'freddy.lenzy@jeffrey.co.ku']
        try:
            for email in email_list:
                Users.email_regex_checker(email)
            self.assertTrue(True)
        except ValueError:
            self.assertTrue(False)





if __name__ == '__main__':
    unittest.main()
