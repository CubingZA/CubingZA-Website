from pymongo import MongoClient as MongoDB
from config import getenv


_MONGO_CONNECTION_OPTIONS = {
    "host": getenv('CUBINGZA_MONGO_HOST', 'localhost'),
    "port": getenv('CUBINGZA_MONGO_PORT', 27017),
}
_MONGO_DATABASE = getenv('CUBINGZA_MONGO_DATABASE', 'cubingza')


def get_cubingza_database_connection():
    db = MongoDB(**_MONGO_CONNECTION_OPTIONS)[_MONGO_DATABASE]
    return db
