#!/usr/bin/python3

from wca_database import get_wca_database_connection
from cubingza_database import get_cubingza_database_connection

from result_utils import format_result


_RANKS_QUERY = """
    SELECT
        personId,
        eventId,
        countryRank,
        best
    FROM wca.Ranks[type]
        LEFT JOIN Persons
            ON personId = Persons.id
    WHERE countryId = 'South Africa'
        AND countryRank > 0
        AND subid = 1
    ORDER BY countryRank;
    ;
"""


def get_rankings(cursor, single_or_average: str):
    print(f"Fetching WCA rankings for {single_or_average}")
    cursor.execute(_RANKS_QUERY.replace('[type]', single_or_average))
    ranks = [{
        'wcaID': row[0],
        'eventId': row[1],
        'countryRank': row[2],
        'best': format_result(row[3], row[1], single_or_average)
    } for row in cursor.fetchall()]
    return ranks


def get_za_people(db):
    print("Fetching South Africans people")
    results = db['users'].find({
        '$and': [
            {'wcaID': {'$exists': True}},
            {'homeProvince': {'$exists': True}},
            {'homeProvince': {'$nin': [None, '', 'none', 'other']}}
        ]
    })
    return [person for person in results]


def filter_and_link_cubingza_members(ranks, people):
    print("Filtering CubingZA members")
    wca_ids = [person['wcaID'] for person in people]
    ranks = [rank for rank in ranks if rank['wcaID'] in wca_ids]
    for rank in ranks:
        for person in people:
            if person['wcaID'] == rank['wcaID']:
                rank['personName'] = person['name']
                rank['userId'] = person['_id']
                rank['province'] = person['homeProvince']
                break
    return ranks


def assign_provincial_ranks(ranks):
    last_assigned_rank = {}
    for rank in ranks:
        if rank['eventId'] not in last_assigned_rank:
            last_assigned_rank[rank['eventId']] = {}
        if rank['province'] not in last_assigned_rank[rank['eventId']]:
            last_assigned_rank[rank['eventId']][rank['province']] = {'rank': 0, 'best': None, 'tiecount': 0}

        last = last_assigned_rank[rank['eventId']][rank['province']]

        if last['best'] is None or rank['best'] != last['best']:
            last['rank'] += last['tiecount'] + 1
            last['best'] = rank['best']
            last['tiecount'] = 0
        else:
            last['tiecount'] += 1

        rank['provinceRank'] = last['rank']
    return ranks


def write_rankings(db, ranks, single_or_average: str):
    print(f"Writing CubingZA rankings for {single_or_average}")
    collection = db[f'{single_or_average.lower()}rankings']
    collection.drop()
    collection.insert_many(ranks)


def process_provincial_rankings(people, single_or_average: str):
    ranks = get_rankings(cursor, single_or_average)
    ranks = filter_and_link_cubingza_members(ranks, people)
    ranks = assign_provincial_ranks(ranks)
    write_rankings(db, ranks, single_or_average)



if __name__ == "__main__":
    [conn, cursor] = get_wca_database_connection()
    db = get_cubingza_database_connection()

    people = get_za_people(db)

    process_provincial_rankings(people, 'Single')
    process_provincial_rankings(people, 'Average')

    cursor.close()
    conn.close()
