from flask_restful import Resource, reqparse
from flask_jwt_extended import  jwt_refresh_token_required, jwt_required, get_jwt_identity, create_access_token, get_raw_jwt
from models.users import Users

class ChangePassword(Resource):
	"""API that allows a user change their password in the users table 
	   Parameters can be passed using a POST request that contains a JSON with the following fields:
        :param email: users email address
        :param password_old: users current password
        :param password_new: users new password that they want to replace password_old
        :type email: string
        :type password_old: string
        :type password_new: string 
        :return: A message that indicates whether a user's password has been updated. If they have not, the message indicates why not.
        :rtype: JSON
	"""
	parser = reqparse.RequestParser()
	parser.add_argument('email', type=str, store_missing=False, help = 'This field cannot be blank', required = True)
	parser.add_argument('password_old', type=str, store_missing=False, help = 'This field cannot be blank', required = True)
	parser.add_argument('password_new', type=str, store_missing=False, help= 'This field cannot be blank', required = True)

	@jwt_required
	def patch(self):
		args = self.parser.parse_args()
		current_user = Users.find_by_email(args['email']) #t

		if current_user and Users.verify_hash(args['password_old'].encode("utf8"), current_user.password.encode("utf8")):
			#  could include password strength check
			current_user.password = Users.generate_hash(args["password_new"].encode("utf8")).decode("utf8") # decode necessary so that string (and not binary) is stored in the DB
			current_user.commit()
			return {"message": "Password has been updated"}, 200
		else:
			return {"message": "Incorrect credentials. Please Try again"},403
