from http import HTTPStatus

import bcrypt
from flask import jsonify
from flask_jwt_extended import get_jwt_claims
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from flask_restful import abort
from flask_restful import reqparse, inputs
from sqlalchemy import exc

from models.users import Users

class EditUser(Resource):
	""" API resource class which changes user credentials and saves changes to the database
		
		A valid access JWT is required where the admin claim has to be True
		Parameters can be passed using a POST request that contains a JSON with the following fields:
		:required: 
			:param email: users current email address
			:type email: string
		:optional:
			:param fullname: users to be fullname 
			:param password: users to be password
			:param admin: users to be admin status 
			:param activated: users to be activated status 
			:type fullname: string
			:type password: string
			:type admin: boolean 
			:type activated: boolean
		
		:return: A message indicating success or failure and the corresponding response code 
		:rtype: JSON
	"""

	def __init__(self):

		# Create User (Post request parser)
		self.post_reqparser = reqparse.RequestParser()
		self.post_reqparser.add_argument('email', required=True, help="email field is required",  location=['form', 'json'], store_missing=False)
		self.post_reqparser.add_argument('fullname', required=False,  location=['form', 'json'], store_missing=False)
		self.post_reqparser.add_argument('password', required=False, location=['form', 'json'],store_missing=False)
		self.post_reqparser.add_argument('admin', type=inputs.boolean, required=False, location=['form', 'json'], store_missing=False)
		self.post_reqparser.add_argument('activated', type=inputs.boolean, required=False, location=['form', 'json'], store_missing=False)

	@jwt_required
	def post(self):

		if not get_jwt_claims()['admin']:
			abort(HTTPStatus.FORBIDDEN.value, error="administration privileges required")

		args = self.post_reqparser.parse_args()
		current_user = Users.find_by_email(args["email"])

		if current_user:
			if "fullname" in args:
				current_user.fullname = args["fullname"]

			if "activated" in args:
				current_user.activated = bool(args["activated"])

			if "admin" in args:
				current_user.admin = bool(args["admin"])

			if "password" in args:
				current_user.password = Users.generate_hash(args["password"].encode("utf8")).decode("utf8")

			try:
				current_user.commit()
			except Exception as e:
				return {"message":"failed saving details to database"}, 500
				

			return {"message":"success"},200

		else:
			return {"message":"error: could not find user"}, 403




