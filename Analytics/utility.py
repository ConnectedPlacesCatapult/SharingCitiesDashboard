from datetime import datetime

def current_time():
    d = datetime.utcnow()
    return d.strftime('%d-%m-%Y %H:%M:%S')