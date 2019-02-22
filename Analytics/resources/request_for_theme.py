"""
API for retrieving theme data from database
	One of these parameters can be passed with url using get requests
	:param theme: accepts an integer id and return subthemes for that theme
	:param subtheme: accepts an integer id and returns all the attributes 
				associated with the subtheme
	:type theme: string
	:type subtheme: string
	:return: the requested theme data from the database
	:rtype JSON
"""


from flask_restful import Resource, reqparse, inputs
from db import db
from models.theme import Theme
from models.attributes import Attributes
from models.theme import SubTheme


class RequestForTheme(Resource):
	parser = reqparse.RequestParser()
	parser.add_argument('theme', type=str, store_missing=False)
	parser.add_argument('subtheme', type=str, store_missing=False)

	def get(self):
		args = self.parser.parse_args()
		theme, subtheme = None, None
		
		if "subtheme" in args:
			subtheme = args['subtheme']
			if subtheme is not None and subtheme != '':
				attributes = Attributes.get_by_sub_theme_id(subtheme)
				return [a.json() for a in attributes], 200
		elif "theme" in args:
			theme = args['theme']
			if theme != "":
				subthemes = SubTheme.get_by_theme_id(theme)
				return [a.json() for a in subthemes], 200


		if theme is None and subtheme is None:
			themes = Theme.get_all()
			return [a.json() for a in themes], 200

	
		return {
			"error": "error occured while processing request"
		}, 400



		
