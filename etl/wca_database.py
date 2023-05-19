from mysql import connector as MySQL
from config import getenv


_MYSQL_CONNECTION_OPTIONS = {
    "host": getenv('CUBINGZA_MYSQL_HOST', 'localhost'),
    "port": int(getenv('CUBINGZA_MYSQL_PORT', 4204)),
    "user": getenv('CUBINGZA_MYSQL_USER', 'wca'),
    "passwd": getenv('CUBINGZA_MYSQL_PASSWORD', 'wca'),
    "db": getenv('CUBINGZA_MYSQL_DATABASE', 'wca')
}

def get_wca_database_connection():
    conn = MySQL.connect(**_MYSQL_CONNECTION_OPTIONS)
    cursor = conn.cursor()
    return [conn, cursor]

