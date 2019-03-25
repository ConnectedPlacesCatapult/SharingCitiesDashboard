class TokenExpired(Exception):
    """ Custom Exception for Importer for when the Token is expired and cannot be refresh"""

    def __init__(self, message) -> None:
        """
        Initiate Token Expired Exception
        :param message: Exception message
        """
        super().__init__(message)
