from datetime import datetime

def current_time():
    d = datetime.utcnow()
    return d.strftime('%d-%m-%Y %H:%M:%S')

def convert_to_date(date):
    d = None
    try:
        d = datetime.strptime(date, '%d-%m-%Y %H:%M:%S')
    except ValueError:
        return False, d
    return True, d