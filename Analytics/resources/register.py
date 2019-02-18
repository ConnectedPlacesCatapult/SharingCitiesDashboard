from flask_restful import Resource, reqparse, inputs
from db import db
from models.users import Users
from datetime import datetime

#TODO: add doc string 

class Register(Resource):
	parser = reqparse.RequestParser()
	parser.add_argument('fullname', type=str, store_missing=False) 
	parser.add_argument('email', type=str, store_missing=False, help = 'This field cannot be blank', required = True)
	parser.add_argument('password', type=str, store_missing=False,  help = 'This field cannot be blank', required = True)

	def post(self):
		args = self.parser.parse_args()
		current_user = Users.find_by_email(args['email']) #t
		if not current_user:
			return {'message': 'User {} is not authorised to access Sharing Cities Dashboard'. format(args['email'])}, 403 #t

		if not Users.verify_hash(args['password'].encode("utf8"), current_user.password.encode("utf8")):
			return {'message': 'The password entered does not correspond to the password sent to {}. Please try again'. format(args['email'])}, 403

# 		if not args['password'] == current_user.password:
# 			return {'message': 'The password entered does not correspond to the password sent to {}. Please try again'. format(args['email'])}, 403 #t


		current_user.activated = True #t
		current_user.commit()
		return {'message': '{}\'s account has been registered. Redirect to login'. format(args['email'])}, 201 #t

