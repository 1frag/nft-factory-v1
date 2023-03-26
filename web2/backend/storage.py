import json
from typing import Any


class Storage:
    _file_name = './state.json'

    def __init__(self):
        self.state = json.load(open(self._file_name))

    def get(self, key: str) -> Any:
        return self.state[key]

    def append(self, key: str, value: Any):
        self.state[key].append(value)
        return self

    def save_key_with(self, key, prettifier):
        self.state[key] = prettifier(self.state[key])
        json.dump(self.state, open(self._file_name, 'w'))
        return self

    def remove(self, key, value):
        try:
            self.state[key].remove(value)
        except ValueError:
            print('already removed', key, value)
        return self


storage = Storage()
