from pymongo import MongoClient as MongoDB
from config import getenv


_MONGO_CONNECTION_OPTIONS = {
    "host": getenv('CUBINGZA_MONGODB_HOST', 'localhost'),
    "port": getenv('CUBINGZA_MONGODB_PORT', 27017),
}
_MONGO_DATABASE = getenv('CUBINGZA_MONGODB_DATABASE', 'cubingza')


def get_cubingza_database_connection():
    db = MongoDB(**_MONGO_CONNECTION_OPTIONS)[_MONGO_DATABASE]
    return db
