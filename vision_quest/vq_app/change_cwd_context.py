import os
from contextlib import contextmanager

@contextmanager
def change_cwd(new_cwd):
    saved_cwd = os.getcwd()
    os.chdir(new_cwd)
    try:
        yield
    finally:
        os.chdir(saved_cwd)