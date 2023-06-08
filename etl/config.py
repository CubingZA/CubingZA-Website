from typing import TypeVar, Union

import os
from dotenv import load_dotenv


def init_environment():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    env_file = os.path.join(base_dir, '.env')
    load_dotenv(env_file)


T = TypeVar('T', str, int)

def getenv(key: str, default: T) -> T:
    value = os.getenv(key, default)
    if value is None:
        return default
    # The type checker thinks value can still be None on the return, but it can't
    # It also doesn't like that we're forcing the return type to be the
    # same type as the default, but that's what we want
    if type(default) is int:
        return int(value) # type: ignore
    return str(value) # type: ignore


init_environment()

