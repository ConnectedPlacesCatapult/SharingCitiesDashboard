from flask_restful import Resource, reqparse, inputs
from db import db
from models.users import Users
from datetime import datetime

from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, get_jwt_identity,get_jwt_claims)
from models.users import Users

#TODO: add doc string 

class Login(Resource):
	parser = reqparse.RequestParser()
	parser.add_argument('email', type=str, store_missing=False, help = 'This field cannot be blank', required = True)
	parser.add_argument('password', type=str, store_missing=False, help= 'This field cannot be blank', required = True)

	def post(self):
		args = self.parser.parse_args()
		current_user = Users.find_by_email(args['email']) #t

		if current_user: 
			if current_user.activated:
				# if Users.verify_hash(args['password'].encode("utf8"), current_user.password.encode("utf8")):
				if args['password'] == current_user.password:
					access_token = create_access_token(identity = current_user)
					refresh_token = create_refresh_token(identity = current_user)
					return {'message': 'Logged in as {}'.format(current_user.email), 'access_token': access_token, 'refresh_token': refresh_token}, 200
				else:
					return {'message': 'Incorrect credentials. Please try again'}, 403

			else:
				return {'message': 'User {} has not been activated. Please register when redirected to regirstration page'.format(current_user.email)}, 403
		else:
			return {'message': 'User {} does not exist. Please try again'.format(args["email"])}, 403

class SecretResource(Resource):
	@jwt_required
	def get(self):
		if get_jwt_claims()["admin"]:
			return {'answer': 42}, 200
		else:
			return {"message": "You do not have the priviledges to view this resource"}, 403
