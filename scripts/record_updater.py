#!/usr/bin/python3

import datetime

from wca_database import get_wca_database_connection
from cubingza_database import get_cubingza_database_connection

from result_utils import format_result


EXCLUDE_EVENTS = ["333mbo", "magic", "mmagic", "333ft"]


def prepare_temp_tables(cursor):
    print('Preparing temporary tables')

    print('Finding South Africans')
    cursor.execute("DROP TABLE IF EXISTS ZAPeople;")
    cursor.execute("""
        CREATE TABLE ZAPeople AS
        SELECT
            id,
            name
        FROM
            Persons
        WHERE
            countryId = "South Africa"
        ;
    """)

    print('Extracting single records')
    cursor.execute("DROP TABLE IF EXISTS ZASingleRecords;")
    cursor.execute("""
        CREATE TABLE ZASingleRecords AS
        SELECT
            eventId, best, ZAPeople.id AS personId, ZAPeople.name
        FROM
            (SELECT eventId, best, personId FROM RanksSingle WHERE countryRank = 1) AS Records
            INNER JOIN ZAPeople
                ON Records.personId = ZAPeople.id
        ;
    """)

    print('Extracting average records')
    cursor.execute("DROP TABLE IF EXISTS ZAAverageRecords;")
    cursor.execute("""
        CREATE TABLE ZAAverageRecords AS
        SELECT
            eventId, best, ZAPeople.id AS personId, ZAPeople.name
        FROM
            (SELECT eventId, best, personId FROM RanksAverage WHERE countryRank=1) AS Records
            INNER JOIN ZAPeople
                ON Records.personId = ZAPeople.id
        ;
    """)


def get_wca_records(cursor):

    print('Fetching Records...')
    cursor.execute("""
        SELECT
            Events.id AS eventId,
            Events.name AS eventName,
            ZASingleRecords.personId AS singleId,
            ZASingleRecords.name AS singleName,
            ZASingleRecords.best AS singleResult,
            ZAAverageRecords.personId AS averageId,
            ZAAverageRecords.name AS averageName,
            ZAAverageRecords.best AS averageResult,
            Events.rank AS eventRank
        FROM
            ZASingleRecords   LEFT JOIN   ZAAverageRecords
            ON
                ZASingleRecords.eventId = ZAAverageRecords.eventId
            LEFT JOIN
                Events
            ON
                Events.id = ZASingleRecords.eventId
        ORDER BY
            eventRank
        ;
        """)

    records = [{'eventId': row[0],
               'eventName': row[1],
               'singleId':  row[2],
               'singleName':  row[3],
               'singleResultRaw':  row[4],
               'singleResult':  format_result(row[4],row[0],'single'),
               'averageId':  row[5],
               'averageName':  row[6],
               'averageResultRaw':  row[7],
               'averageResult':  format_result(row[7],row[0],'average'),
               'eventRank': row[8]}
               for row in cursor.fetchall()]

    # For each record, attach a date
    for record in records:
        if record['eventName'] in EXCLUDE_EVENTS:
            continue

        print('Establishing dates of records for', record['eventName'])

        sql_query = '''
            SELECT
                year, month, day
            FROM
                Results LEFT JOIN Competitions ON Results.competitionId = Competitions.id
            WHERE
                Results.singleaverage=%s AND Results.eventId=%s AND Results.personId=%s;
            '''
        cursor.execute(sql_query.replace('singleaverage','best'), (record['singleResultRaw'], record['eventId'], record['singleId']))


        date = list(cursor.fetchall()[0])
        record['singleDate'] = datetime.date(*date).isoformat()

        cursor.execute(sql_query.replace('singleaverage','average'), (record['averageResultRaw'], record['eventId'], record['averageId']))
        date = cursor.fetchall()
        if len(date) > 0:
            date = date[0]
            record['averageDate'] = datetime.date(*date).isoformat()
        else:
            record['averageDate'] = None

    conn.close()
    return records


def update_cubingza_records(new_records):
    db = get_cubingza_database_connection()
    for record in new_records:
        print('Updating database for', record['eventName'])
        print(record)
        db.records.update_one({'eventId': record['eventId']}, {"$set": record})


if __name__ == "__main__":
    [conn, cursor] = get_wca_database_connection()

    prepare_temp_tables(cursor)
    wca_records = get_wca_records(cursor)
    wca_records = [record for record in wca_records if record['eventId'] not in EXCLUDE_EVENTS]
    update_cubingza_records(wca_records)

    cursor.close()
    conn.close()
