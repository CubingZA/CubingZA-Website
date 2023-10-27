#!/usr/bin/python3

import datetime

from wca_database import get_wca_database_connection
from cubingza_database import get_cubingza_database_connection

from result_utils import format_result


EXCLUDE_EVENTS = ["333mbo", "magic", "mmagic", "333ft"]


PREP_ZAPEOPLE_SQL = """
    CREATE TABLE ZAPeople AS
    SELECT
        id,
        name
    FROM
        Persons
    WHERE
        countryId = "South Africa"
    ;
"""

PREP_ZASINGLERECORDS_SQL = """
    CREATE TABLE ZASingleRecords AS
    SELECT
        eventId, best, ZAPeople.id AS personId, ZAPeople.name
    FROM
        (SELECT eventId, best, personId FROM RanksSingle WHERE countryRank = 1) AS Records
        INNER JOIN ZAPeople
            ON Records.personId = ZAPeople.id
    ;
"""

PREP_ZAAVERAGERECORDS_SQL = """
    CREATE TABLE ZAAverageRecords AS
    SELECT
        eventId, best, ZAPeople.id AS personId, ZAPeople.name
    FROM
        (SELECT eventId, best, personId FROM RanksAverage WHERE countryRank=1) AS Records
        INNER JOIN ZAPeople
            ON Records.personId = ZAPeople.id
    ;
"""

PREP_ZARESULTS_SQL = """
    CREATE TABLE ZAResults AS
    SELECT
        competitionId, eventId, best, average, personId
    FROM
        Results
    WHERE
        personCountryId = "South Africa"
    ;
"""

GET_COMP_DATE_SQL = """
    SELECT
        year, month, day
    FROM
        ZAResults LEFT JOIN Competitions ON ZAResults.competitionId = Competitions.id
    WHERE
        ZAResults.singleaverage=%s AND ZAResults.eventId=%s AND ZAResults.personId=%s
    ;
"""

FETCH_RECORD_TYPE_SQL = """
    SELECT
        Events.id AS eventId,
        Events.name AS eventName,
        Events.rank AS eventRank,
        ZARecordsTable.best AS result,
        ZARecordsTable.personId AS id,
        ZARecordsTable.name AS name
    FROM
        ZARecordsTable
        LEFT JOIN
            Events
        ON
            Events.id = ZARecordsTable.eventId
    ORDER BY
        eventRank
    ;
"""


FETCH_RECORDS_SQL = """
    SELECT
        Events.id AS eventId,
        Events.name AS eventName,
        Events.rank AS eventRank,
        ZASingleRecords.personId AS singleId,
        ZASingleRecords.name AS singleName,
        ZASingleRecords.best AS singleResult,
        ZAAverageRecords.personId AS averageId,
        ZAAverageRecords.name AS averageName,
        ZAAverageRecords.best AS averageResult
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
"""

def prepare_temp_tables(cursor):
    print('Preparing temporary tables')

    print('Finding South Africans')
    cursor.execute("DROP TABLE IF EXISTS ZAPeople;")
    cursor.execute(PREP_ZAPEOPLE_SQL)

    print('Extracting single records')
    cursor.execute("DROP TABLE IF EXISTS ZASingleRecords;")
    cursor.execute(PREP_ZASINGLERECORDS_SQL)

    print('Extracting average records')
    cursor.execute("DROP TABLE IF EXISTS ZAAverageRecords;")
    cursor.execute(PREP_ZAAVERAGERECORDS_SQL)

    print('Extracting results')
    cursor.execute("DROP TABLE IF EXISTS ZAResults;")
    cursor.execute(PREP_ZARESULTS_SQL)


def get_records_of_type(cursor, record_table, result_field, single_or_average):
    print('Fetching Records...')
    cursor.execute(FETCH_RECORD_TYPE_SQL
        .replace('ZARecordsTable', record_table))

    raw_records = cursor.fetchall()

    record = {}
    for row in raw_records:
        event_id = row[0]

        if event_id in EXCLUDE_EVENTS:
            continue

        result = row[3]
        person_id = row[4]
        person_name = row[5]

        date = get_date_for_record(cursor, result, event_id, person_id, result_field, single_or_average)

        if event_id not in record.keys():
            record[event_id] = {
                'eventId': event_id,
                'eventName': row[1],
                'eventRank': row[2],
                'result': format_result(result, event_id, single_or_average),
                'resultRaw': result,
                'id': [person_id],
                'name': [row[5]],
                'date': [date],
            }
        else:
            record[event_id]['id'].append(person_id)
            record[event_id]['name'].append(person_name)
            record[event_id]['date'].append(date)

    return record


def get_date_for_record(cursor, result, event_id, person_id, result_field, single_or_average):

    print(f'Establishing dates of {single_or_average} records for {event_id}')

    cursor.execute(GET_COMP_DATE_SQL.replace('singleaverage',result_field), (result, event_id, person_id))

    date = cursor.fetchall()

    if len(date) > 0:
        date = date[0]
        return datetime.date(*date).isoformat()
    else:
        return None


def get_wca_records(cursor):
    singles = get_records_of_type(cursor, 'ZASingleRecords', 'best', 'single')
    averages = get_records_of_type(cursor, 'ZAAverageRecords', 'average', 'average')

    # Merge singles and averages
    records = {}
    for event_id in singles.keys():
        records[event_id] = {
            'eventId': event_id,
            'eventName': singles[event_id]['eventName'],
            'eventRank': singles[event_id]['eventRank'],
            'singleResult': singles[event_id]['result'],
            'singleId': singles[event_id]['id'],
            'singleName': singles[event_id]['name'],
            'singleDate': singles[event_id]['date'],
            'singleResultRaw': singles[event_id]['resultRaw'],
        }

    for event_id in averages.keys():
        records[event_id]['averageResult'] = averages[event_id]['result']
        records[event_id]['averageId'] = averages[event_id]['id']
        records[event_id]['averageName'] = averages[event_id]['name']
        records[event_id]['averageDate'] = averages[event_id]['date']
        records[event_id]['averageResultRaw'] = averages[event_id]['resultRaw']

    records = [records[event_id] for event_id in records.keys()]
    records.sort(key=lambda x: x['eventRank'])

    return records


def update_cubingza_records(new_records):
    db = get_cubingza_database_connection()
    for record in new_records:
        print('Updating database for', record['eventName'])
        db.records.update_one({'eventId': record['eventId']}, {"$set": record})


if __name__ == "__main__":
    [conn, cursor] = get_wca_database_connection()

    prepare_temp_tables(cursor)
    wca_records = get_wca_records(cursor)
    wca_records = [record for record in wca_records if record['eventId'] not in EXCLUDE_EVENTS]
    update_cubingza_records(wca_records)

    cursor.close()
    conn.close()
