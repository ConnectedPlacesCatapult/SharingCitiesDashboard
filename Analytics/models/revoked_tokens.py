'''
Data model class for storing decrypted access and refresh JWTs that have been revoked 
'''

from db import db

class RevokedTokens(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(200))
    
    def add(self):
        """ Adds the current values of the Users fields to SQLAlchemy session and then writes the changes to the database """
        db.session.add(self)
        db.session.commit()
    
    @classmethod
    def is_jti_blacklisted(cls, jti):
        """ Queries the revoked tokens table to determine if the provided JWT ID is presented and hence has been revoked
            :param jti: the JWT ID that is used when generating access and refresh JWTs
            :type jti: string
            :return: Whether the jti is present in the revoked tokens table
            :rtype: boolean
        """
        query = cls.query.filter_by(jti = jti).first()
        return bool(query)
