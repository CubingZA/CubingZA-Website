import math


def format_time(result, include_zero_minutes=False):
    seconds = result % 60
    minutes = math.floor(result/60)

    if minutes>0 or include_zero_minutes:
        return '{:.0f}:{:05.2f}'.format(minutes, seconds)
    else:
        return '{:.2f}'.format(seconds)


def format_result(result, event_id, single_or_average):
    if result is None or result=='':
        return ''
    if event_id=='333fm':
        if single_or_average=='single':
            return str(result)
        else:
            return str(result/100)
    elif event_id=='333mbf':
        if result > 999999999:
            raise Exception('Old style multiblind not supported')
        else:
            difference = 99-math.floor(result / 10000000)
            remainder = result % 10000000
            time = format_time(math.floor(remainder / 100), True)[:-3]
            missed = remainder % 100
            solved = difference + missed
            total = solved + missed
            return('{:.0f}/{:.0f} '.format(solved, total) + time)

    else:
        return format_time(result/100)
