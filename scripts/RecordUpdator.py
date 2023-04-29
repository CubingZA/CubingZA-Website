#!/usr/bin/python3

import math
import datetime

from pymongo import MongoClient as MongoDB
from mysql import connector as MySQL


def formatTime(result, includeZeroMinutes=False):
    seconds = result % 60
    minutes = math.floor(result/60)

    if minutes>0 or includeZeroMinutes:
        return '{:.0f}:{:05.2f}'.format(minutes, seconds)
    else:
        return '{:.2f}'.format(seconds)



def formatResultStr(result, eventId, singleAverage):
    if result is None or result=='':
        return ''
    if eventId=='333fm':
        if singleAverage=='single':
            return str(result)
        else:
            return str(result/100)
    elif eventId=='333mbf':
        if result > 999999999:
            raise Exception('Old style multiblind not supported');
        else:
            difference = 99-math.floor(result / 10000000)
            remainder = result % 10000000
            time = formatTime(math.floor(remainder / 100), True)[:-3]
            missed = remainder % 100
            solved = difference + missed
            total = solved + missed
            return('{:.0f}/{:.0f} '.format(solved, total) + time)

    else:
        return formatTime(result/100)


def getDatabaseConnection():
    conn = MySQL.connect(host="localhost", port=4204, user="wca", passwd="wca", db="wca")
    cursor = conn.cursor()
    return [conn, cursor]


# Fetch records from WCA database

def prepareTempTables(cursor):
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


def getWCArecords(cursor):

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
               'singleResult':  formatResultStr(row[4],row[0],'single'),
               'averageId':  row[5],
               'averageName':  row[6],
               'averageResultRaw':  row[7],
               'averageResult':  formatResultStr(row[7],row[0],'average'),
               'eventRank': row[8]}
               for row in cursor.fetchall()]

    # For each record, attach a date
    for record in records:

        print('Establishing dates of records for', record['eventName'])

        sqlQuery = '''
            SELECT
                year, month, day
            FROM
                Results LEFT JOIN Competitions ON Results.competitionId = Competitions.id
            WHERE
                Results.singleaverage=%s AND Results.eventId=%s AND Results.personId=%s;
            '''
        cursor.execute(sqlQuery.replace('singleaverage','best'), (record['singleResultRaw'], record['eventId'], record['singleId']))


        date = list(cursor.fetchall()[0])
        record['singleDate'] = datetime.date(*date).isoformat()

        cursor.execute(sqlQuery.replace('singleaverage','average'), (record['averageResultRaw'], record['eventId'], record['averageId']))
        date = cursor.fetchall()
        if len(date) > 0:
            date = date[0]
            record['averageDate'] = datetime.date(*date).isoformat()
        else:
            record['averageDate'] = None


    conn.close()

    return records



def updateCubingZARecords(newRecords):

    db = MongoDB(port=4203)['cubingza'];
    for newRecord in newRecords:
        print('Updating database for', newRecord['eventName'])
        db.records.update({'eventId': newRecord['eventId']}, {"$set": newRecord})


if __name__ == "__main__":
    [conn, cursor] = getDatabaseConnection()

    prepareTempTables(cursor)
    wcaRecords = getWCArecords(cursor)
    updateCubingZARecords(wcaRecords)

    cursor.close()
    conn.close();
