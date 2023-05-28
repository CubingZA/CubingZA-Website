#!/usr/bin/python3

import random
import string

from wca_database import get_wca_database_connection
from cubingza_database import get_cubingza_database_connection


def generate_random_email():
    return ''.join(random.choice(string.ascii_lowercase) for i in range(12)) + '@example.com'


def get_random_province():
    return random.choice(['GT', 'WC', 'EC', 'FS', 'KZ', 'none', 'other'])

def get_people(cursor):
    cursor.execute("""
        SELECT
            id,
            name
        FROM
            Persons
        WHERE
            countryId = "South Africa"
        ;
    """)
    return [{
        "wcaID": row[0],
        "name": row[1],
        "email": generate_random_email(),
        "homeProvince": get_random_province(),
    } for row in cursor.fetchall()]


def insert_people(db, people):
    print("Inserting people")

    for person in people:
        db['users'].update_one({'wcaID': person['wcaID']}, {'$set': person}, upsert=True)


if __name__ == "__main__":
    [wca_db, wca_cursor] = get_wca_database_connection()
    cubingza_db = get_cubingza_database_connection()

    people = get_people(wca_cursor)
    insert_people(cubingza_db, people)

    wca_db.close()

